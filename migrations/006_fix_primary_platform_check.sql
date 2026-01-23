-- Drop the old primary_platform_check constraint and recreate with correct values
ALTER TABLE public.creator_profiles
DROP CONSTRAINT IF EXISTS primary_platform_check;

ALTER TABLE public.creator_profiles
ADD CONSTRAINT primary_platform_check 
CHECK (primary_platform IN ('Instagram', 'TikTok', 'YouTube', 'YouTube Shorts', 'Other'));
