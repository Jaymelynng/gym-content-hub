-- Gym Content Management System - Complete Schema
-- This migration sets up the full system for managing content across 10 gym locations

-- 1. Gym Profiles Table (Updated)
DROP TABLE IF EXISTS public.gym_profiles CASCADE;
CREATE TABLE public.gym_profiles (
  id TEXT PRIMARY KEY,
  gym_name TEXT NOT NULL,
  pin_code TEXT NOT NULL UNIQUE,
  location TEXT,
  contact_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Content Formats Table (Updated)
DROP TABLE IF EXISTS public.content_formats CASCADE;
CREATE TABLE public.content_formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  format_type TEXT CHECK (format_type IN ('photo', 'video', 'carousel', 'story', 'animated')),
  dimensions TEXT,
  duration TEXT,
  total_required INTEGER DEFAULT 0,
  setup_planning JSONB DEFAULT '{}',
  production_tips JSONB DEFAULT '{}',
  examples JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Format Submissions Table
DROP TABLE IF EXISTS public.format_submissions CASCADE;
CREATE TABLE public.format_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_id UUID REFERENCES public.content_formats(id) ON DELETE CASCADE,
  gym_id TEXT REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video', 'gif')),
  thumbnail_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'needs_revision', 'rejected')),
  feedback_notes TEXT,
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Format Progress Table
DROP TABLE IF EXISTS public.format_progress CASCADE;
CREATE TABLE public.format_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id TEXT REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  format_id UUID REFERENCES public.content_formats(id) ON DELETE CASCADE,
  completed_count INTEGER DEFAULT 0,
  pending_count INTEGER DEFAULT 0,
  revision_count INTEGER DEFAULT 0,
  last_submission_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id, format_id)
);

-- Enable RLS
ALTER TABLE public.gym_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.format_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.format_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view content formats" ON public.content_formats
  FOR SELECT USING (true);

CREATE POLICY "Gyms view own submissions" ON public.format_submissions
  FOR SELECT USING (
    gym_id::TEXT = current_setting('app.current_gym_id', true)
    OR
    current_setting('app.current_gym_id', true) = ANY (ARRAY['1426', '2222'])
  );

CREATE POLICY "Gyms insert own submissions" ON public.format_submissions
  FOR INSERT WITH CHECK (
    gym_id::TEXT = current_setting('app.current_gym_id', true)
  );

CREATE POLICY "Gyms update own submissions" ON public.format_submissions
  FOR UPDATE USING (
    gym_id::TEXT = current_setting('app.current_gym_id', true)
  );

CREATE POLICY "Gyms view own progress" ON public.format_progress
  FOR SELECT USING (
    gym_id::TEXT = current_setting('app.current_gym_id', true)
    OR
    current_setting('app.current_gym_id', true) = ANY (ARRAY['1426', '2222'])
  );

CREATE POLICY "Gyms update own progress" ON public.format_progress
  FOR UPDATE USING (
    gym_id::TEXT = current_setting('app.current_gym_id', true)
  );

CREATE POLICY "Gyms insert own progress" ON public.format_progress
  FOR INSERT WITH CHECK (
    gym_id::TEXT = current_setting('app.current_gym_id', true)
  );

CREATE POLICY "Gym profiles access" ON public.gym_profiles
  FOR SELECT USING (
    id = current_setting('app.current_gym_id', true)
    OR
    current_setting('app.current_gym_id', true) = ANY (ARRAY['1426', '2222'])
  );

-- Insert gym data
INSERT INTO public.gym_profiles (id, gym_name, pin_code, location, contact_info) VALUES
  ('CPF', 'Capital Gymnastics', 'CPF', 'Central location', '{"email": "cpf@capitalgym.com", "phone": "512-555-0101"}'),
  ('CRR', 'Capital Gymnastics', 'CRR', 'Secondary facility', '{"email": "crr@capitalgym.com", "phone": "512-555-0102"}'),
  ('CCP', 'Capital Gymnastics', 'CCP', 'Community center partnership', '{"email": "ccp@capitalgym.com", "phone": "512-555-0103"}'),
  ('RBA', 'Rowland Ballard', 'RBA', 'Regional branch A', '{"email": "rba@rowlandballard.com", "phone": "713-555-0101"}'),
  ('RBK', 'Rowland Ballard', 'RBK', 'Regional branch K', '{"email": "rbk@rowlandballard.com", "phone": "713-555-0102"}'),
  ('HGA', 'Houston Gymnastics Academy', 'HGA', 'High-performance gym A', '{"email": "hga@houstongym.com", "phone": "713-555-0201"}'),
  ('EST', 'Estrella Gymnastics', 'EST', 'Established location', '{"email": "est@estrellagym.com", "phone": "602-555-0101"}'),
  ('OAS', 'Oasis Gymnastics', 'OAS', 'Outdoor adventure sports', '{"email": "oas@oasisgym.com", "phone": "602-555-0201"}'),
  ('SGT', 'Scottsdale Gymnastics', 'SGT', 'Specialty gymnastics training', '{"email": "sgt@scottsdalegym.com", "phone": "480-555-0101"}'),
  ('TIG', 'Training Institute for Gymnastics', 'TIG', 'Training institute for gymnastics', '{"email": "tig@traininginstitute.com", "phone": "512-555-0301"}'),
  ('1426', 'OWNER ADMIN', '1426', 'Jayme - Owner Admin', '{"email": "jayme@admin.com", "phone": "555-0001"}'),
  ('2222', 'ADMIN VIEW', '2222', 'Kim - Secondary Admin', '{"email": "kim@admin.com", "phone": "555-0002"}');

-- Insert predefined content formats
INSERT INTO public.content_formats (format_key, title, description, format_type, dimensions, duration, total_required, setup_planning, production_tips, examples) VALUES
('static-photo', 'Static Photo', 'Single high-quality images showcasing gym activities, equipment, or results', 'photo', '1080x1080 (Square) or 1080x1350 (Portrait)', NULL, 12,
  '{"title": "Static Photo Planning", "checklist": ["Plan diverse photo types (workout shots, equipment, before/after, nutrition)", "Ensure good natural lighting or professional lighting setup", "Prepare clean, organized backgrounds", "Schedule during peak activity times for authentic energy", "Have proper permissions for featuring people"], "timeline": "1-2 weeks for photo series", "requirements": ["Minimum 1080x1080 resolution", "High contrast and sharp focus", "Consistent brand colors and style", "Clear subject focus with minimal distractions"]}',
  '{"title": "Photography Best Practices", "tips": ["Use rule of thirds for composition", "Capture multiple angles of the same subject", "Ensure faces are well-lit and clearly visible", "Include gym branding subtly in shots", "Take both wide shots and close-up detail shots"], "dosDonts": {"dos": ["Use natural window lighting when possible", "Keep backgrounds clean and uncluttered", "Capture genuine expressions and movements", "Take multiple shots of each scene"], "donts": ["Use harsh overhead fluorescent lighting", "Include messy or cluttered backgrounds", "Cut off limbs or important parts of equipment", "Post blurry or poorly lit images"]}, "equipment": ["DSLR camera or high-end smartphone", "Reflector or ring light", "Tripod", "Clean microfiber cloth for equipment"]}',
  '{"title": "Static Photo Examples", "descriptions": ["Group fitness class in action with proper lighting", "Personal training session showing proper form", "Member achievement or transformation shot", "Clean equipment showcase with good composition"], "commonMistakes": ["Poor lighting making subjects too dark", "Cluttered backgrounds that distract from main subject", "Blurry images from camera shake or motion", "Unflattering angles or awkward cropping"]}'
),
('carousel-images', 'Carousel Images', 'Multi-image posts that tell a story or show step-by-step processes', 'carousel', '1080x1080 (Square) - 2-10 images', NULL, 8,
  '{"title": "Carousel Content Planning", "checklist": ["Plan storytelling sequence (beginning, middle, end)", "Ensure each image can stand alone but works in sequence", "Plan consistent visual style across all images", "Prepare step-by-step processes or transformations", "Design engaging first image to encourage swiping"], "timeline": "2-3 weeks for carousel series", "requirements": ["Consistent 1080x1080 dimensions across all images", "Cohesive visual style and color palette", "Clear progression or story flow", "Engaging first image as hook"]}',
  '{"title": "Carousel Creation Strategy", "tips": ["Make the first image a strong hook to encourage swiping", "Use consistent filters or editing style across all images", "Include a mix of close-ups and wide shots", "End with a strong call-to-action or result image", "Keep text overlay minimal and readable"], "dosDonts": {"dos": ["Plan the entire sequence before shooting", "Use consistent lighting across all images", "Include variety while maintaining cohesion", "Test the swipe flow before posting"], "donts": ["Mix different lighting conditions between images", "Use too many different visual styles", "Make images too text-heavy", "Forget to optimize the first image as a hook"]}, "equipment": ["Smartphone or camera with consistent settings", "Tripod for consistent framing", "Image editing app", "Color palette reference"]}',
  '{"title": "Carousel Examples", "descriptions": ["Workout routine progression (setup → exercise → result)", "Meal prep step-by-step process", "Equipment setup and usage demonstration", "Member transformation journey timeline"], "commonMistakes": ["Inconsistent visual style between images", "Poor first image that does not encourage swiping", "Too much text that is hard to read on mobile", "No clear story progression or connection between images"]}'
),
('video-reel', 'Video Reel', 'Short-form vertical videos optimized for social media engagement', 'video', '1080x1920 (9:16 Vertical)', '15-60 seconds', 15,
  '{"title": "Video Reel Planning", "checklist": ["Plan hook within first 3 seconds", "Script key points but keep natural delivery", "Choose trending audio or create original sound", "Plan dynamic movements and camera angles", "Ensure good lighting throughout video"], "timeline": "1-2 weeks per reel series", "requirements": ["1080x1920 vertical orientation", "15-60 second duration", "Clear audio quality", "Stable footage with minimal shake", "Strong opening hook"]}',
  '{"title": "Video Reel Production", "tips": ["Hook viewers in the first 3 seconds", "Use jump cuts to maintain high energy", "Include captions for accessibility", "Plan for vertical viewing (phones)", "End with clear call-to-action"], "dosDonts": {"dos": ["Start with movement or engaging visual", "Use trending audio when appropriate", "Keep camera movements smooth", "Include your face for personal connection"], "donts": ["Start with slow or boring introduction", "Use shaky handheld footage", "Make videos too long or slow-paced", "Forget to optimize for sound-off viewing"]}, "equipment": ["Smartphone with video capability", "Gimbal or stabilizer", "External microphone", "Ring light or softbox"]}',
  '{"title": "Video Reel Examples", "descriptions": ["Quick workout routine with upbeat music", "Equipment demonstration with clear instruction", "Member success story with before/after", "Behind-the-scenes gym preparation timelapse"], "commonMistakes": ["Starting too slow without a strong hook", "Poor audio quality or background noise", "Shaky camera work that is distracting", "Videos too long that lose viewer attention"]}'
),
('story', 'Story', 'Temporary 24-hour content for behind-the-scenes and real-time updates', 'story', '1080x1920 (9:16 Vertical)', '1-15 seconds per slide', 20,
  '{"title": "Story Content Planning", "checklist": ["Plan daily behind-the-scenes moments", "Prepare quick tips and motivational content", "Schedule real-time updates during classes", "Plan interactive elements (polls, questions)", "Prepare story highlights categories"], "timeline": "Daily ongoing content", "requirements": ["1080x1920 vertical format", "Quick, engaging content", "Good lighting for phone cameras", "Clear text overlays when needed"]}',
  '{"title": "Story Content Creation", "tips": ["Capture spontaneous, authentic moments", "Use story stickers for engagement (polls, questions)", "Keep individual stories short and snappy", "Use consistent branding elements", "Post consistently throughout the day"], "dosDonts": {"dos": ["Show authentic behind-the-scenes content", "Use interactive story features", "Post at optimal times when audience is active", "Save best stories to highlights"], "donts": ["Over-produce or make too polished", "Post too many stories in quick succession", "Ignore audience interaction opportunities", "Forget to check story analytics"]}, "equipment": ["Smartphone", "Good lighting source", "Story templates or graphics", "Consistent brand elements"]}',
  '{"title": "Story Examples", "descriptions": ["Morning gym setup behind-the-scenes", "Quick workout tip with text overlay", "Member spotlight or achievement celebration", "Live class update or energy check-in"], "commonMistakes": ["Making stories too long or complex", "Not using interactive features to engage audience", "Posting at wrong times when audience is not active", "Forgetting to save important stories to highlights"]}'
),
('animated-image', 'Animated Image', 'GIFs, cinemagraphs, or short motion graphics for eye-catching posts', 'animated', '1080x1080 (Square) or 1080x1350 (Portrait)', '2-6 seconds loop', 6,
  '{"title": "Animated Content Planning", "checklist": ["Identify repetitive motions that loop well", "Plan simple, focused animations", "Ensure smooth loop without jarring transitions", "Choose high-impact moments to animate", "Plan for file size optimization"], "timeline": "3-4 weeks for animated series", "requirements": ["Smooth looping animation", "Optimized file size for social media", "Clear focal point in animation", "High quality despite compression"]}',
  '{"title": "Animation Creation", "tips": ["Focus on one main element moving", "Keep loops short (2-6 seconds)", "Ensure seamless loop transition", "Use subtle movements for elegance", "Test on different devices and connections"], "dosDonts": {"dos": ["Keep animations simple and focused", "Test loop quality before posting", "Optimize file size for fast loading", "Choose movements that naturally loop"], "donts": ["Make animations too complex or busy", "Create jarring or obvious loop points", "Use file sizes too large for social media", "Animate everything - focus on one element"]}, "equipment": ["Video editing software", "High frame rate camera", "Tripod for stability", "GIF optimization tools"]}',
  '{"title": "Animated Examples", "descriptions": ["Weights lifting in smooth repetitive motion", "Treadmill belt moving with runner legs", "Water bottle filling or supplement pouring", "Equipment setup transformation timelapse"], "commonMistakes": ["Creating obvious, jarring loop transitions", "Making file sizes too large for social platforms", "Animating too many elements at once", "Using low frame rates that appear choppy"]}'
);

-- Initialize progress tracking for all gyms and formats
INSERT INTO public.format_progress (gym_id, format_id, completed_count, pending_count, revision_count)
SELECT 
  g.id as gym_id,
  cf.id as format_id,
  0 as completed_count,
  0 as pending_count,
  0 as revision_count
FROM public.gym_profiles g
CROSS JOIN public.content_formats cf
WHERE g.id NOT IN ('1426', '2222'); -- Exclude admin accounts

-- Create function to update progress tracking
CREATE OR REPLACE FUNCTION update_format_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update progress when submissions change
  INSERT INTO public.format_progress (gym_id, format_id, completed_count, pending_count, revision_count, last_submission_date)
  SELECT 
    NEW.gym_id,
    NEW.format_id,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as completed_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'needs_revision' THEN 1 END) as revision_count,
    MAX(submitted_at) as last_submission_date
  FROM public.format_submissions
  WHERE gym_id = NEW.gym_id AND format_id = NEW.format_id
  ON CONFLICT (gym_id, format_id) DO UPDATE SET
    completed_count = EXCLUDED.completed_count,
    pending_count = EXCLUDED.pending_count,
    revision_count = EXCLUDED.revision_count,
    last_submission_date = EXCLUDED.last_submission_date;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update progress
CREATE TRIGGER trigger_update_format_progress
  AFTER INSERT OR UPDATE OR DELETE ON public.format_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_format_progress();