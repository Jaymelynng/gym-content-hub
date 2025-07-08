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
  TrendingUp
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

  const currentPlan = contentPlans[selectedFormat.id as keyof typeof contentPlans];
  const totalUploaded = contentFormats.reduce((sum, format) => sum + format.uploaded, 0);
  const totalRequired = contentFormats.reduce((sum, format) => sum + format.total, 0);
  const overallProgress = totalRequired > 0 ? (totalUploaded / totalRequired) * 100 : 0;

  return (
    <div className="flex h-screen gap-6 p-6">
      {/* LEFT PANEL - Format Selection */}
      <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
        <div>
          <h2 className="text-xl font-semibold mb-4">Content Formats</h2>
          <div className="space-y-3">
            {contentFormats.map((format) => (
              <Card 
                key={format.id} 
                className={`cursor-pointer transition-all ${
                  selectedFormat.id === format.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:shadow-sm'
                }`}
                onClick={() => setSelectedFormat(format)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${format.bgColor}`}>
                      {format.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{format.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format.type === 'photo' ? '1080x1080' : '1080x1920'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{format.uploaded}/{format.total}</span>
                    </div>
                    <Progress value={format.progress} className="h-2" />
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {format.uploaded} uploaded
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {format.total - format.uploaded} remaining
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Overall Progress Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalUploaded}</div>
                <div className="text-sm text-muted-foreground">of {totalRequired} clips uploaded</div>
                <Progress value={overallProgress} className="mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-muted rounded">
                  <div className="text-lg font-semibold">{overallProgress.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
                <div className="p-2 bg-muted rounded">
                  <div className="text-lg font-semibold">{totalRequired - totalUploaded}</div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* RIGHT PANEL - Upload Tracker */}
      <div className="w-80 flex-shrink-0 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{selectedFormat.uploaded}</div>
              <div className="text-sm text-muted-foreground">of {selectedFormat.total} uploaded</div>
              <Progress value={selectedFormat.progress} className="mt-2" />
            </div>

            <div className="space-y-3">
              {currentPlan.uploads.map((upload, index) => (
                <div key={upload.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{upload.title}</h4>
                    <Badge variant={upload.uploaded ? "default" : "secondary"} className="text-xs">
                      {upload.uploaded ? "Uploaded" : "Required"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{upload.description}</p>
                  <Button 
                    variant={upload.uploaded ? "outline" : "default"} 
                    size="sm" 
                    className="w-full"
                    disabled={upload.uploaded}
                  >
                    <Upload className="h-3 w-3 mr-2" />
                    {upload.uploaded ? "Uploaded" : "Upload File"}
                  </Button>
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

        {/* Upload Progress for All Formats */}
        <Card>
          <CardHeader>
            <CardTitle>All Formats Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentFormats.map((format) => (
                <div key={format.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${format.bgColor}`}>
                      {format.icon}
                    </div>
                    <span className="text-sm">{format.title}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{format.uploaded}/{format.total}</div>
                    <div className="w-16 h-1 bg-muted rounded">
                      <div 
                        className="h-1 bg-primary rounded" 
                        style={{ width: `${format.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ContentLibrary;