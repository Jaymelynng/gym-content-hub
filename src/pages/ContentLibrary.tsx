import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Video, Image, CheckCircle, Target, BookOpen, Upload } from 'lucide-react';

// Format data
const contentFormats = [
  {
    id: 'static-photo',
    title: 'Static Photo',
    description: 'Single high-quality images',
    icon: Camera,
    uploaded: 3,
    total: 12,
    bgColor: 'bg-blue-100',
    setupSteps: [
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
  {
    id: 'video-reel',
    title: 'Video Reel', 
    description: 'Short-form vertical videos',
    icon: Video,
    uploaded: 1,
    total: 15,
    bgColor: 'bg-green-100',
    setupSteps: [
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
  {
    id: 'carousel-images',
    title: 'Carousel Images',
    description: 'Multi-image posts',
    icon: Image,
    uploaded: 0,
    total: 8,
    bgColor: 'bg-purple-100',
    setupSteps: [
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
];

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

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* LEFT PANEL - Format Selection (20%) */}
      <div className="w-1/5 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Content Formats</h2>
          
          {/* Overall Progress */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-center">
              <div className="text-xl font-bold">{totalUploaded}/{totalRequired}</div>
              <div className="text-xs text-gray-600 mb-2">Total Progress</div>
              <Progress value={overallProgress} className="h-2 mb-1" />
              <div className="text-xs font-medium">{overallProgress}% Complete</div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {contentFormats.map((format) => {
              const Icon = format.icon;
              const progress = format.total > 0 ? Math.round((format.uploaded / format.total) * 100) : 0;
              const isSelected = selectedFormat.id === format.id;
              
              return (
                <div 
                  key={format.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => setSelectedFormatId(format.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded ${format.bgColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{format.title}</div>
                      <div className="text-xs text-gray-600">{format.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{format.uploaded}/{format.total}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* CENTER PANEL - Content Tabs (60%) */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${selectedFormat.bgColor}`}>
              <selectedFormat.icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{selectedFormat.title}</h1>
              <p className="text-gray-600">{selectedFormat.description}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'setup', label: 'Setup & Planning', icon: CheckCircle },
              { id: 'production', label: 'Production Tips', icon: Target },
              { id: 'examples', label: 'Content Examples', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600 bg-blue-50' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {activeTab === 'setup' && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <h3 className="text-xl font-semibold">Setup & Planning Steps</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedFormat.setupSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'production' && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="h-5 w-5 text-green-500" />
                    <h3 className="text-xl font-semibold">Production Tips</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedFormat.productionTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <h3 className="text-xl font-semibold">Content Examples</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedFormat.examples.map((example, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* RIGHT PANEL - Upload Tracker (20%) */}
      <div className="w-1/5 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5" />
            <h2 className="font-semibold">Upload Tracker</h2>
          </div>
          
          {/* Progress Summary */}
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-blue-600">{selectedFormat.uploaded}</div>
            <div className="text-sm text-gray-600">of {selectedFormat.total} uploaded</div>
            <Progress value={(selectedFormat.uploaded / selectedFormat.total) * 100} className="mt-2" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {uploadRequirements.map((requirement) => (
              <div key={requirement.id} className="space-y-2">
                <div>
                  <h4 className="font-medium text-sm">{requirement.title}</h4>
                  <p className="text-xs text-gray-600">{requirement.description}</p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                  {requirement.uploaded ? (
                    <div>
                      <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <div className="text-xs">
                        <p className="font-medium">Upload Files</p>
                        <p className="text-gray-500">or drop here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          <Button variant="outline" className="w-full">Save Draft</Button>
          <Button className="w-full">Submit ({selectedFormat.uploaded}/{selectedFormat.total})</Button>
        </div>
      </div>
    </div>
  );
}

export default ContentLibrary;