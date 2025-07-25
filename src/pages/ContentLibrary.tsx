import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Image, CheckCircle, Target, BookOpen, Upload, Clock, Layers, Zap } from 'lucide-react';
import { useContentFormats, useFormatProgress, useFormatSubmissions } from '@/hooks/useContentFormats';
import { Skeleton } from '@/components/ui/skeleton';

// Icon mapping for format types
const iconMap = {
  photo: Camera,
  video: Video,
  carousel: Layers,
  story: Clock,
  animated: Zap,
};

const bgColorMap = {
  photo: 'bg-blue-50',
  video: 'bg-green-50',
  carousel: 'bg-purple-50',
  story: 'bg-orange-50',
  animated: 'bg-pink-50',
};

function ContentLibrary() {
  const [selectedFormatId, setSelectedFormatId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('setup');
  const { currentGym } = useAuth();
  
  const { data: contentFormats = [], isLoading } = useContentFormats();
  
  // Set default selected format when data loads
  useEffect(() => {
    if (!selectedFormatId && contentFormats.length > 0) {
      setSelectedFormatId(contentFormats[0].id);
    }
  }, [contentFormats, selectedFormatId]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex-shrink-0 px-6 py-4 border-b bg-background">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          <div className="col-span-2 border-r bg-background p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-3" />
            ))}
          </div>
          <div className="col-span-7 bg-background p-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="col-span-3 border-l bg-background p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentGym) {
    return <div className="p-6">Please log in to access Content Library</div>;
  }

  const selectedFormat = contentFormats.find(f => f.id === selectedFormatId) || contentFormats[0];
  
  if (!selectedFormat) {
    return <div className="p-6">No content formats available</div>;
  }

  // Get current format's content
  const setupPlanning = Array.isArray(selectedFormat.setup_planning) 
    ? selectedFormat.setup_planning 
    : selectedFormat.setup_planning 
      ? [selectedFormat.setup_planning] 
      : ['No setup planning available'];
      
  const productionTips = Array.isArray(selectedFormat.production_tips) 
    ? selectedFormat.production_tips 
    : selectedFormat.production_tips 
      ? [selectedFormat.production_tips] 
      : ['No production tips available'];
      
  const examples = Array.isArray(selectedFormat.examples) 
    ? selectedFormat.examples 
    : selectedFormat.examples 
      ? [selectedFormat.examples] 
      : ['No examples available'];

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
          <LeftPanel 
            contentFormats={contentFormats} 
            selectedFormat={selectedFormat} 
            onFormatSelect={setSelectedFormatId}
          />
        </div>

        {/* CENTER PANEL - Content Tabs (7/12 cols = ~58%) */}
        <div className="col-span-7 bg-background flex flex-col">
          <CenterPanel 
            selectedFormat={selectedFormat}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            setupPlanning={setupPlanning}
            productionTips={productionTips}
            examples={examples}
          />
        </div>

        {/* RIGHT PANEL - Uploader & Notes (3/12 cols = ~25%) */}
        <div className="col-span-3 border-l bg-background flex flex-col">
          <RightPanel selectedFormat={selectedFormat} />
        </div>
      </div>
    </div>
  );
}

function LeftPanel({ contentFormats, selectedFormat, onFormatSelect }: any) {
  // Calculate overall progress from all formats
  const totalUploaded = contentFormats.reduce((sum: number, format: any) => {
    return sum + 0; // Will be updated with real progress
  }, 0);
  
  const totalRequired = contentFormats.reduce((sum: number, format: any) => {
    return sum + (format.total_required || 0);
  }, 0);
  
  const overallProgress = totalRequired > 0 ? Math.round((totalUploaded / totalRequired) * 100) : 0;

  return (
    <>
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
            {contentFormats.map((format: any) => (
              <FormatCard 
                key={format.id} 
                format={format} 
                isSelected={selectedFormat.id === format.id}
                onSelect={() => onFormatSelect(format.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
}

function FormatCard({ format, isSelected, onSelect }: any) {
  const { data: progress } = useFormatProgress(format.id);
  const { data: submissions } = useFormatSubmissions(format.id);
  
  const Icon = iconMap[format.format_type as keyof typeof iconMap] || Camera;
  const bgColor = bgColorMap[format.format_type as keyof typeof bgColorMap] || 'bg-blue-50';
  
  // Use real progress data from database
  const uploaded = progress?.completed_count || 0;
  const total = format.total_required || 0;
  const progressPercentage = total > 0 ? Math.round((uploaded / total) * 100) : 0;
  
  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all border ${
        isSelected 
          ? 'bg-primary/10 border-primary text-primary' 
          : 'hover:bg-muted border-transparent'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded ${bgColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="font-medium text-xs">{format.title}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{uploaded}/{total}</span>
        <div className="w-12 h-1.5 bg-muted rounded-full">
          <div 
            className="h-1.5 bg-primary rounded-full transition-all" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function CenterPanel({ selectedFormat, activeTab, onTabChange, setupPlanning, productionTips, examples }: any) {
  return (
    <>
      {/* Format Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColorMap[selectedFormat.format_type as keyof typeof bgColorMap] || 'bg-blue-50'}`}>
            {(() => {
              const Icon = iconMap[selectedFormat.format_type as keyof typeof iconMap] || Camera;
              return <Icon className="h-5 w-5" />;
            })()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{selectedFormat.title}</h2>
            <p className="text-sm text-muted-foreground">{selectedFormat.description}</p>
            {selectedFormat.dimensions && (
              <p className="text-xs text-muted-foreground mt-1">
                {selectedFormat.dimensions}
                {selectedFormat.duration && ` • ${selectedFormat.duration}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => onTabChange('setup')}
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
            onClick={() => onTabChange('production')}
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
            onClick={() => onTabChange('examples')}
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
                  {setupPlanning.map((step: string, index: number) => (
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
                  {productionTips.map((tip: string, index: number) => (
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
                  {examples.map((example: string, index: number) => (
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
    </>
  );
}

function RightPanel({ selectedFormat }: any) {
  const { data: progress } = useFormatProgress(selectedFormat.id);
  const { data: submissions } = useFormatSubmissions(selectedFormat.id);
  
  // Use real progress data from database
  const uploaded = progress?.completed_count || 0;
  const total = selectedFormat.total_required || 0;
  const progressPercentage = total > 0 ? Math.round((uploaded / total) * 100) : 0;
  
  // Get actual submission requirements from database submissions
  const submissionRequirements = submissions?.slice(0, 4) || [];
  
  return (
    <>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          <CardTitle className="text-lg">Upload Tracker</CardTitle>
        </div>
        
        {/* Progress Summary */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{uploaded}</div>
          <div className="text-sm text-muted-foreground">of {total} uploaded</div>
          <Progress value={progressPercentage} className="mt-2" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {submissionRequirements.length > 0 ? (
              submissionRequirements.map((submission: any) => (
                <div key={submission.id} className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">{submission.file_name}</h4>
                    <p className="text-xs text-muted-foreground">Status: {submission.status}</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-muted rounded-lg p-3 text-center bg-muted/20">
                    {submission.status === 'approved' ? (
                      <div>
                        <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Approved</span>
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
              ))
            ) : (
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No submissions yet</p>
                <p className="text-xs text-muted-foreground">Upload your first file to get started</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <div className="p-4 border-t space-y-2">
        <Button variant="outline" className="w-full text-sm">
          Save Draft
        </Button>
        <Button className="w-full text-sm">
          Submit ({uploaded}/{total})
        </Button>
      </div>
    </>
  );
}

export default ContentLibrary;