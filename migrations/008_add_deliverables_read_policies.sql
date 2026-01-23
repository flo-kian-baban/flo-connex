-- Fix: The file path structure is: deliverables/{application_id}/filename
-- So we need [2] to get the application_id, not [1]

-- First, drop the incorrect policies
DROP POLICY IF EXISTS "Providers can view deliverables for their applications" ON storage.objects;
DROP POLICY IF EXISTS "Creators can view their own deliverables" ON storage.objects;

-- Recreate with correct folder index [2]
CREATE POLICY "Providers can view deliverables for their applications"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'connex-deliverables' 
    AND (
        EXISTS (
            SELECT 1 FROM applications a
            JOIN providers p ON a.provider_id = p.id
            WHERE p.claimed_by_user_id = auth.uid()
            AND a.id::text = (storage.foldername(name))[2]
        )
    )
);

CREATE POLICY "Creators can view their own deliverables"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'connex-deliverables' 
    AND (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.creator_id = auth.uid()
            AND a.id::text = (storage.foldername(name))[2]
        )
    )
);
