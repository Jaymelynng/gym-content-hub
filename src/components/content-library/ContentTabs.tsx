import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Target, 
  BookOpen, 
  Upload, 
  Plus, 
  FileText, 
  Image as ImageIcon,
  AlertTriangle,
  Wrench,
  Calendar,
  Lightbulb,
  XCircle
} from 'lucide-react';

interface ContentPlan {
  title: string;
  description: string;
  setupSteps: string[];
  productionTips: string[];
  examples: string[];
  commonMistakes: string[];
  equipmentList: string[];
  timeline: string[];
}

interface ContentTabsProps {
  currentPlan: ContentPlan;
  selectedFormat: {
    icon: React.ReactNode;
    bgColor: string;
    dimensions: string;
    duration: string;
  };
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ContentTabs({
  currentPlan,
  selectedFormat,
  activeTab,
  onTabChange
}: ContentTabsProps) {
  return (
    <Card className="w-full h-full bg-card border shadow-sm flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${selectedFormat.bgColor}`}>
            {selectedFormat.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{currentPlan.title}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">{currentPlan.description}</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {selectedFormat.dimensions}
              </Badge>
              {selectedFormat.duration !== 'N/A' && (
                <Badge variant="outline" className="text-xs">
                  {selectedFormat.duration}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
            <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
            <TabsTrigger value="production">Production Tips</TabsTrigger>
            <TabsTrigger value="examples">Content Examples</TabsTrigger>
            <TabsTrigger value="mistakes">Common Mistakes</TabsTrigger>
            <TabsTrigger value="equipment">Equipment & Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6 flex-1 overflow-hidden">
            <Card className="border bg-muted/20 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Setup & Planning Steps
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Follow these steps to prepare for successful content creation
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {currentPlan.setupSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="mt-6 flex-1 overflow-hidden">
            <Card className="border bg-muted/20 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-blue-600" />
                  Production Tips & Best Practices
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Expert tips to create high-quality, engaging content
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {currentPlan.productionTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="mt-6 flex-1 overflow-hidden">
            <Card className="border bg-muted/20 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Content Examples & Inspiration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get inspired by these proven content types and formats
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                    {currentPlan.examples.map((example, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-3 flex items-center justify-center relative group">
                          <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                            <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            <div className="text-center">
                              <p className="text-xs font-medium text-foreground">Add Example Content</p>
                              <p className="text-xs text-muted-foreground">Image or text</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm font-medium mb-3 leading-relaxed">{example}</p>
                        
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
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mistakes" className="mt-6 flex-1 overflow-hidden">
            <Card className="border bg-muted/20 h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Common Mistakes to Avoid
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Learn from others' mistakes to create better content
                </p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {currentPlan.commonMistakes.map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-red-200">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{mistake}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="mt-6 flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Equipment List */}
              <Card className="border bg-muted/20 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wrench className="h-5 w-5 text-orange-600" />
                    Equipment & Tools Needed
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Essential items for successful content creation
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {currentPlan.equipmentList.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border bg-muted/20 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    Recommended Timeline
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    5-day plan for organized content creation
                  </p>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {currentPlan.timeline.map((day, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-indigo-700">Day {index + 1}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{day}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}