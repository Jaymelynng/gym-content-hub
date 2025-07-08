-- Clean up database - remove fake data and simplify schema

-- Delete all the fake/sample assignment data
DELETE FROM public.assignment_distributions;
DELETE FROM public.assignment_templates;
DELETE FROM public.assignment_submissions;

-- Remove complex fields from assignment_templates
ALTER TABLE public.assignment_templates 
DROP COLUMN IF EXISTS file_requirements,
DROP COLUMN IF EXISTS upload_specifications,
DROP COLUMN IF EXISTS video_photo_split,
DROP COLUMN IF EXISTS class_camp_split,
DROP COLUMN IF EXISTS formats_available,
DROP COLUMN IF EXISTS estimated_hours,
DROP COLUMN IF EXISTS submission_guidelines,
DROP COLUMN IF EXISTS requirements_text,
DROP COLUMN IF EXISTS assignment_brief;

-- Remove quality scoring and complex fields from assignment_submissions  
ALTER TABLE public.assignment_submissions
DROP COLUMN IF EXISTS quality_score,
DROP COLUMN IF EXISTS quality_notes,
DROP COLUMN IF EXISTS technical_notes,
DROP COLUMN IF EXISTS admin_feedback,
DROP COLUMN IF EXISTS revision_requested,
DROP COLUMN IF EXISTS revision_notes,
DROP COLUMN IF EXISTS final_approval,
DROP COLUMN IF EXISTS approved_by_admin,
DROP COLUMN IF EXISTS resubmission_count,
DROP COLUMN IF EXISTS file_metadata;

-- Simplify assignment_templates to just basic info
ALTER TABLE public.assignment_templates
ADD COLUMN IF NOT EXISTS clips_required INTEGER DEFAULT 4;

-- Simplify assignment_distributions
ALTER TABLE public.assignment_distributions
DROP COLUMN IF EXISTS collection_period,
DROP COLUMN IF EXISTS special_instructions,
DROP COLUMN IF EXISTS reminder_sent_at,
DROP COLUMN IF EXISTS acknowledged_at,
DROP COLUMN IF EXISTS started_at,
DROP COLUMN IF EXISTS reviewed_at,
DROP COLUMN IF EXISTS completed_at;