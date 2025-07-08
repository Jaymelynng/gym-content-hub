-- Insert sample assignment templates
INSERT INTO public.assignment_templates 
(title, description, priority, estimated_hours, formats_required, assignment_brief, requirements_text, submission_guidelines, upload_specifications, created_by_admin) 
VALUES 
(
  'Spring Camp Promotional Content',
  'Create engaging content to promote our upcoming spring gymnastics camp',
  'high',
  4.0,
  ARRAY['video-reel', 'static-photo', 'carousel-images'],
  'We need high-quality promotional content for our spring gymnastics camp. Focus on showcasing the fun, engaging atmosphere and highlight our experienced coaching staff. Content should appeal to parents looking for safe, educational activities for their children aged 6-14.',
  'Video Requirements:
- Minimum 20 seconds, maximum 60 seconds
- Vertical orientation (9:16 aspect ratio)
- Clear audio with no background noise
- Show gymnasts in action with proper technique
- Include coach interactions
- Bright, well-lit environment

Photo Requirements:
- Minimum 1080x1080 resolution
- High quality, well-composed shots
- Variety of ages and skill levels
- Action shots and candid moments
- Clean, professional gym environment',
  'Step 1: Select required formats from the submission panel
Step 2: Upload content following technical specifications
Step 3: Add descriptive captions explaining the content
Step 4: Submit for review
Step 5: Address any revision requests within 48 hours

Quality Checklist:
✓ Clear, crisp visuals
✓ Proper lighting
✓ No background distractions
✓ Safe gymnastics techniques shown
✓ Diverse representation
✓ Professional gym appearance',
  '{"video": {"min_duration": 20, "max_duration": 60, "formats": ["MP4", "MOV"], "orientation": "vertical"}, "photo": {"min_resolution": "1080x1080", "formats": ["JPG", "PNG"], "style": "high-quality"}}'::jsonb,
  '1426'
),
(
  'Safety Protocol Documentation',
  'Document our gym''s safety protocols and procedures for training materials',
  'urgent',
  2.5,
  ARRAY['video-reel', 'static-photo'],
  'Create comprehensive documentation of our safety protocols to be used in staff training and parent communication. Focus on equipment safety, spotting techniques, and emergency procedures.',
  'Content must clearly demonstrate:
- Proper equipment setup and inspection
- Correct spotting positions and techniques
- Emergency response procedures
- Equipment cleaning and maintenance
- Age-appropriate safety measures

Video Requirements:
- Clear demonstration of each safety procedure
- Professional narration or text overlays
- Multiple camera angles for complex procedures
- Minimum 20 seconds per procedure

Photo Requirements:
- Step-by-step process documentation
- Close-up shots of safety equipment
- Before/after comparisons
- Clear visibility of safety signage',
  'Submit all content with detailed descriptions
Include safety checklist documentation
Ensure all procedures comply with USAG guidelines
Content will be reviewed by head coach before approval
Use for staff training and parent orientation materials',
  '{"video": {"focus": "safety_demonstration", "quality": "professional"}, "photo": {"type": "documentation", "detail_level": "high"}}'::jsonb,
  '1426'
),
(
  'Student Achievement Highlights',
  'Showcase recent student achievements and progress for social media',
  'medium',
  3.0,
  ARRAY['carousel-images', 'video-reel', 'story'],
  'Celebrate our students'' recent achievements, including meet results, skill progressions, and personal milestones. Content should inspire current families and attract new students.',
  'Focus Areas:
- Competition results and medal ceremonies
- Before/after skill progression videos
- Students overcoming challenges
- Team celebrations and camaraderie
- Individual achievement moments

Content Guidelines:
- Obtain parent permission for all student features
- Positive, uplifting messaging
- Diverse representation across age groups
- Professional quality that reflects gym standards
- Include student quotes or testimonials when possible',
  'Coordinate with coaching staff for achievement identification
Secure parent/guardian consent for all featured students
Create engaging captions that tell the story
Schedule posts for maximum engagement
Track engagement metrics for future reference',
  '{"social_media": {"platforms": ["Instagram", "Facebook"], "engagement_focus": true}, "consent": {"required": "parent_guardian", "documentation": "mandatory"}}'::jsonb,
  '1426'
);

-- Insert sample assignment distributions for CPF gym
INSERT INTO public.assignment_distributions 
(template_id, assigned_to_gym_id, assigned_by_admin, due_date, status, admin_notes)
VALUES 
(
  1,
  'CPF',
  '1426',
  NOW() + INTERVAL '10 days',
  'assigned',
  'Priority assignment for upcoming camp registration opening. Please focus on high-energy, fun content that showcases our facility.'
),
(
  2,
  'CPF',
  '1426',
  NOW() + INTERVAL '5 days',
  'in-progress',
  'Urgent - needed for staff training next week. Please coordinate with head coach Sarah for content review.'
),
(
  3,
  'CPF',
  '1426',
  NOW() + INTERVAL '14 days',
  'acknowledged',
  'Great opportunity to highlight our recent regional meet success. Please include Emma''s floor routine win.'
);

-- Insert similar assignments for other gyms
INSERT INTO public.assignment_distributions 
(template_id, assigned_to_gym_id, assigned_by_admin, due_date, status)
VALUES 
(1, 'CRR', '1426', NOW() + INTERVAL '12 days', 'assigned'),
(1, 'CCP', '1426', NOW() + INTERVAL '8 days', 'in-progress'),
(2, 'RBA', '1426', NOW() + INTERVAL '6 days', 'assigned'),
(3, 'RBK', '1426', NOW() + INTERVAL '15 days', 'assigned'),
(1, 'HGA', '1426', NOW() + INTERVAL '9 days', 'acknowledged');