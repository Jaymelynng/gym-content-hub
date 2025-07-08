import React, { useState } from 'react';
import { FormatSidebar } from '@/components/content-library/FormatSidebar';
import { ContentTabs } from '@/components/content-library/ContentTabs';
import { UploadPanel } from '@/components/content-library/UploadPanel';
import { useAuth } from '@/contexts/AuthContext';

// Temporary static data to fix the modal issue
const staticFormats = [
  {
    id: '1',
    format_key: 'static-photo',
    title: 'Static Photo',
    description: 'Single high-quality images showcasing gym activities, equipment, or results',
    format_type: 'photo' as const,
    dimensions: '1080x1080',
    duration: 'N/A',
    total_required: 12,
    setup_planning: {
      steps: [
        'Find good natural lighting near a window',
        'Clear the background of any distractions',
        'Set up your phone at eye level using a tripod or stack of books',
        'Have your workout clothes and any props ready',
        'Check your hair and outfit in the camera before shooting'
      ]
    },
    production_tips: {
      tips: [
        'Smile naturally and look confident',
        'Take multiple shots from different angles',
        'Use the rule of thirds for better composition',
        'Keep your brand colors consistent',
        'Engage with the camera like you are talking to a friend'
      ]
    },
    examples: {
      examples: [
        'Workout progress selfie with motivational quote',
        'Healthy meal prep showcase with recipe tips',
        'Exercise demonstration with form cues',
        'Before/after transformation with success story'
      ]
    }
  },
  {
    id: '2',
    format_key: 'video-reel',
    title: 'Video Reel',
    description: 'Short-form vertical videos for maximum engagement',
    format_type: 'video' as const,
    dimensions: '1080x1920',
    duration: '15-60s',
    total_required: 15,
    setup_planning: {
      steps: [
        'Plan your 15-30 second story arc',
        'Set up good lighting and audio recording',
        'Practice your movements and transitions',
        'Prepare props and equipment needed',
        'Choose engaging background music'
      ]
    },
    production_tips: {
      tips: [
        'Start with a strong hook in first 3 seconds',
        'Use quick cuts to maintain energy',
        'Show transformation or progression',
        'Include captions for accessibility',
        'End with clear call-to-action'
      ]
    },
    examples: {
      examples: [
        'Quick workout routine with progression',
        'Equipment setup and exercise demonstration',
        'Before/after transformation timelapse',
        'Behind-the-scenes gym preparation'
      ]
    }
  }
];

function ContentLibrary() {
  const [selectedFormatId, setSelectedFormatId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState('setup');
  const { currentGym } = useAuth();
  
  const selectedFormat = staticFormats.find(f => f.id === selectedFormatId) || staticFormats[0];
  
  if (!currentGym) {
    return <div className="flex items-center justify-center h-full">Please log in to access Content Library</div>;
  }

  return (
    <div className="flex gap-6 p-6 bg-muted/20" style={{ height: 'calc(100vh - 3rem)' }}>
      <div className="w-[18%] flex-shrink-0 h-full">
        <FormatSidebar
          contentFormats={staticFormats}
          selectedFormat={selectedFormat}
          onFormatSelect={(format) => setSelectedFormatId(format.id)}
        />
      </div>

      <div className="w-[57%] flex-shrink-0 h-full">
        <ContentTabs
          selectedFormat={selectedFormat}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="w-[25%] flex-shrink-0 h-full">
        <UploadPanel
          selectedFormat={selectedFormat}
        />
      </div>
    </div>
  );
}

export default ContentLibrary;