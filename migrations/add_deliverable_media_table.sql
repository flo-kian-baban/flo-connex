-- Create deliverable_media table for storing metadata about uploaded deliverables
CREATE TABLE IF NOT EXISTS deliverable_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    deliverable_label TEXT NOT NULL,
    storage_bucket TEXT NOT NULL DEFAULT 'connex-deliverables',
    storage_path TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    uploaded_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups by application
CREATE INDEX IF NOT EXISTS idx_deliverable_media_application_id ON deliverable_media(application_id);

-- Create index for faster lookups by uploader
CREATE INDEX IF NOT EXISTS idx_deliverable_media_uploaded_by ON deliverable_media(uploaded_by_user_id);

-- Enable RLS
ALTER TABLE deliverable_media ENABLE ROW LEVEL SECURITY;

-- Policy: Creators can insert deliverables for their own applications
CREATE POLICY "Creators can upload deliverables for their applications"
ON deliverable_media
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = deliverable_media.application_id
        AND applications.creator_id = auth.uid()
    )
);

-- Policy: Creators can view their own uploaded deliverables
CREATE POLICY "Creators can view their own deliverables"
ON deliverable_media
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM applications
        WHERE applications.id = deliverable_media.application_id
        AND applications.creator_id = auth.uid()
    )
);

-- Policy: Providers can view deliverables for applications to their offers
CREATE POLICY "Providers can view deliverables for their offers"
ON deliverable_media
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM applications
        INNER JOIN offers ON applications.offer_id = offers.id
        INNER JOIN providers ON offers.provider_id = providers.id
        WHERE applications.id = deliverable_media.application_id
        AND providers.claimed_by_user_id = auth.uid()
    )
);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deliverable_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deliverable_media_updated_at_trigger
BEFORE UPDATE ON deliverable_media
FOR EACH ROW
EXECUTE FUNCTION update_deliverable_media_updated_at();
