-- Migration to update existing 'accepted' applications to 'in_progress'
-- This fixes applications that were accepted before the status lifecycle was implemented

UPDATE applications 
SET status = 'in_progress' 
WHERE status = 'accepted' 
  AND submitted_post_url IS NULL;

-- Note: Only updates applications that haven't submitted a post URL yet
-- Applications with submitted URLs should remain as they are (likely need manual review)
