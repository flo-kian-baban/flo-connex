-- Add submitted_post_url column to applications table
-- This enables creators to submit social post URLs after completing work

ALTER TABLE applications ADD COLUMN IF NOT EXISTS submitted_post_url TEXT;
