
-- Add new fields to creator_profiles table
ALTER TABLE creator_profiles 
ADD COLUMN IF NOT EXISTS active_platforms text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS primary_content_format text,
ADD COLUMN IF NOT EXISTS primary_niche text,
ADD COLUMN IF NOT EXISTS content_style_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_areas text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS willing_to_travel boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS audience_focus text,
ADD COLUMN IF NOT EXISTS audience_location_split jsonb DEFAULT '{"local": 0, "country": 0, "international": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS primary_audience_age text,
ADD COLUMN IF NOT EXISTS gender_skew text,
ADD COLUMN IF NOT EXISTS top_post_url text,
ADD COLUMN IF NOT EXISTS past_brand_collaborations boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS delivery_speed text,
ADD COLUMN IF NOT EXISTS revisions_ok boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS production_preference text;

-- Add comment to explain usage
COMMENT ON COLUMN creator_profiles.active_platforms IS 'List of platforms the creator is active on';
COMMENT ON COLUMN creator_profiles.primary_content_format IS 'Primary format like Short-form video, Long-form video, etc.';
COMMENT ON COLUMN creator_profiles.primary_niche IS 'Primary niche category';
COMMENT ON COLUMN creator_profiles.content_style_tags IS 'Tags describing content style like UGC, Cinematic, etc.';
COMMENT ON COLUMN creator_profiles.service_areas IS 'List of GTA locations the creator is willing to commute to';
COMMENT ON COLUMN creator_profiles.willing_to_travel IS 'Whether creator is willing to travel';
COMMENT ON COLUMN creator_profiles.audience_focus IS 'Geographic focus of audience';
COMMENT ON COLUMN creator_profiles.audience_location_split IS 'Percentage split of audience location';
COMMENT ON COLUMN creator_profiles.primary_audience_age IS 'Primary age range of audience';
COMMENT ON COLUMN creator_profiles.gender_skew IS 'Gender distribution of audience';
COMMENT ON COLUMN creator_profiles.top_post_url IS 'Link to best performing post';
COMMENT ON COLUMN creator_profiles.past_brand_collaborations IS 'Whether creator has done brand collabs before';
COMMENT ON COLUMN creator_profiles.delivery_speed IS 'Typical delivery speed';
COMMENT ON COLUMN creator_profiles.revisions_ok IS 'Whether creator is comfortable with revisions';
COMMENT ON COLUMN creator_profiles.production_preference IS 'Preferred production style';
