import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Target, BookOpen } from 'lucide-react';

interface ContentPlan {
  title: string;
  description: string;
  setupSteps: string[];
  productionTips: string[];
  examples: string[];
}

interface ContentTabsProps {
  currentPlan: ContentPlan;
  selectedFormat: {
    icon: React.ReactNode;
    bgColor: string;
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
    <Card className="w-full h-fit bg-card border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${selectedFormat.bgColor}`}>
            {selectedFormat.icon}
          </div>
          <div>
            <CardTitle className="text-xl">{currentPlan.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
            <TabsTrigger value="production">Production Tips</TabsTrigger>
            <TabsTrigger value="examples">Content Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="mt-6">
            <Card className="border bg-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
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
            <Card className="border bg-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
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
            <Card className="border bg-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5" />
                  Content Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.examples.map((example, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background">
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
      </CardContent>
    </Card>
  );
}