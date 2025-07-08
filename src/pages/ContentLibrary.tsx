import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Video, Image, Play, Repeat, CheckCircle, Target, BookOpen, Upload, FileText } from 'lucide-react';

// Static data for the formats
const staticFormats = [
  {
    id: '1',
    title: 'Static Photo',
    description: 'Single high-quality images',
    type: 'photo',
    uploaded: 0,
    total: 12,
    progress: 0,
    icon: Camera,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
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
    title: 'Video Reel',
    description: 'Short-form vertical videos',
    type: 'video',
    uploaded: 0,
    total: 15,
    progress: 0,
    icon: Video,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
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
  },
  {
    id: '3',
    title: 'Carousel Images',
    description: 'Multi-image posts',
    type: 'carousel',
    uploaded: 0,
    total: 8,
    progress: 0,
    icon: Image,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    setup_planning: {
      steps: [
        'Plan the sequence of 2-10 images',
        'Ensure consistent lighting across all photos',
        'Maintain the same aspect ratio for all images',
        'Create a cohesive story flow',
        'Consider the swipe progression'
      ]
    },
    production_tips: {
      tips: [
        'Use consistent visual style across all images',
        'Make the first image attention-grabbing',
        'Include varied content types (close-ups, wide shots)',
        'Add text overlay if needed',
        'Test the flow by swiping through'
      ]
    },
    examples: {
      examples: [
        'Step-by-step exercise progression',
        'Before, during, after transformation',
        'Multiple angle equipment showcase',
        'Recipe preparation stages'
      ]
    }
  }
];

const uploadRequirements = [
  {
    id: 1,
    title: 'Opening Hook',
    description: 'Eye-catching content that stops the scroll',
    uploaded: false
  },
  {
    id: 2,
    title: 'Main Content',
    description: 'Core demonstration or message',
    uploaded: false
  },
  {
    id: 3,
    title: 'Supporting Material',
    description: 'Additional context or angles',
    uploaded: false
  },
  {
    id: 4,
    title: 'Call to Action',
    description: 'Engagement driver and next steps',
    uploaded: false
  }
];

function ContentLibrary() {
  const [selectedFormatId, setSelectedFormatId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState('setup');
  const { currentGym } = useAuth();
  
  const selectedFormat = staticFormats.find(f => f.id === selectedFormatId) || staticFormats[0];
  const totalUploaded = staticFormats.reduce((sum, format) => sum + format.uploaded, 0);
  const totalRequired = staticFormats.reduce((sum, format) => sum + format.total, 0);
  const overallProgress = totalRequired > 0 ? (totalUploaded / totalRequired) * 100 : 0;
  
  if (!currentGym) {
    return <div className="flex items-center justify-center h-full">Please log in to access Content Library</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b bg-background">
        <h1 className="text-2xl font-bold">Content Library</h1>
        <p className="text-muted-foreground">Create and manage your gym's content across all formats</p>
      </div>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL - Format Selection (18%) */}
        <div className="w-[18%] border-r bg-background flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-4">Content Formats</h2>
            
            {/* Overall Progress */}
            <div className="p-3 bg-muted rounded-lg mb-4">
              <div className="text-center space-y-2">
                <div className="text-xl font-bold">{totalUploaded}/{totalRequired}</div>
                <div className="text-xs text-muted-foreground">Total Progress</div>
                <Progress value={overallProgress} className="h-2" />
                <div className="text-xs font-medium">{Math.round(overallProgress)}% Complete</div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {staticFormats.map((format) => {
                const IconComponent = format.icon;
                return (
                  <div 
                    key={format.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedFormat.id === format.id 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'hover:bg-muted border-transparent'
                    }`}
                    onClick={() => setSelectedFormatId(format.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${format.bgColor}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm">{format.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{format.uploaded}/{format.total}</span>
                      <div className="w-12 h-1 bg-muted rounded-full">
                        <div 
                          className="h-1 bg-primary rounded-full transition-all" 
                          style={{ width: `${format.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* CENTER PANEL - Content Tabs (62%) */}
        <div className="w-[62%] flex flex-col">
          <div className="p-4 border-b bg-background">
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b bg-background">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
                <TabsTrigger value="production">Production Tips</TabsTrigger>
                <TabsTrigger value="examples">Content Examples</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="setup" className="h-full m-0">
                <div className="h-full p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Setup & Planning Steps</h3>
                  </div>
                  <ScrollArea className="h-[calc(100%-3rem)]">
                    <div className="space-y-4 pr-4">
                      {selectedFormat.setup_planning.steps.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="production" className="h-full m-0">
                <div className="h-full p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Production Tips</h3>
                  </div>
                  <ScrollArea className="h-[calc(100%-3rem)]">
                    <div className="space-y-4 pr-4">
                      {selectedFormat.production_tips.tips.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="h-full m-0">
                <div className="h-full p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Content Examples</h3>
                  </div>
                  <ScrollArea className="h-[calc(100%-3rem)]">
                    <div className="grid grid-cols-2 gap-4 pr-4">
                      {selectedFormat.examples.examples.map((example: string, index: number) => (
                        <div key={index} className="p-4 border rounded-lg bg-card">
                          <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                            <div className="text-center">
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Example placeholder</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">{example}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* RIGHT PANEL - Upload Tracker (20%) */}
        <div className="w-[20%] border-l bg-background flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="h-5 w-5" />
              <h2 className="font-semibold">Upload Tracker</h2>
            </div>
            
            {/* Progress Summary */}
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-primary">{selectedFormat.uploaded}</div>
              <div className="text-sm text-muted-foreground">of {selectedFormat.total} uploaded</div>
              <Progress value={selectedFormat.progress} className="mt-2" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {uploadRequirements.map((requirement) => (
                <div key={requirement.id} className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">{requirement.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{requirement.description}</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                    {requirement.uploaded ? (
                      <div>
                        <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Uploaded</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
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

          <div className="p-4 border-t space-y-2">
            <Button variant="outline" className="w-full">
              Save Draft
            </Button>
            <Button className="w-full">
              Submit ({selectedFormat.uploaded}/{selectedFormat.total})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentLibrary;