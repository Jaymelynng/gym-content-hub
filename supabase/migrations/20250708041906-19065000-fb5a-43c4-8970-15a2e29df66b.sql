-- Create gym profiles table
CREATE TABLE public.gym_profiles (
  id TEXT PRIMARY KEY,
  gym_name TEXT NOT NULL,
  gym_location TEXT,
  pin_code TEXT NOT NULL UNIQUE,
  contact_email TEXT,
  contact_phone TEXT,
  active BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'America/Chicago',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assignment templates table
CREATE TABLE public.assignment_templates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_hours DECIMAL(3,1),
  formats_available TEXT[] DEFAULT '{static-photo,carousel-images,video-reel,story,animated-image}',
  formats_required TEXT[] NOT NULL,
  video_photo_split JSONB DEFAULT '{"video": 50, "photo": 50}',
  class_camp_split JSONB DEFAULT '{"class": 50, "camp": 50}',
  assignment_brief TEXT NOT NULL,
  requirements_text TEXT NOT NULL,
  submission_guidelines TEXT NOT NULL,
  file_requirements JSONB DEFAULT '{"video": {"min_duration": 20, "max_duration": 60, "max_size_mb": 100, "formats": ["MP4", "MOV"]}, "photo": {"min_resolution": "1080x1080", "max_size_mb": 10, "formats": ["JPG", "PNG"]}}',
  upload_specifications JSONB NOT NULL,
  created_by_admin TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assignment distributions table
CREATE TABLE public.assignment_distributions (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT REFERENCES public.assignment_templates(id) ON DELETE CASCADE,
  assigned_to_gym_id TEXT REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  assigned_by_admin TEXT NOT NULL,
  custom_title TEXT,
  custom_description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  extended_due_date TIMESTAMPTZ,
  collection_period INTERVAL DEFAULT INTERVAL '1 month',
  priority_override TEXT CHECK (priority_override IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'acknowledged', 'in-progress', 'submitted', 'under-review', 'approved', 'needs-revision', 'completed', 'cancelled')),
  admin_notes TEXT,
  special_instructions TEXT,
  reminder_sent_at TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id BIGSERIAL PRIMARY KEY,
  assignment_id BIGINT REFERENCES public.assignment_distributions(id) ON DELETE CASCADE,
  gym_id TEXT REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  selected_formats TEXT[] NOT NULL,
  upload_progress JSONB DEFAULT '{}',
  uploaded_files JSONB DEFAULT '[]',
  file_metadata JSONB DEFAULT '{}',
  submission_notes TEXT,
  quality_notes TEXT,
  technical_notes TEXT,
  submission_status TEXT DEFAULT 'draft' CHECK (submission_status IN ('draft', 'in-progress', 'submitted', 'under-review', 'approved', 'needs-revision', 'rejected')),
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10),
  admin_feedback TEXT,
  revision_requested BOOLEAN DEFAULT false,
  revision_notes TEXT,
  resubmission_count INTEGER DEFAULT 0,
  final_approval BOOLEAN DEFAULT false,
  approved_by_admin TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create content comments table
CREATE TABLE public.content_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id BIGINT REFERENCES public.assignment_submissions(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.content_comments(id) ON DELETE CASCADE,
  author_type TEXT NOT NULL CHECK (author_type IN ('admin', 'gym')),
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  comment_type TEXT DEFAULT 'general' CHECK (comment_type IN ('general', 'quality_feedback', 'technical_issue', 'revision_request', 'approval', 'question')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('private', 'public')),
  is_internal_note BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create upload progress tracking table
CREATE TABLE public.upload_progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id BIGINT REFERENCES public.assignment_submissions(id) ON DELETE CASCADE,
  gym_id TEXT REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL CHECK (file_type IN ('static-photo', 'carousel-images', 'video-reel', 'story', 'animated-image')),
  required_count INTEGER NOT NULL,
  uploaded_count INTEGER DEFAULT 0,
  approved_count INTEGER DEFAULT 0,
  pending_review_count INTEGER DEFAULT 0,
  needs_revision_count INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  last_upload_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create app settings table
CREATE TABLE public.app_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  category TEXT DEFAULT 'general',
  description TEXT,
  is_admin_only BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Insert gym data
INSERT INTO public.gym_profiles (id, gym_name, gym_location, pin_code) VALUES
  ('CPF', 'Capital Gymnastics', 'Pflugerville', 'CPF'),
  ('CRR', 'Capital Gymnastics', 'Round Rock', 'CRR'),
  ('CCP', 'Capital Gymnastics', 'Cedar Park', 'CCP'),
  ('RBA', 'Rowland Ballard', 'Atascocita', 'RBA'),
  ('RBK', 'Rowland Ballard', 'Kingwood', 'RBK'),
  ('HGA', 'Houston Gymnastics Academy', 'Houston', 'HGA'),
  ('EST', 'Estrella Gymnastics', 'Phoenix', 'EST'),
  ('OAS', 'Oasis Gymnastics', 'Phoenix', 'OAS'),
  ('SGT', 'Scottsdale Gymnastics', 'Scottsdale', 'SGT'),
  ('TIG', 'Tigar Gymnastics', 'Austin', 'TIG'),
  ('1426', 'OWNER ADMIN', 'Jayme', '1426'),
  ('2222', 'ADMIN VIEW', 'Kim', '2222');

-- Insert system settings
INSERT INTO public.app_settings (setting_key, setting_value, category, description) VALUES
  ('content_formats', '["static-photo", "carousel-images", "video-reel", "story", "animated-image"]', 'content', 'Available content format options'),
  ('file_requirements', '{"video": {"min_duration_seconds": 20, "max_duration_seconds": 60, "max_size_mb": 100, "allowed_formats": ["MP4", "MOV"]}, "photo": {"min_width": 1080, "min_height": 1080, "max_size_mb": 10, "allowed_formats": ["JPG", "PNG"]}}', 'upload', 'File upload requirements and validation rules'),
  ('notification_settings', '{"email_reminders": true, "due_date_warnings": [7, 3, 1], "auto_escalation": true}', 'notifications', 'System notification preferences');

-- Create RLS policies for gym-specific access
CREATE POLICY "Gym members see own data" ON assignment_distributions
  FOR SELECT USING (
    assigned_to_gym_id = current_setting('app.current_gym_id', true) OR
    current_setting('app.current_gym_id', true) IN ('1426', '2222')
  );

CREATE POLICY "Admins can manage all assignments" ON assignment_distributions
  FOR ALL USING (
    current_setting('app.current_gym_id', true) IN ('1426', '2222')
  );

CREATE POLICY "Gym specific submissions" ON assignment_submissions
  FOR SELECT USING (
    gym_id = current_setting('app.current_gym_id', true) OR
    current_setting('app.current_gym_id', true) IN ('1426', '2222')
  );

CREATE POLICY "Gym profiles access" ON gym_profiles
  FOR SELECT USING (
    id = current_setting('app.current_gym_id', true) OR
    current_setting('app.current_gym_id', true) IN ('1426', '2222')
  );

-- Allow public read access to content formats and settings
CREATE POLICY "Public read app settings" ON app_settings
  FOR SELECT USING (true);

-- Allow full access to templates for authorized users
CREATE POLICY "Template access" ON assignment_templates
  FOR SELECT USING (true);

-- Comments access based on submission ownership
CREATE POLICY "Comment access" ON content_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assignment_submissions 
      WHERE id = submission_id 
      AND (gym_id = current_setting('app.current_gym_id', true) OR current_setting('app.current_gym_id', true) IN ('1426', '2222'))
    )
  );

-- Upload progress access
CREATE POLICY "Upload progress access" ON upload_progress_tracking
  FOR SELECT USING (
    gym_id = current_setting('app.current_gym_id', true) OR
    current_setting('app.current_gym_id', true) IN ('1426', '2222')
  );