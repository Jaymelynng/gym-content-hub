import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Upload, Play, Video, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ContentRequirement {
  id: string;
  title: string;
  description: string;
  duration?: string;
  type: 'photo' | 'video' | 'reel';
}

interface CreateAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { currentGym } = useAuth();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [setupPlanning, setSetupPlanning] = useState('');
  const [productionTips, setProductionTips] = useState('');
  const [contentType, setContentType] = useState<'photo' | 'video'>('video');
  const [contentRequirements, setContentRequirements] = useState<ContentRequirement[]>([]);
  const [fileRequirements, setFileRequirements] = useState('MP4, MOV files accepted. Maximum 100MB per file.');
  const [isLoading, setIsLoading] = useState(false);

  const addContentRequirement = () => {
    const newRequirement: ContentRequirement = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${contentType === 'photo' ? 'Photo' : 'Video'} ${contentRequirements.length + 1}`,
      description: 'Describe the content needed...',
      duration: contentType === 'video' ? '5-8 seconds' : undefined,
      type: contentType === 'photo' ? 'photo' : (contentType === 'video' ? 'reel' : 'video')
    };
    setContentRequirements([...contentRequirements, newRequirement]);
  };

  const removeContentRequirement = (id: string) => {
    setContentRequirements(contentRequirements.filter(req => req.id !== id));
  };

  const updateContentRequirement = (id: string, field: keyof ContentRequirement, value: string) => {
    setContentRequirements(contentRequirements.map(req => 
      req.id === id ? { ...req, [field]: value } : req
    ));
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter an assignment title.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('assignment_drafts')
        .insert({
          title,
          description,
          setup_planning: setupPlanning,
          production_tips: productionTips,
          content_requirements: JSON.stringify(contentRequirements) as any,
          file_requirements: fileRequirements,
          created_by_admin: currentGym?.id || null,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Draft Saved",
        description: "Assignment draft has been saved successfully.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setSetupPlanning('');
      setProductionTips('');
      setContentRequirements([]);
      onOpenChange(false);

    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save assignment draft.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSetupPlanning('');
    setProductionTips('');
    setContentRequirements([]);
    setFileRequirements('MP4, MOV files accepted. Maximum 100MB per file.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assignment Title (e.g., Cartwheel Confidence Transfer)"
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Left Panel - Content Type Selection */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Content Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={contentType === 'photo' ? 'default' : 'outline'}
                  onClick={() => setContentType('photo')}
                  className="w-full justify-start"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Photo Post
                </Button>
                <Button
                  variant={contentType === 'video' ? 'default' : 'outline'}
                  onClick={() => setContentType('video')}
                  className="w-full justify-start"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video Reel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Content Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{contentRequirements.length}/4 clips uploaded</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(contentRequirements.length / 4) * 100}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {Math.round((contentRequirements.length / 4) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Three Tab System */}
          <div className="col-span-6 overflow-hidden">
            <Tabs defaultValue="setup" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
                <TabsTrigger value="tips">Production Tips</TabsTrigger>
                <TabsTrigger value="examples">Content Examples</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="setup" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="description">🎯 Post Visual</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter the post visual description with emojis and formatting..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setup">Setup & Planning Strategy</Label>
                    <Textarea
                      id="setup"
                      value={setupPlanning}
                      onChange={(e) => setSetupPlanning(e.target.value)}
                      placeholder="1. First step of content planning...&#10;2. Second step...&#10;3. Third step..."
                      className="min-h-[200px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="tips" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="tips">📌 Content Notes</Label>
                    <Textarea
                      id="tips"
                      value={productionTips}
                      onChange={(e) => setProductionTips(e.target.value)}
                      placeholder="Enter detailed production tips, instructions, and guidelines..."
                      className="min-h-[300px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="space-y-4 mt-4">
                  <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">Upload Examples</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add example images or videos to guide content creation
                    </p>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Example
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - Upload Requirements */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Upload Requirements</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={addContentRequirement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {contentRequirements.map((req, index) => (
                <Card key={req.id} className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeContentRequirement(req.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <CardContent className="p-3 space-y-2">
                    <Input
                      value={req.title}
                      onChange={(e) => updateContentRequirement(req.id, 'title', e.target.value)}
                      className="font-medium text-sm h-8"
                    />
                    {req.duration && (
                      <Input
                        value={req.duration}
                        onChange={(e) => updateContentRequirement(req.id, 'duration', e.target.value)}
                        placeholder="Duration (e.g., 5-8 seconds)"
                        className="text-xs h-7"
                      />
                    )}
                    <Textarea
                      value={req.description}
                      onChange={(e) => updateContentRequirement(req.id, 'description', e.target.value)}
                      placeholder="Describe what's needed..."
                      className="text-xs min-h-[60px] resize-none"
                    />
                    <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Upload Clip
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* File Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">File Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={fileRequirements}
                  onChange={(e) => setFileRequirements(e.target.value)}
                  className="text-xs min-h-[60px] resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
            <span className="text-sm text-muted-foreground">
              {contentRequirements.length}/4 requirements
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close Guide
            </Button>
            <Button onClick={handleSaveDraft} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button variant="default" disabled={contentRequirements.length === 0}>
              Start Creating ({contentRequirements.length}/4)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentModal;