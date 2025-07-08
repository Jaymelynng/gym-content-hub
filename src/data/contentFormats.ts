import React from 'react';
import { Camera, Video } from 'lucide-react';

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
  uploads: UploadItem[];
}

export const contentFormats: ContentFormat[] = [
  {
    id: 'photo-post',
    title: 'Photo Post',
    type: 'photo',
    icon: React.createElement(Camera, { className: "h-5 w-5" }),
    uploaded: 0,
    total: 4,
    progress: 0,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'video-reel',
    title: 'Video Reel',
    type: 'video', 
    icon: React.createElement(Video, { className: "h-5 w-5" }),
    uploaded: 0,
    total: 4,
    progress: 0,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

export const contentPlans: Record<string, ContentPlan> = {
  'photo-post': {
    title: 'Photo Post Content',
    description: 'Create engaging photo content for social media',
    setupSteps: [
      'Find good natural lighting near a window',
      'Clear the background of any distractions', 
      'Set up your phone at eye level using a tripod or stack of books',
      'Have your workout clothes and any props ready',
      'Check your hair and outfit in the camera before shooting'
    ],
    productionTips: [
      'Smile naturally and look confident',
      'Take multiple shots from different angles',
      'Use the rule of thirds for better composition',
      'Keep your brand colors consistent',
      'Engage with the camera like you are talking to a friend'
    ],
    examples: [
      'Workout progress selfie with motivational quote',
      'Healthy meal prep showcase with recipe tips',
      'Exercise demonstration with form cues',
      'Before/after transformation with success story'
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
        title: 'Handstand Demo', 
        description: 'Clear demonstration of proper form',
        uploaded: false 
      },
      { 
        id: 3, 
        title: 'Homework Connection', 
        description: 'Link exercise to daily life application',
        uploaded: false 
      },
      { 
        id: 4, 
        title: 'Call to Action', 
        description: 'Encourage engagement and next steps',
        uploaded: false 
      }
    ]
  },
  'video-reel': {
    title: 'Video Reel Content',
    description: 'Create dynamic video content for maximum engagement',
    setupSteps: [
      'Plan your 15-30 second story arc',
      'Set up good lighting and audio recording',
      'Practice your movements and transitions',
      'Prepare props and equipment needed',
      'Choose engaging background music'
    ],
    productionTips: [
      'Start with a strong hook in first 3 seconds',
      'Use quick cuts to maintain energy',
      'Show transformation or progression',
      'Include captions for accessibility',
      'End with clear call-to-action'
    ],
    examples: [
      'Quick workout routine with progression',
      'Equipment setup and exercise demonstration', 
      'Before/after transformation timelapse',
      'Behind-the-scenes gym preparation'
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
        title: 'Closing CTA', 
        description: 'Final call-to-action or result',
        uploaded: false 
      }
    ]
  }
};