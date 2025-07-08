import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Video, 
  Image as ImageIcon, 
  Upload, 
  CheckCircle, 
  Target,
  BookOpen,
  Users,
  Heart,
  TrendingUp,
  FileText,
  Plus,
  ChevronDown
} from 'lucide-react';

// Mock data for specific content ideas
const contentFormats = [
  {
    id: 'photo-post',
    title: 'Photo Post',
    type: 'photo',
    icon: <Camera className="h-5 w-5" />,
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
    icon: <Video className="h-5 w-5" />,
    uploaded: 0,
    total: 4,
    progress: 0,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

const contentPlans = {
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

function ContentLibrary() {
  const [selectedFormat, setSelectedFormat] = useState(contentFormats[0]);
  const [activeTab, setActiveTab] = useState('setup');
  const [showContentOptions, setShowContentOptions] = useState<number | null>(null);

  const currentPlan = contentPlans[selectedFormat.id as keyof typeof contentPlans];
  const totalUploaded = contentFormats.reduce((sum, format) => sum + format.uploaded, 0);
  const totalRequired = contentFormats.reduce((sum, format) => sum + format.total, 0);
  const overallProgress = totalRequired > 0 ? (totalUploaded / totalRequired) * 100 : 0;

  return (
    <div className="flex h-screen gap-4 p-6">
      {/* LEFT PANEL - Simplified Format Selection */}
      <div className="w-48 flex-shrink-0 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Formats</h2>
          <div className="space-y-1">
            {contentFormats.map((format) => (
              <div 
                key={format.id} 
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedFormat.id === format.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'hover:bg-muted border-transparent'
                }`}
                onClick={() => setSelectedFormat(format)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {format.icon}
                  <span className="font-medium text-sm">{format.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{format.uploaded}/{format.total}</span>
                  <div className="w-12 h-1 bg-muted rounded">
                    <div 
                      className="h-1 bg-primary rounded" 
                      style={{ width: `${format.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress Summary */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold">{totalUploaded}/{totalRequired}</div>
            <div className="text-xs text-muted-foreground mb-2">Total Progress</div>
            <Progress value={overallProgress} className="h-1" />
          </div>
        </div>
      </div>

      {/* CENTER PANEL - 3 Tabs */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${selectedFormat.bgColor}`}>
              {selectedFormat.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentPlan.title}</h1>
              <p className="text-muted-foreground">{currentPlan.description}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
            <TabsTrigger value="production">Production Tips</TabsTrigger>
            <TabsTrigger value="examples">Content Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Setup & Planning Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPlan.setupSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Production Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPlan.productionTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Content Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.examples.map((example, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                        {selectedFormat.icon}
                      </div>
                      <p className="text-sm font-medium">{example}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT PANEL - Visual Upload Tracker */}
      <div className="w-72 flex-shrink-0 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Content Uploads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedFormat.uploaded}</div>
              <div className="text-sm text-muted-foreground">of {selectedFormat.total} uploaded</div>
              <Progress value={selectedFormat.progress} className="mt-2" />
            </div>

            <div className="space-y-4">
              {currentPlan.uploads.map((upload, index) => (
                <div key={upload.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{upload.title}</h4>
                    <Badge variant={upload.uploaded ? "default" : "secondary"} className="text-xs">
                      {upload.uploaded ? "Added" : "Required"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{upload.description}</p>
                  
                  {/* Visual Upload Area */}
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 min-h-[120px] bg-muted/20">
                    {upload.uploaded ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <span className="text-xs text-green-600 font-medium">Content Added</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-3">
                          <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-2 w-full">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start h-7 text-xs"
                          >
                            <FileText className="h-3 w-3 mr-2" />
                            Add Text
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start h-7 text-xs"
                          >
                            <ImageIcon className="h-3 w-3 mr-2" />
                            Upload Image
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start h-7 text-xs"
                          >
                            <Video className="h-3 w-3 mr-2" />
                            Upload Video
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button variant="outline" className="w-full">
                Save Draft
              </Button>
              <Button className="w-full">
                Start Creating
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ContentLibrary;