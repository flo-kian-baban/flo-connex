-- Remove the old CHECK constraint and add a new one with all status values
-- This allows 'in_progress' and 'completed' status values

-- First, find the constraint name
-- Run this to see what constraints exist:
-- SELECT constraint_name FROM information_schema.table_constraints 
-- WHERE table_name = 'applications' AND constraint_type = 'CHECK';

-- Then drop the old constraint (replace 'constraint_name' with actual name from above)
-- ALTER TABLE applications DROP CONSTRAINT applications_status_check;

-- Add new constraint with all status values
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed'));
