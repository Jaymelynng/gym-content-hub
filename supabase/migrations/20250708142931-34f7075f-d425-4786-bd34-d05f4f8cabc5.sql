-- First, update assignment_templates to support the new flexible content system
ALTER TABLE assignment_templates 
ADD COLUMN IF NOT EXISTS content_requirements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS setup_planning TEXT,
ADD COLUMN IF NOT EXISTS production_tips TEXT,
ADD COLUMN IF NOT EXISTS content_examples JSONB DEFAULT '[]'::jsonb;

-- Update the assignment_distributions table to support better admin workflow
ALTER TABLE assignment_distributions 
ADD COLUMN IF NOT EXISTS assignment_type TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS content_requirements JSONB DEFAULT '[]'::jsonb;

-- Create a new table for tracking assignment creation workflow
CREATE TABLE IF NOT EXISTS assignment_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_admin TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  setup_planning TEXT,
  production_tips TEXT,
  content_examples JSONB DEFAULT '[]'::jsonb,
  content_requirements JSONB DEFAULT '[]'::jsonb,
  file_requirements TEXT,
  assignment_type TEXT DEFAULT 'custom',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE assignment_drafts ENABLE ROW LEVEL SECURITY;

-- Create policies for admins to manage drafts
CREATE POLICY "Admins can manage assignment drafts"
ON assignment_drafts
FOR ALL
USING (current_setting('app.current_gym_id', true) = ANY(ARRAY['1426', '2222']));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_assignment_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_assignment_drafts_updated_at
BEFORE UPDATE ON assignment_drafts
FOR EACH ROW
EXECUTE FUNCTION update_assignment_drafts_updated_at();