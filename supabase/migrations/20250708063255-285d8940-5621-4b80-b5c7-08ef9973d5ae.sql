-- Content Formats Migration
-- Transform generic assignments into specific content formats

-- 1. Content Formats Table
CREATE TABLE public.content_formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  icon_name TEXT,
  format_type TEXT CHECK (format_type IN ('photo', 'video', 'carousel', 'story', 'animated')),
  dimensions TEXT,
  duration TEXT,
  total_required INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  setup_planning JSONB DEFAULT '{}',
  production_tips JSONB DEFAULT '{}',
  examples JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Format Submissions (Replace assignment submissions)
CREATE TABLE public.format_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_id UUID REFERENCES public.content_formats(id) ON DELETE CASCADE,
  gym_id TEXT REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video', 'gif')),
  thumbnail_url TEXT,
  submission_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'needs_revision', 'rejected')),
  feedback_notes TEXT,
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Format Progress Tracking
CREATE TABLE public.format_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id TEXT REFERENCES public.gym_profiles(id) ON DELETE CASCADE,
  format_id UUID REFERENCES public.content_formats(id) ON DELETE CASCADE,
  completed_count INTEGER DEFAULT 0,
  pending_count INTEGER DEFAULT 0,
  revision_count INTEGER DEFAULT 0,
  last_submission_date TIMESTAMP WITH TIME ZONE,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id, format_id)
);

-- Enable RLS
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

CREATE POLICY "Gyms view own progress" ON public.format_progress
  FOR SELECT USING (
    gym_id::TEXT = current_setting('app.current_gym_id', true)
    OR
    current_setting('app.current_gym_id', true) = ANY (ARRAY['1426', '2222'])
  );

-- Insert predefined content formats
INSERT INTO public.content_formats (format_key, title, description, format_type, dimensions, duration, total_required, sort_order, setup_planning, production_tips, examples) VALUES
('static-photo', 'Static Photo', 'Single high-quality images showcasing gym activities, equipment, or results', 'photo', '1080x1080 (Square) or 1080x1350 (Portrait)', NULL, 12, 1,
  '{"title": "Static Photo Planning", "checklist": ["Plan diverse photo types (workout shots, equipment, before/after, nutrition)", "Ensure good natural lighting or professional lighting setup", "Prepare clean, organized backgrounds", "Schedule during peak activity times for authentic energy", "Have proper permissions for featuring people"], "timeline": "1-2 weeks for photo series", "requirements": ["Minimum 1080x1080 resolution", "High contrast and sharp focus", "Consistent brand colors and style", "Clear subject focus with minimal distractions"]}',
  '{"title": "Photography Best Practices", "tips": ["Use rule of thirds for composition", "Capture multiple angles of the same subject", "Ensure faces are well-lit and clearly visible", "Include gym branding subtly in shots", "Take both wide shots and close-up detail shots"], "dosDonts": {"dos": ["Use natural window lighting when possible", "Keep backgrounds clean and uncluttered", "Capture genuine expressions and movements", "Take multiple shots of each scene"], "donts": ["Use harsh overhead fluorescent lighting", "Include messy or cluttered backgrounds", "Cut off limbs or important parts of equipment", "Post blurry or poorly lit images"]}, "equipment": ["DSLR camera or high-end smartphone", "Reflector or ring light", "Tripod", "Clean microfiber cloth for equipment"]}',
  '{"title": "Static Photo Examples", "descriptions": ["Group fitness class in action with proper lighting", "Personal training session showing proper form", "Member achievement or transformation shot", "Clean equipment showcase with good composition"], "commonMistakes": ["Poor lighting making subjects too dark", "Cluttered backgrounds that distract from main subject", "Blurry images from camera shake or motion", "Unflattering angles or awkward cropping"]}'
),
('carousel-images', 'Carousel Images', 'Multi-image posts that tell a story or show step-by-step processes', 'carousel', '1080x1080 (Square) - 2-10 images', NULL, 8, 2,
  '{"title": "Carousel Content Planning", "checklist": ["Plan storytelling sequence (beginning, middle, end)", "Ensure each image can stand alone but works in sequence", "Plan consistent visual style across all images", "Prepare step-by-step processes or transformations", "Design engaging first image to encourage swiping"], "timeline": "2-3 weeks for carousel series", "requirements": ["Consistent 1080x1080 dimensions across all images", "Cohesive visual style and color palette", "Clear progression or story flow", "Engaging first image as hook"]}',
  '{"title": "Carousel Creation Strategy", "tips": ["Make the first image a strong hook to encourage swiping", "Use consistent filters or editing style across all images", "Include a mix of close-ups and wide shots", "End with a strong call-to-action or result image", "Keep text overlay minimal and readable"], "dosDonts": {"dos": ["Plan the entire sequence before shooting", "Use consistent lighting across all images", "Include variety while maintaining cohesion", "Test the swipe flow before posting"], "donts": ["Mix different lighting conditions between images", "Use too many different visual styles", "Make images too text-heavy", "Forget to optimize the first image as a hook"]}, "equipment": ["Smartphone or camera with consistent settings", "Tripod for consistent framing", "Image editing app", "Color palette reference"]}',
  '{"title": "Carousel Examples", "descriptions": ["Workout routine progression (setup → exercise → result)", "Meal prep step-by-step process", "Equipment setup and usage demonstration", "Member transformation journey timeline"], "commonMistakes": ["Inconsistent visual style between images", "Poor first image that doesn\'t encourage swiping", "Too much text that\'s hard to read on mobile", "No clear story progression or connection between images"]}'
),
('video-reel', 'Video Reel', 'Short-form vertical videos optimized for social media engagement', 'video', '1080x1920 (9:16 Vertical)', '15-60 seconds', 15, 3,
  '{"title": "Video Reel Planning", "checklist": ["Plan hook within first 3 seconds", "Script key points but keep natural delivery", "Choose trending audio or create original sound", "Plan dynamic movements and camera angles", "Ensure good lighting throughout video"], "timeline": "1-2 weeks per reel series", "requirements": ["1080x1920 vertical orientation", "15-60 second duration", "Clear audio quality", "Stable footage with minimal shake", "Strong opening hook"]}',
  '{"title": "Video Reel Production", "tips": ["Hook viewers in the first 3 seconds", "Use jump cuts to maintain high energy", "Include captions for accessibility", "Plan for vertical viewing (phones)", "End with clear call-to-action"], "dosDonts": {"dos": ["Start with movement or engaging visual", "Use trending audio when appropriate", "Keep camera movements smooth", "Include your face for personal connection"], "donts": ["Start with slow or boring introduction", "Use shaky handheld footage", "Make videos too long or slow-paced", "Forget to optimize for sound-off viewing"]}, "equipment": ["Smartphone with video capability", "Gimbal or stabilizer", "External microphone", "Ring light or softbox"]}',
  '{"title": "Video Reel Examples", "descriptions": ["Quick workout routine with upbeat music", "Equipment demonstration with clear instruction", "Member success story with before/after", "Behind-the-scenes gym preparation timelapse"], "commonMistakes": ["Starting too slow without a strong hook", "Poor audio quality or background noise", "Shaky camera work that\'s distracting", "Videos too long that lose viewer attention"]}'
),
('story', 'Story', 'Temporary 24-hour content for behind-the-scenes and real-time updates', 'story', '1080x1920 (9:16 Vertical)', '1-15 seconds per slide', 20, 4,
  '{"title": "Story Content Planning", "checklist": ["Plan daily behind-the-scenes moments", "Prepare quick tips and motivational content", "Schedule real-time updates during classes", "Plan interactive elements (polls, questions)", "Prepare story highlights categories"], "timeline": "Daily ongoing content", "requirements": ["1080x1920 vertical format", "Quick, engaging content", "Good lighting for phone cameras", "Clear text overlays when needed"]}',
  '{"title": "Story Content Creation", "tips": ["Capture spontaneous, authentic moments", "Use story stickers for engagement (polls, questions)", "Keep individual stories short and snappy", "Use consistent branding elements", "Post consistently throughout the day"], "dosDonts": {"dos": ["Show authentic behind-the-scenes content", "Use interactive story features", "Post at optimal times when audience is active", "Save best stories to highlights"], "donts": ["Over-produce or make too polished", "Post too many stories in quick succession", "Ignore audience interaction opportunities", "Forget to check story analytics"]}, "equipment": ["Smartphone", "Good lighting source", "Story templates or graphics", "Consistent brand elements"]}',
  '{"title": "Story Examples", "descriptions": ["Morning gym setup behind-the-scenes", "Quick workout tip with text overlay", "Member spotlight or achievement celebration", "Live class update or energy check-in"], "commonMistakes": ["Making stories too long or complex", "Not using interactive features to engage audience", "Posting at wrong times when audience isn\'t active", "Forgetting to save important stories to highlights"]}'
),
('animated-image', 'Animated Image', 'GIFs, cinemagraphs, or short motion graphics for eye-catching posts', 'animated', '1080x1080 (Square) or 1080x1350 (Portrait)', '2-6 seconds loop', 6, 5,
  '{"title": "Animated Content Planning", "checklist": ["Identify repetitive motions that loop well", "Plan simple, focused animations", "Ensure smooth loop without jarring transitions", "Choose high-impact moments to animate", "Plan for file size optimization"], "timeline": "3-4 weeks for animated series", "requirements": ["Smooth looping animation", "Optimized file size for social media", "Clear focal point in animation", "High quality despite compression"]}',
  '{"title": "Animation Creation", "tips": ["Focus on one main element moving", "Keep loops short (2-6 seconds)", "Ensure seamless loop transition", "Use subtle movements for elegance", "Test on different devices and connections"], "dosDonts": {"dos": ["Keep animations simple and focused", "Test loop quality before posting", "Optimize file size for fast loading", "Choose movements that naturally loop"], "donts": ["Make animations too complex or busy", "Create jarring or obvious loop points", "Use file sizes too large for social media", "Animate everything - focus on one element"]}, "equipment": ["Video editing software", "High frame rate camera", "Tripod for stability", "GIF optimization tools"]}',
  '{"title": "Animated Examples", "descriptions": ["Weights lifting in smooth repetitive motion", "Treadmill belt moving with runner legs", "Water bottle filling or supplement pouring", "Equipment setup transformation timelapse"], "commonMistakes": ["Creating obvious, jarring loop transitions", "Making file sizes too large for social platforms", "Animating too many elements at once", "Using low frame rates that appear choppy"]}'
);