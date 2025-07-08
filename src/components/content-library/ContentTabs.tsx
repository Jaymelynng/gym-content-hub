import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Lightbulb, Camera, Video, Image, Play, Zap } from 'lucide-react';
import { ContentFormat } from '@/hooks/useContentFormats';

interface ContentTabsProps {
  selectedFormat: ContentFormat;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const getFormatIcon = (formatType: string) => {
  switch (formatType) {
    case 'photo':
      return <Camera className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'carousel':
      return <Image className="h-5 w-5" />;
    case 'story':
      return <Play className="h-5 w-5" />;
    case 'animated':
      return <Zap className="h-5 w-5" />;
    default:
      return <Camera className="h-5 w-5" />;
  }
};

export const ContentTabs: React.FC<ContentTabsProps> = ({
  selectedFormat,
  activeTab,
  onTabChange
}) => {
  const { setup_planning, production_tips, examples } = selectedFormat;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {getFormatIcon(selectedFormat.format_type)}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{selectedFormat.title}</h1>
          <p className="text-muted-foreground">{selectedFormat.description}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="outline">{selectedFormat.dimensions}</Badge>
          {selectedFormat.duration && (
            <Badge variant="outline">{selectedFormat.duration}</Badge>
          )}
          <Badge variant="secondary">Target: {selectedFormat.total_required}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Setup & Planning
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Production Tips
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Examples
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto mt-6">
          {/* Setup & Planning Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  {setup_planning.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Checklist */}
                <div>
                  <h3 className="font-semibold mb-3">Planning Checklist</h3>
                  <div className="space-y-2">
                    {setup_planning.checklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {setup_planning.timeline}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Technical Requirements
                  </h3>
                  <div className="space-y-2">
                    {setup_planning.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                        {requirement}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Production Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  {production_tips.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tips */}
                <div>
                  <h3 className="font-semibold mb-3">Best Practices</h3>
                  <div className="space-y-2">
                    {production_tips.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Do's and Don'ts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-700">Do's</h3>
                    <div className="space-y-2">
                      {production_tips.dosDonts.dos.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-red-700">Don'ts</h3>
                    <div className="space-y-2">
                      {production_tips.dosDonts.donts.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <h3 className="font-semibold mb-3">Recommended Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {production_tips.equipment.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  {examples.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Good Examples */}
                <div>
                  <h3 className="font-semibold mb-3 text-green-700">Good Examples</h3>
                  <div className="space-y-2">
                    {examples.descriptions.map((example, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                        <span className="text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                <div>
                  <h3 className="font-semibold mb-3 text-red-700">Common Mistakes to Avoid</h3>
                  <div className="space-y-2">
                    {examples.commonMistakes.map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{mistake}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};