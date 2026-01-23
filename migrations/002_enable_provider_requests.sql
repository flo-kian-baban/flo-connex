-- Make offer_id nullable to support custom provider requests
ALTER TABLE applications ALTER COLUMN offer_id DROP NOT NULL;

-- Add columns for provider-initiated requests
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES providers(id),
ADD COLUMN IF NOT EXISTS initiator TEXT DEFAULT 'creator', -- 'creator' or 'provider'
ADD COLUMN IF NOT EXISTS request_details JSONB; -- Stores title, brief, deliverables, deadline, platform, etc.

-- Add constraint to ensure either offer_id OR provider_id is present (or both, though usually one triggers the other)
-- Actually, a provider request MUST have a provider_id. A creator app MUST have an offer_id (which implies a provider).
-- For now, let's just ensure we have these columns.
