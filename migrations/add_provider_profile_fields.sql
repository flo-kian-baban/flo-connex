-- Migration: Add comprehensive provider profile fields
-- Created: 2026-01-18
-- Description: Adds brand identity, contact info, and credibility fields to providers table

-- Add new profile fields to providers table
ALTER TABLE providers
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS brand_description TEXT,
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS service_areas TEXT[],
ADD COLUMN IF NOT EXISTS years_in_business INTEGER,
ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1),
ADD COLUMN IF NOT EXISTS google_review_count INTEGER,
ADD COLUMN IF NOT EXISTS why_creators_love_us TEXT[];

-- Migrate existing location_area to service_areas
UPDATE providers
SET service_areas = ARRAY[location_area]
WHERE location_area IS NOT NULL AND service_areas IS NULL;

-- Add check constraints
ALTER TABLE providers
ADD CONSTRAINT google_rating_range CHECK (google_rating >= 0 AND google_rating <= 5),
ADD CONSTRAINT years_in_business_positive CHECK (years_in_business >= 0),
ADD CONSTRAINT google_review_count_positive CHECK (google_review_count >= 0),
ADD CONSTRAINT why_creators_love_us_max_3 CHECK (array_length(why_creators_love_us, 1) <= 3);

-- Add helpful comments
COMMENT ON COLUMN providers.tagline IS 'Short brand tagline (optional)';
COMMENT ON COLUMN providers.brand_description IS 'Detailed brand description for About section (required)';
COMMENT ON COLUMN providers.instagram_handle IS 'Instagram handle without @ symbol (optional)';
COMMENT ON COLUMN providers.phone_number IS 'Contact phone number (optional)';
COMMENT ON COLUMN providers.email IS 'Contact email address (optional)';
COMMENT ON COLUMN providers.service_areas IS 'Array of GTA locations where provider offers services';
COMMENT ON COLUMN providers.years_in_business IS 'Number of years the business has been operating (optional)';
COMMENT ON COLUMN providers.google_rating IS 'Google rating out of 5 (optional)';
COMMENT ON COLUMN providers.google_review_count IS 'Number of Google reviews (optional)';
COMMENT ON COLUMN providers.why_creators_love_us IS 'Up to 3 bullet points explaining value to creators (optional)';
