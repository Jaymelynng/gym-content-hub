import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CheckCircle, Target, BookOpen, Upload, Plus, FileText, Image as ImageIcon, Camera, Video, Play, Repeat } from 'lucide-react';

interface ContentFormat {
  id: string;
  format_key: string;
  title: string;
  description: string;
  format_type: 'photo' | 'video' | 'carousel' | 'story' | 'animated';
  dimensions: string;
  duration: string;
  total_required: number;
  setup_planning: any;
  production_tips: any;
  examples: any;
}

interface ContentTabsProps {
  selectedFormat: ContentFormat;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const getFormatIcon = (type: string) => {
  switch (type) {
    case 'photo': return <Camera className="h-5 w-5" />;
    case 'video': return <Video className="h-5 w-5" />;
    case 'carousel': return <ImageIcon className="h-5 w-5" />;
    case 'story': return <Play className="h-5 w-5" />;
    case 'animated': return <Repeat className="h-5 w-5" />;
    default: return <Camera className="h-5 w-5" />;
  }
};

const getFormatColors = (type: string) => {
  switch (type) {
    case 'photo': return 'bg-blue-50 dark:bg-blue-900/20';
    case 'video': return 'bg-green-50 dark:bg-green-900/20';
    case 'carousel': return 'bg-purple-50 dark:bg-purple-900/20';
    case 'story': return 'bg-orange-50 dark:bg-orange-900/20';
    case 'animated': return 'bg-pink-50 dark:bg-pink-900/20';
    default: return 'bg-gray-50 dark:bg-gray-900/20';
  }
};

export function ContentTabs({
  selectedFormat,
  activeTab,
  onTabChange
}: ContentTabsProps) {
  if (!selectedFormat) {
    return <div className="flex items-center justify-center h-full">Select a content format to begin</div>;
  }

  const setupSteps = selectedFormat.setup_planning?.steps || [];
  const productionTips = selectedFormat.production_tips?.tips || [];
  const examples = selectedFormat.examples?.examples || [];

  return (
    <Card className="w-full h-full bg-card border shadow-sm flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getFormatColors(selectedFormat.format_type)}`}>
            {getFormatIcon(selectedFormat.format_type)}
          </div>
          <div>
            <CardTitle className="text-xl">{selectedFormat.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{selectedFormat.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
            <TabsTrigger value="production">Production Tips</TabsTrigger>
            <TabsTrigger value="examples">Content Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6 flex-1 overflow-hidden">
            <Card className="border bg-muted/20 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-5 w-5" />
                  Setup & Planning Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {setupSteps.length > 0 ? (
                      setupSteps.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Setup steps will be loaded from the database</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="mt-6 flex-1 overflow-hidden">
            <Card className="border bg-muted/20 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5" />
                  Production Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {productionTips.length > 0 ? (
                      productionTips.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{tip}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Production tips will be loaded from the database</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="mt-6 flex-1 overflow-hidden">
            <Card className="border bg-muted/20 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5" />
                  Content Examples
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                    {examples.length > 0 ? (
                      examples.map((example: string, index: number) => (
                        <div key={index} className="p-4 border rounded-lg bg-background">
                          <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center relative group">
                            {/* Upload Area for Examples */}
                            <div className="absolute inset-0 border-2 border-dashed border-muted rounded-lg bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                              <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                              <div className="text-center">
                                <p className="text-xs font-medium text-foreground">Add Example Content</p>
                                <p className="text-xs text-muted-foreground">Image or text</p>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm font-medium mb-3">{example}</p>
                          
                          {/* Action Buttons for Examples */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 text-xs">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              Add Image
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              Add Text
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        <p className="text-sm">Content examples will be loaded from the database</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}