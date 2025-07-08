import React from 'react';
import { Camera, Video, Image, Clock, Zap } from 'lucide-react';

export interface ContentFormat {
  id: string;
  title: string;
  type: string;
  icon: React.ReactNode;
  uploaded: number;
  total: number;
  progress: number;
  bgColor: string;
  borderColor: string;
  dimensions: string;
  duration: string;
  description: string;
}

export interface UploadItem {
  id: number;
  title: string;
  description: string;
  uploaded: boolean;
}

export interface ContentPlan {
  title: string;
  description: string;
  setupSteps: string[];
  productionTips: string[];
  examples: string[];
  commonMistakes: string[];
  equipmentList: string[];
  timeline: string[];
  uploads: UploadItem[];
}

export const contentFormats: ContentFormat[] = [
  {
    id: 'static-photo',
    title: 'Static Photo',
    type: 'photo',
    icon: React.createElement(Camera, { className: "h-5 w-5" }),
    uploaded: 0,
    total: 12,
    progress: 0,
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    dimensions: '1080x1080',
    duration: 'N/A',
    description: 'Single high-quality images for social media posts'
  },
  {
    id: 'carousel-images',
    title: 'Carousel Images',
    type: 'carousel',
    icon: React.createElement(Image, { className: "h-5 w-5" }),
    uploaded: 0,
    total: 8,
    progress: 0,
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    dimensions: '1080x1080 (2-10 slides)',
    duration: 'N/A',
    description: 'Multi-image storytelling with consistent style'
  },
  {
    id: 'video-reel',
    title: 'Video Reel',
    type: 'video',
    icon: React.createElement(Video, { className: "h-5 w-5" }),
    uploaded: 0,
    total: 15,
    progress: 0,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    dimensions: '1080x1920',
    duration: '15-60 seconds',
    description: 'Short-form vertical videos for maximum engagement'
  },
  {
    id: 'story',
    title: 'Story',
    type: 'story',
    icon: React.createElement(Clock, { className: "h-5 w-5" }),
    uploaded: 0,
    total: 20,
    progress: 0,
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    dimensions: '1080x1920',
    duration: '1-15s per slide',
    description: 'Temporary 24-hour content for behind-the-scenes moments'
  },
  {
    id: 'animated-image',
    title: 'Animated Image',
    type: 'animated',
    icon: React.createElement(Zap, { className: "h-5 w-5" }),
    uploaded: 0,
    total: 6,
    progress: 0,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    dimensions: '1080x1080',
    duration: '2-6s loops',
    description: 'GIFs and motion graphics with smooth looping'
  }
];

export const contentPlans: Record<string, ContentPlan> = {
  'static-photo': {
    title: 'Static Photo Content',
    description: 'Create engaging single images that stop the scroll and showcase your gym\'s energy',
    setupSteps: [
      'Find good natural lighting near a window or well-lit area',
      'Clear the background of any distractions or equipment',
      'Set up your phone at eye level using a tripod or stack of books',
      'Have your workout clothes and any props ready',
      'Check your hair, outfit, and overall appearance in the camera',
      'Ensure the space is clean and organized',
      'Test different angles and compositions before shooting',
      'Have backup lighting options ready (ring light, lamps)'
    ],
    productionTips: [
      'Smile naturally and look confident - fake smiles are obvious',
      'Take multiple shots from different angles (front, side, 3/4 view)',
      'Use the rule of thirds for better composition',
      'Keep your brand colors consistent across all photos',
      'Engage with the camera like you are talking to a friend',
      'Show genuine emotion and personality',
      'Include props that tell your story (weights, equipment, healthy food)',
      'Experiment with different poses and expressions',
      'Use natural gestures and avoid stiff poses',
      'Ensure good contrast between subject and background'
    ],
    examples: [
      'Workout progress selfie with motivational quote overlay',
      'Healthy meal prep showcase with recipe tips in caption',
      'Exercise demonstration with form cues and safety tips',
      'Before/after transformation with success story',
      'Equipment setup with workout plan explanation',
      'Group class energy with community feel',
      'Personal trainer with client success story',
      'Gym facility tour highlighting key areas'
    ],
    commonMistakes: [
      'Poor lighting creating shadows or washed-out images',
      'Cluttered backgrounds that distract from the main subject',
      'Unnatural poses that look forced or uncomfortable',
      'Inconsistent brand colors or styling',
      'Low resolution images that look pixelated',
      'Missing clear focal point or subject',
      'Over-editing that makes images look artificial',
      'Not considering how the image will look on mobile devices'
    ],
    equipmentList: [
      'Smartphone with good camera (iPhone 12+ or equivalent)',
      'Tripod or phone stand for stable shots',
      'Ring light or natural lighting setup',
      'Clean, organized workout space',
      'Props relevant to your content (weights, equipment, etc.)',
      'Backdrop or clean wall for consistent backgrounds',
      'Mirror for checking appearance before shooting',
      'Backup lighting sources'
    ],
    timeline: [
      'Day 1: Plan content themes and gather props',
      'Day 2: Set up lighting and test different angles',
      'Day 3: Shoot 3-4 different photo concepts',
      'Day 4: Review and select best shots',
      'Day 5: Edit and prepare for upload'
    ],
    uploads: [
      { 
        id: 1, 
        title: 'Opening Hook', 
        description: 'Eye-catching image that stops the scroll',
        uploaded: false 
      },
      { 
        id: 2, 
        title: 'Workout Demo', 
        description: 'Clear demonstration of proper form',
        uploaded: false 
      },
      { 
        id: 3, 
        title: 'Progress Showcase', 
        description: 'Highlight achievements and transformations',
        uploaded: false 
      },
      { 
        id: 4, 
        title: 'Lifestyle Connection', 
        description: 'Link exercise to daily life application',
        uploaded: false 
      },
      { 
        id: 5, 
        title: 'Equipment Focus', 
        description: 'Showcase specific equipment or exercises',
        uploaded: false 
      },
      { 
        id: 6, 
        title: 'Community Feel', 
        description: 'Group shots or class energy',
        uploaded: false 
      },
      { 
        id: 7, 
        title: 'Behind the Scenes', 
        description: 'Authentic moments and preparation',
        uploaded: false 
      },
      { 
        id: 8, 
        title: 'Call to Action', 
        description: 'Encourage engagement and next steps',
        uploaded: false 
      },
      { 
        id: 9, 
        title: 'Motivational Quote', 
        description: 'Inspirational content with visual appeal',
        uploaded: false 
      },
      { 
        id: 10, 
        title: 'Before/After', 
        description: 'Transformation stories with visual proof',
        uploaded: false 
      },
      { 
        id: 11, 
        title: 'Nutrition Focus', 
        description: 'Healthy eating and meal prep content',
        uploaded: false 
      },
      { 
        id: 12, 
        title: 'Recovery & Wellness', 
        description: 'Rest days, stretching, and self-care',
        uploaded: false 
      }
    ]
  },
  'carousel-images': {
    title: 'Carousel Images Content',
    description: 'Create multi-image stories that guide viewers through a complete narrative',
    setupSteps: [
      'Plan your story sequence with 2-10 cohesive images',
      'Ensure all images have consistent dimensions (1080x1080)',
      'Create a visual flow that makes sense when swiped',
      'Set up consistent lighting across all shots',
      'Prepare props and equipment for each image',
      'Plan the narrative arc from first to last image',
      'Test the carousel flow on your phone before shooting',
      'Ensure each image can stand alone but works in sequence'
    ],
    productionTips: [
      'Start with your strongest image to hook viewers',
      'Maintain consistent color grading across all images',
      'Use similar composition techniques throughout',
      'Create visual continuity between slides',
      'Include variety in poses and angles while maintaining cohesion',
      'Use text overlays strategically across multiple slides',
      'Ensure smooth transitions between images',
      'Keep the story engaging throughout the entire carousel',
      'End with a clear call-to-action or conclusion',
      'Test the carousel on different devices to ensure quality'
    ],
    examples: [
      'Complete workout routine with step-by-step progression',
      'Equipment setup guide with multiple angles',
      'Before/during/after transformation story',
      'Recipe tutorial with ingredient and process shots',
      'Gym tour with different facility areas',
      'Exercise form guide with multiple angles',
      'Day-in-the-life story with various activities',
      'Progress tracking with milestone celebrations'
    ],
    commonMistakes: [
      'Inconsistent dimensions causing awkward cropping',
      'Poor visual flow between images',
      'Repetitive content that doesn\'t add value',
      'Inconsistent lighting or color grading',
      'Weak first image that doesn\'t hook viewers',
      'Too many images that lose viewer attention',
      'Lack of clear narrative or purpose',
      'Poor quality images that don\'t match the first slide'
    ],
    equipmentList: [
      'Smartphone with consistent camera settings',
      'Tripod for stable, consistent shots',
      'Consistent lighting setup for all images',
      'Props and equipment for each slide',
      'Color grading tools or presets',
      'Grid overlay for consistent composition',
      'Backup lighting for consistency',
      'Props that tell your complete story'
    ],
    timeline: [
      'Day 1: Plan complete story and gather all props',
      'Day 2: Set up consistent lighting and test shots',
      'Day 3: Shoot all images in sequence',
      'Day 4: Edit and ensure consistency across all images',
      'Day 5: Test carousel flow and prepare for upload'
    ],
    uploads: [
      { 
        id: 1, 
        title: 'Hook Image', 
        description: 'First image that grabs attention',
        uploaded: false 
      },
      { 
        id: 2, 
        title: 'Story Development', 
        description: 'Middle images that build the narrative',
        uploaded: false 
      },
      { 
        id: 3, 
        title: 'Key Information', 
        description: 'Educational or informative content',
        uploaded: false 
      },
      { 
        id: 4, 
        title: 'Visual Progression', 
        description: 'Show transformation or process',
        uploaded: false 
      },
      { 
        id: 5, 
        title: 'Behind the Scenes', 
        description: 'Authentic moments and preparation',
        uploaded: false 
      },
      { 
        id: 6, 
        title: 'Results/Outcome', 
        description: 'Show final results or achievements',
        uploaded: false 
      },
      { 
        id: 7, 
        title: 'Call to Action', 
        description: 'Encourage engagement and next steps',
        uploaded: false 
      },
      { 
        id: 8, 
        title: 'Bonus Content', 
        description: 'Extra value or exclusive content',
        uploaded: false 
      }
    ]
  },
  'video-reel': {
    title: 'Video Reel Content',
    description: 'Create dynamic short-form videos that capture attention and drive engagement',
    setupSteps: [
      'Plan your 15-60 second story arc with clear beginning, middle, and end',
      'Set up good lighting and audio recording environment',
      'Practice your movements and transitions multiple times',
      'Prepare props and equipment needed for the entire video',
      'Choose engaging background music that fits your brand',
      'Plan your hook within the first 3 seconds',
      'Set up your phone in vertical orientation (9:16 aspect ratio)',
      'Test audio levels and ensure clear sound quality',
      'Practice the complete sequence before recording',
      'Have backup props and equipment ready'
    ],
    productionTips: [
      'Start with a strong hook in the first 3 seconds to grab attention',
      'Use quick cuts and transitions to maintain energy and engagement',
      'Show transformation or progression throughout the video',
      'Include captions for accessibility and better engagement',
      'End with a clear call-to-action that encourages interaction',
      'Keep the camera stable - use a tripod or steady hand',
      'Use dynamic movements and angles to create visual interest',
      'Incorporate trending sounds or music when appropriate',
      'Show genuine emotion and personality throughout',
      'Use the rule of thirds for better composition',
      'Include variety in shots (close-up, medium, wide)',
      'Ensure good contrast between subject and background'
    ],
    examples: [
      'Quick workout routine with progression and results',
      'Equipment setup and exercise demonstration with form cues',
      'Before/after transformation timelapse with motivation',
      'Behind-the-scenes gym preparation and workout',
      'Day-in-the-life story with various activities',
      'Exercise tutorial with step-by-step instructions',
      'Motivational content with personal story',
      'Challenge or competition with community engagement'
    ],
    commonMistakes: [
      'Weak opening that doesn\'t hook viewers in first 3 seconds',
      'Poor audio quality or background noise',
      'Shaky camera work that\'s distracting',
      'Too much information crammed into short video',
      'Lack of clear call-to-action at the end',
      'Inconsistent lighting throughout the video',
      'Poor pacing that loses viewer attention',
      'Not optimizing for mobile viewing experience'
    ],
    equipmentList: [
      'Smartphone with good video capabilities',
      'Tripod or phone stabilizer for steady shots',
      'External microphone for better audio quality',
      'Ring light or natural lighting setup',
      'Props and equipment for your video content',
      'Background music or sound effects',
      'Video editing app with transitions and effects',
      'Backup lighting and audio sources'
    ],
    timeline: [
      'Day 1: Plan video concept and gather all props',
      'Day 2: Set up lighting, audio, and practice movements',
      'Day 3: Record multiple takes of the complete video',
      'Day 4: Edit video, add captions, and music',
      'Day 5: Review and optimize for platform requirements'
    ],
    uploads: [
      { 
        id: 1, 
        title: 'Hook Video', 
        description: 'First 3 seconds that grab attention',
        uploaded: false 
      },
      { 
        id: 2, 
        title: 'Main Content', 
        description: 'Core demonstration or story',
        uploaded: false 
      },
      { 
        id: 3, 
        title: 'Transition', 
        description: 'Smooth connection between segments',
        uploaded: false 
      },
      { 
        id: 4, 
        title: 'Progression', 
        description: 'Show transformation or improvement',
        uploaded: false 
      },
      { 
        id: 5, 
        title: 'Behind the Scenes', 
        description: 'Authentic moments and preparation',
        uploaded: false 
      },
      { 
        id: 6, 
        title: 'Equipment Focus', 
        description: 'Showcase specific equipment or exercises',
        uploaded: false 
      },
      { 
        id: 7, 
        title: 'Community Content', 
        description: 'Group activities or class energy',
        uploaded: false 
      },
      { 
        id: 8, 
        title: 'Motivational', 
        description: 'Inspirational content with personal story',
        uploaded: false 
      },
      { 
        id: 9, 
        title: 'Tutorial', 
        description: 'Step-by-step exercise instructions',
        uploaded: false 
      },
      { 
        id: 10, 
        title: 'Challenge', 
        description: 'Interactive content with viewer participation',
        uploaded: false 
      },
      { 
        id: 11, 
        title: 'Results', 
        description: 'Show final outcomes and achievements',
        uploaded: false 
      },
      { 
        id: 12, 
        title: 'Closing CTA', 
        description: 'Final call-to-action or result',
        uploaded: false 
      },
      { 
        id: 13, 
        title: 'Bonus Content', 
        description: 'Extra value or exclusive content',
        uploaded: false 
      },
      { 
        id: 14, 
        title: 'Day in the Life', 
        description: 'Complete daily routine or schedule',
        uploaded: false 
      },
      { 
        id: 15, 
        title: 'Recovery Focus', 
        description: 'Rest days, stretching, and wellness',
        uploaded: false 
      }
    ]
  },
  'story': {
    title: 'Story Content',
    description: 'Create temporary 24-hour content for behind-the-scenes moments and quick engagement',
    setupSteps: [
      'Plan quick, engaging content that fits 1-15 second format',
      'Set up good lighting for quick, quality shots',
      'Prepare props and equipment for spontaneous moments',
      'Plan interactive elements like polls or questions',
      'Have backup content ideas ready for quick posting',
      'Test different story formats and features',
      'Ensure your space is clean and organized',
      'Plan your story sequence and flow'
    ],
    productionTips: [
      'Keep content quick and engaging - viewers have short attention spans',
      'Use interactive features like polls, questions, and stickers',
      'Show behind-the-scenes moments and authentic content',
      'Use consistent branding and colors',
      'Include call-to-action in your stories',
      'Use trending music and sounds when appropriate',
      'Show personality and genuine moments',
      'Use different story features (polls, questions, countdowns)',
      'Create series of connected stories for longer engagement',
      'Respond to viewer interactions quickly'
    ],
    examples: [
      'Behind-the-scenes workout preparation',
      'Quick exercise demonstrations',
      'Daily motivation and inspiration',
      'Equipment setup and organization',
      'Progress updates and milestones',
      'Community highlights and shoutouts',
      'Quick tips and advice',
      'Personal stories and experiences'
    ],
    commonMistakes: [
      'Content that\'s too long for story format',
      'Poor lighting making content hard to see',
      'Lack of engagement with viewers',
      'Inconsistent posting schedule',
      'Not using interactive features',
      'Content that doesn\'t fit your brand',
      'Poor quality audio or video',
      'Not responding to viewer interactions'
    ],
    equipmentList: [
      'Smartphone with good camera',
      'Good lighting setup for quick shots',
      'Props and equipment for spontaneous content',
      'Story templates or overlays',
      'Music and sound effects library',
      'Interactive stickers and features',
      'Backup lighting for different locations',
      'Props for various content types'
    ],
    timeline: [
      'Day 1: Plan weekly story themes and content ideas',
      'Day 2: Set up lighting and test different story features',
      'Day 3: Create 3-4 different story sequences',
      'Day 4: Review and optimize story flow',
      'Day 5: Schedule and prepare for posting'
    ],
    uploads: [
      { 
        id: 1, 
        title: 'Morning Motivation', 
        description: 'Start the day with inspiration',
        uploaded: false 
      },
      { 
        id: 2, 
        title: 'Workout Prep', 
        description: 'Behind-the-scenes preparation',
        uploaded: false 
      },
      { 
        id: 3, 
        title: 'Exercise Demo', 
        description: 'Quick form demonstrations',
        uploaded: false 
      },
      { 
        id: 4, 
        title: 'Progress Update', 
        description: 'Share achievements and milestones',
        uploaded: false 
      },
      { 
        id: 5, 
        title: 'Equipment Focus', 
        description: 'Showcase specific equipment',
        uploaded: false 
      },
      { 
        id: 6, 
        title: 'Community Highlight', 
        description: 'Shout out to members and achievements',
        uploaded: false 
      },
      { 
        id: 7, 
        title: 'Quick Tips', 
        description: 'Fast advice and guidance',
        uploaded: false 
      },
      { 
        id: 8, 
        title: 'Behind the Scenes', 
        description: 'Authentic moments and preparation',
        uploaded: false 
      },
      { 
        id: 9, 
        title: 'Interactive Poll', 
        description: 'Engage with audience questions',
        uploaded: false 
      },
      { 
        id: 10, 
        title: 'Day in the Life', 
        description: 'Complete daily routine',
        uploaded: false 
      },
      { 
        id: 11, 
        title: 'Motivational Quote', 
        description: 'Inspirational content',
        uploaded: false 
      },
      { 
        id: 12, 
        title: 'Workout Challenge', 
        description: 'Interactive fitness challenges',
        uploaded: false 
      },
      { 
        id: 13, 
        title: 'Recovery Focus', 
        description: 'Rest days and wellness',
        uploaded: false 
      },
      { 
        id: 14, 
        title: 'Nutrition Tips', 
        description: 'Healthy eating advice',
        uploaded: false 
      },
      { 
        id: 15, 
        title: 'Equipment Tutorial', 
        description: 'How to use specific equipment',
        uploaded: false 
      },
      { 
        id: 16, 
        title: 'Personal Story', 
        description: 'Share personal experiences',
        uploaded: false 
      },
      { 
        id: 17, 
        title: 'Goal Setting', 
        description: 'Help viewers set and achieve goals',
        uploaded: false 
      },
      { 
        id: 18, 
        title: 'Community Building', 
        description: 'Foster connections and relationships',
        uploaded: false 
      },
      { 
        id: 19, 
        title: 'Success Stories', 
        description: 'Share member achievements',
        uploaded: false 
      },
      { 
        id: 20, 
        title: 'Call to Action', 
        description: 'Encourage engagement and next steps',
        uploaded: false 
      }
    ]
  },
  'animated-image': {
    title: 'Animated Image Content',
    description: 'Create engaging GIFs and motion graphics with smooth looping for visual appeal',
    setupSteps: [
      'Plan simple, focused animations that loop seamlessly',
      'Set up consistent lighting for smooth motion capture',
      'Prepare props and equipment for the animation sequence',
      'Plan the animation timing and transitions',
      'Test different animation speeds and durations',
      'Ensure the animation tells a clear story or message',
      'Practice the complete animation sequence',
      'Set up your phone for stable, consistent recording'
    ],
    productionTips: [
      'Keep animations simple and focused - avoid complex movements',
      'Ensure smooth looping without jarring transitions',
      'Use consistent lighting throughout the animation',
      'Keep file size optimized for social media platforms',
      'Use natural movements that look authentic',
      'Include subtle effects that enhance without distracting',
      'Test the animation on different devices',
      'Use trending animation styles when appropriate',
      'Keep the animation duration between 2-6 seconds',
      'Ensure the animation works well in a small format'
    ],
    examples: [
      'Exercise demonstration with smooth motion',
      'Equipment setup with animated transitions',
      'Progress transformation with animated effects',
      'Motivational quote with animated text',
      'Workout routine with animated transitions',
      'Before/after with animated comparison',
      'Equipment tutorial with animated highlights',
      'Community celebration with animated effects'
    ],
    commonMistakes: [
      'Complex animations that are distracting or confusing',
      'Poor looping that creates jarring transitions',
      'Large file sizes that don\'t load quickly',
      'Inconsistent lighting throughout the animation',
      'Animations that don\'t work well on mobile',
      'Over-editing that makes content look artificial',
      'Animations that don\'t fit the brand or message',
      'Poor timing that loses viewer attention'
    ],
    equipmentList: [
      'Smartphone with good video capabilities',
      'Tripod for stable, consistent recording',
      'Consistent lighting setup for smooth motion',
      'Props and equipment for animation content',
      'Video editing app with animation features',
      'GIF creation tools or apps',
      'Backup lighting for consistency',
      'Props that work well in animated format'
    ],
    timeline: [
      'Day 1: Plan animation concept and gather props',
      'Day 2: Set up lighting and test animation timing',
      'Day 3: Record multiple takes of the animation',
      'Day 4: Edit and create smooth looping animation',
      'Day 5: Optimize file size and test on different platforms'
    ],
    uploads: [
      { 
        id: 1, 
        title: 'Exercise Demo', 
        description: 'Smooth exercise demonstration',
        uploaded: false 
      },
      { 
        id: 2, 
        title: 'Equipment Setup', 
        description: 'Animated equipment preparation',
        uploaded: false 
      },
      { 
        id: 3, 
        title: 'Progress Animation', 
        description: 'Animated transformation or improvement',
        uploaded: false 
      },
      { 
        id: 4, 
        title: 'Motivational Content', 
        description: 'Animated inspirational messages',
        uploaded: false 
      },
      { 
        id: 5, 
        title: 'Workout Flow', 
        description: 'Smooth workout routine transitions',
        uploaded: false 
      },
      { 
        id: 6, 
        title: 'Celebration', 
        description: 'Animated achievement celebrations',
        uploaded: false 
      }
    ]
  }
};