import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Camera,
  Video,
  Image as ImageIcon,
  Play,
  Zap,
  Lightbulb,
  CheckCircle,
  MessageCircle,
  Clock,
  Monitor
} from 'lucide-react';
import { ContentFormat } from '@/hooks/useContentFormats';

interface ContentFormatModalProps {
  format: ContentFormat;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

const formatIcons = {
  photo: Camera,
  video: Video,
  carousel: ImageIcon,
  story: Play,
  animated: Zap,
};

export const ContentFormatModal: React.FC<ContentFormatModalProps> = ({
  format,
  isOpen,
  onClose,
  onUploadComplete
}) => {
  const [activeTab, setActiveTab] = useState('setup');
  
  const IconComponent = formatIcons[format.format_type];
  
  const renderChecklist = (items: string[]) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm">
          <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  const renderDosDonts = (dosDonts: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium text-green-600 mb-2 flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          Do's
        </h4>
        <ul className="space-y-1">
          {dosDonts.dos?.map((item: string, index: number) => (
            <li key={index} className="text-sm text-muted-foreground">• {item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-medium text-red-600 mb-2">Don'ts</h4>
        <ul className="space-y-1">
          {dosDonts.donts?.map((item: string, index: number) => (
            <li key={index} className="text-sm text-muted-foreground">• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{format.title}</DialogTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Monitor className="h-4 w-4" />
                    {format.dimensions}
                  </div>
                  {format.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format.duration}
                    </div>
                  )}
                  <Badge variant="secondary">
                    {format.format_type.charAt(0).toUpperCase() + format.format_type.slice(1)}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">{format.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Required</div>
              <div className="text-2xl font-bold text-primary">
                {format.total_required}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
            <TabsTrigger value="production">Production Tips</TabsTrigger>
            <TabsTrigger value="examples">Examples & Ideas</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {format.setup_planning?.title || 'Setup & Planning'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Planning Checklist</h4>
                    {format.setup_planning?.checklist && renderChecklist(format.setup_planning.checklist)}
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Requirements</h4>
                    {format.setup_planning?.requirements && renderChecklist(format.setup_planning.requirements)}
                  </div>
                </div>
                
                {format.setup_planning?.timeline && (
                  <div>
                    <h4 className="font-medium mb-2">Timeline</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {format.setup_planning.timeline}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Your Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: Math.min(format.total_required, 8) }, (_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex items-center justify-center transition-colors">
                        <Button variant="ghost" size="sm" className="flex-col h-auto py-4">
                          <Upload className="h-6 w-6 mb-2" />
                          <span className="text-xs">Upload {i + 1}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {format.total_required > 8 && (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <span className="text-2xl font-bold">+{format.total_required - 8}</span>
                        <p className="text-xs">more slots</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  {format.production_tips?.title || 'Production Tips'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {format.production_tips?.tips && (
                  <div>
                    <h4 className="font-medium mb-3">Pro Tips</h4>
                    {renderChecklist(format.production_tips.tips)}
                  </div>
                )}

                {format.production_tips?.dosDonts && (
                  <div>
                    <h4 className="font-medium mb-3">Best Practices</h4>
                    {renderDosDonts(format.production_tips.dosDonts)}
                  </div>
                )}

                {format.production_tips?.equipment && (
                  <div>
                    <h4 className="font-medium mb-3">Recommended Equipment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {format.production_tips.equipment.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {format.examples?.title || 'Content Examples'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {format.examples?.descriptions && (
                  <div>
                    <h4 className="font-medium mb-3">Example Ideas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {format.examples.descriptions.map((example: string, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center">
                            <IconComponent className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium">{example}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {format.examples?.commonMistakes && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-3">Common Mistakes to Avoid</h4>
                    <ul className="space-y-2">
                      {format.examples.commonMistakes.map((mistake: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Get Help
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Start Creating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};