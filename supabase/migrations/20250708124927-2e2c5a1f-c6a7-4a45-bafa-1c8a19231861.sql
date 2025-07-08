-- Create storage buckets for content submissions
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('assignment-content', 'assignment-content', false),
  ('thumbnails', 'thumbnails', true);

-- Create storage policies for assignment content
CREATE POLICY "Users can upload to assignment content bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'assignment-content' AND 
  (storage.foldername(name))[1] = current_setting('app.current_gym_id', true)
);

CREATE POLICY "Users can view their own assignment content" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'assignment-content' AND 
  ((storage.foldername(name))[1] = current_setting('app.current_gym_id', true) OR 
   current_setting('app.current_gym_id', true) = ANY(ARRAY['1426', '2222']))
);

CREATE POLICY "Users can update their own assignment content" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'assignment-content' AND 
  (storage.foldername(name))[1] = current_setting('app.current_gym_id', true)
);

CREATE POLICY "Users can delete their own assignment content" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'assignment-content' AND 
  (storage.foldername(name))[1] = current_setting('app.current_gym_id', true)
);

-- Thumbnail bucket policies (public read)
CREATE POLICY "Thumbnails are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'thumbnails');

CREATE POLICY "Users can upload thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'thumbnails' AND 
  (storage.foldername(name))[1] = current_setting('app.current_gym_id', true)
);

-- Add RLS policies for assignment_submissions table
CREATE POLICY "Gym members can insert their own submissions" 
ON assignment_submissions 
FOR INSERT 
WITH CHECK (gym_id = current_setting('app.current_gym_id', true));

CREATE POLICY "Gym members can update their own submissions" 
ON assignment_submissions 
FOR UPDATE 
USING (
  gym_id = current_setting('app.current_gym_id', true) OR 
  current_setting('app.current_gym_id', true) = ANY(ARRAY['1426', '2222'])
);

-- Update assignment_distributions to allow status updates
CREATE POLICY "Gym members can update assignment status" 
ON assignment_distributions 
FOR UPDATE 
USING (
  assigned_to_gym_id = current_setting('app.current_gym_id', true) OR 
  current_setting('app.current_gym_id', true) = ANY(ARRAY['1426', '2222'])
);