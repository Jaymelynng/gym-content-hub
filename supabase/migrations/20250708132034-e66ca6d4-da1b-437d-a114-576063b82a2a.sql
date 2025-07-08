
-- Add RLS policies for admin comments on submissions
CREATE POLICY "Admins can insert comments on submissions" 
ON content_comments 
FOR INSERT 
WITH CHECK (
  current_setting('app.current_gym_id', true) = ANY(ARRAY['1426', '2222'])
);

CREATE POLICY "Admins can update comments" 
ON content_comments 
FOR UPDATE 
USING (
  current_setting('app.current_gym_id', true) = ANY(ARRAY['1426', '2222'])
);

-- Update assignment_submissions policies to allow admin status updates
CREATE POLICY "Admins can view all submissions" 
ON assignment_submissions 
FOR SELECT 
USING (
  current_setting('app.current_gym_id', true) = ANY(ARRAY['1426', '2222'])
);

-- Add constraint to ensure valid submission statuses
ALTER TABLE assignment_submissions 
ADD CONSTRAINT valid_submission_status 
CHECK (submission_status IN ('draft', 'submitted', 'under-review', 'approved', 'needs-revision', 'rejected'));
