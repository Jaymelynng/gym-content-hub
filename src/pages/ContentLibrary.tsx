import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Image, CheckCircle, Target, BookOpen, Upload, Clock } from 'lucide-react';

// Content formats data
const contentFormats = [
  {
    id: 'static-photo',
    title: 'Static Photo',
    description: 'Single high-quality images',
    icon: Camera,
    uploaded: 3,
    total: 12,
    progress: 25,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'video-reel',
    title: 'Video Reel',
    description: 'Short-form vertical videos',
    icon: Video,
    uploaded: 1,
    total: 15,
    progress: 7,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'carousel-images',
    title: 'Carousel Images',
    description: 'Multi-image posts',
    icon: Image,
    uploaded: 0,
    total: 8,
    progress: 0,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

// Sample content for each format
const formatContent = {
  'static-photo': {
    setupPlanning: [
      'Find good natural lighting near a window',
      'Clear the background of any distractions',
      'Set up your phone at eye level using a tripod',
      'Have your workout clothes and props ready',
      'Check your hair and outfit before shooting'
    ],
    productionTips: [
      'Smile naturally and look confident',
      'Take multiple shots from different angles',
      'Use the rule of thirds for composition',
      'Keep your brand colors consistent',
      'Engage with the camera like talking to a friend'
    ],
    examples: [
      'Workout progress selfie with motivational quote',
      'Healthy meal prep showcase with recipe tips',
      'Exercise demonstration with form cues',
      'Before/after transformation with success story'
    ]
  },
  'video-reel': {
    setupPlanning: [
      'Plan your 15-30 second story arc',
      'Set up good lighting and audio recording',
      'Practice your movements and transitions',
      'Prepare props and equipment needed',
      'Choose engaging background music'
    ],
    productionTips: [
      'Hook viewers in the first 3 seconds',
      'Use jump cuts to maintain high energy',
      'Include captions for accessibility',
      'Plan for vertical viewing (phones)',
      'End with clear call-to-action'
    ],
    examples: [
      'Quick workout routine with progression',
      'Equipment setup and exercise demonstration',
      'Before/after transformation timelapse',
      'Behind-the-scenes gym preparation'
    ]
  },
  'carousel-images': {
    setupPlanning: [
      'Plan the sequence of 2-10 images',
      'Ensure consistent lighting across all photos',
      'Maintain the same aspect ratio',
      'Create a cohesive story flow',
      'Consider the swipe progression'
    ],
    productionTips: [
      'Use consistent visual style across images',
      'Make the first image attention-grabbing',
      'Include varied content types',
      'Add text overlay if needed',
      'Test the flow by swiping through'
    ],
    examples: [
      'Step-by-step exercise progression',
      'Before, during, after transformation',
      'Multiple angle equipment showcase',
      'Recipe preparation stages'
    ]
  }
};

const uploadRequirements = [
  { id: 1, title: 'Opening Hook', description: 'Eye-catching start', uploaded: false },
  { id: 2, title: 'Main Content', description: 'Core demonstration', uploaded: false },
  { id: 3, title: 'Supporting Material', description: 'Additional context', uploaded: false },
  { id: 4, title: 'Call to Action', description: 'Engagement driver', uploaded: false }
];

function ContentLibrary() {
  const [selectedFormatId, setSelectedFormatId] = useState('static-photo');
  const [activeTab, setActiveTab] = useState('setup');
  const { currentGym } = useAuth();
  
  if (!currentGym) {
    return <div className="p-6">Please log in to access Content Library</div>;
  }

  const selectedFormat = contentFormats.find(f => f.id === selectedFormatId) || contentFormats[0];
  const totalUploaded = contentFormats.reduce((sum, format) => sum + format.uploaded, 0);
  const totalRequired = contentFormats.reduce((sum, format) => sum + format.total, 0);
  const overallProgress = totalRequired > 0 ? Math.round((totalUploaded / totalRequired) * 100) : 0;

  const currentContent = formatContent[selectedFormatId as keyof typeof formatContent];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b bg-background">
        <h1 className="text-2xl font-bold">Content Library</h1>
        <p className="text-muted-foreground">Create and manage your gym's content across all formats</p>
      </div>

      {/* Three Panel Layout - CSS Grid 12 Columns */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        
        {/* LEFT PANEL - Tracker (2/12 cols = ~17%) */}
        <div className="col-span-2 border-r bg-background flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Content Formats</CardTitle>
            
            {/* Overall Progress */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-center space-y-2">
                <div className="text-xl font-bold">{totalUploaded}/{totalRequired}</div>
                <div className="text-xs text-muted-foreground">Total Progress</div>
                <Progress value={overallProgress} className="h-2" />
                <div className="text-xs font-medium">{overallProgress}% Complete</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {contentFormats.map((format) => {
                  const Icon = format.icon;
                  const isSelected = selectedFormat.id === format.id;
                  
                  return (
                    <div 
                      key={format.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'hover:bg-muted border-transparent'
                      }`}
                      onClick={() => setSelectedFormatId(format.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded ${format.bgColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-xs">{format.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{format.uploaded}/{format.total}</span>
                        <div className="w-12 h-1.5 bg-muted rounded-full">
                          <div 
                            className="h-1.5 bg-primary rounded-full transition-all" 
                            style={{ width: `${format.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </div>

        {/* CENTER PANEL - Content Tabs (7/12 cols = ~58%) */}
        <div className="col-span-7 bg-background flex flex-col">
          {/* Format Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedFormat.bgColor}`}>
                <selectedFormat.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedFormat.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedFormat.description}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('setup')}
                className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'setup' 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                Setup & Planning
              </button>
              <button
                onClick={() => setActiveTab('production')}
                className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'production' 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Target className="h-4 w-4" />
                Production Tips
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'examples' 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Content Examples
              </button>
            </div>
          </div>

          {/* Tab Content - ONLY THIS CHANGES */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {activeTab === 'setup' && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Setup & Planning Steps</h3>
                    </div>
                    <div className="space-y-4">
                      {currentContent.setupPlanning.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'production' && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Production Tips</h3>
                    </div>
                    <div className="space-y-4">
                      {currentContent.productionTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'examples' && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Content Examples</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {currentContent.examples.map((example, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/20">
                          <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium">{example}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* RIGHT PANEL - Uploader & Notes (3/12 cols = ~25%) */}
        <div className="col-span-3 border-l bg-background flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <CardTitle className="text-lg">Upload Tracker</CardTitle>
            </div>
            
            {/* Progress Summary */}
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedFormat.uploaded}</div>
              <div className="text-sm text-muted-foreground">of {selectedFormat.total} uploaded</div>
              <Progress value={selectedFormat.progress} className="mt-2" />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {uploadRequirements.map((requirement) => (
                  <div key={requirement.id} className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">{requirement.title}</h4>
                      <p className="text-xs text-muted-foreground">{requirement.description}</p>
                    </div>
                    
                    <div className="border-2 border-dashed border-muted rounded-lg p-3 text-center bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                      {requirement.uploaded ? (
                        <div>
                          <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Uploaded</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                          <div className="text-xs">
                            <p className="font-medium">Upload Files</p>
                            <p className="text-muted-foreground">or drop here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t space-y-2">
            <Button variant="outline" className="w-full text-sm">
              Save Draft
            </Button>
            <Button className="w-full text-sm">
              Submit ({selectedFormat.uploaded}/{selectedFormat.total})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentLibrary;