-- Add audience_location_split column to creator_profiles
ALTER TABLE public.creator_profiles 
ADD COLUMN IF NOT EXISTS audience_location_split JSONB DEFAULT '{"local": 0, "country": 0, "international": 0}'::jsonb;
