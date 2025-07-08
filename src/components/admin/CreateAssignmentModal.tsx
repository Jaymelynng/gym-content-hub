import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Upload, Play, Video, Camera, Calendar, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ContentRequirement {
  id: string;
  title: string;
  description: string;
  duration?: string;
  type: string;
}

interface GymProfile {
  id: string;
  gym_name: string;
  gym_location: string;
}

interface CreateAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONTENT_FORMATS = [
  { value: 'static-photo', label: 'Static Photo (Single image)', icon: Camera },
  { value: 'carousel-images', label: 'Carousel Images (Multi-photo post, 2-10 images)', icon: Camera },
  { value: 'animated-image', label: 'Animated Image (GIF/Motion photo)', icon: Camera },
  { value: 'video-reel', label: 'Video/Reel (Vertical format)', icon: Video },
  { value: 'story', label: 'Story (Short-form content)', icon: Video }
];

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
  const [contentType, setContentType] = useState('');
  const [contentRequirements, setContentRequirements] = useState<ContentRequirement[]>([]);
  const [fileRequirements, setFileRequirements] = useState('High-quality files. Video: MP4/MOV, max 100MB. Images: JPG/PNG, max 25MB.');
  const [dueDate, setDueDate] = useState('');
  const [selectedGyms, setSelectedGyms] = useState<string[]>([]);
  const [gymProfiles, setGymProfiles] = useState<GymProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load gym profiles for assignment
  useEffect(() => {
    const loadGyms = async () => {
      try {
        const { data, error } = await supabase
          .from('gym_profiles')
          .select('id, gym_name, gym_location')
          .eq('active', true)
          .order('gym_name');

        if (error) throw error;
        setGymProfiles(data || []);
      } catch (error) {
        console.error('Error loading gyms:', error);
      }
    };

    if (open) {
      loadGyms();
    }
  }, [open]);

  const selectedFormat = CONTENT_FORMATS.find(f => f.value === contentType);

  const addContentRequirement = () => {
    if (!contentType) {
      toast({
        title: "Select Content Type",
        description: "Please select a content format first.",
        variant: "destructive",
      });
      return;
    }

    const newRequirement: ContentRequirement = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${selectedFormat?.label.split(' ')[0]} ${contentRequirements.length + 1}`,
      description: 'Describe the content needed...',
      duration: contentType.includes('video') || contentType === 'story' ? '5-15 seconds' : undefined,
      type: contentType
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

  const toggleGymSelection = (gymId: string) => {
    setSelectedGyms(prev => 
      prev.includes(gymId) 
        ? prev.filter(id => id !== gymId)
        : [...prev, gymId]
    );
  };

  const selectAllGyms = () => {
    setSelectedGyms(gymProfiles.map(gym => gym.id));
  };

  const deselectAllGyms = () => {
    setSelectedGyms([]);
  };

  const handleCreateAssignment = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter an assignment title.",
        variant: "destructive",
      });
      return;
    }

    if (!contentType) {
      toast({
        title: "Content Type Required",
        description: "Please select a content format.",
        variant: "destructive",
      });
      return;
    }

    if (selectedGyms.length === 0) {
      toast({
        title: "Select Gyms",
        description: "Please select at least one gym to assign this to.",
        variant: "destructive",
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Due Date Required",
        description: "Please set a due date for this assignment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create assignments for each selected gym
      const assignments = selectedGyms.map(gymId => ({
        assigned_by_admin: currentGym?.id || '',
        assigned_to_gym_id: gymId,
        custom_title: title,
        custom_description: description,
        due_date: dueDate,
        content_requirements: JSON.stringify({
          format: contentType,
          requirements: contentRequirements,
          setup_planning: setupPlanning,
          production_tips: productionTips,
          file_requirements: fileRequirements
        }) as any,
        assignment_type: contentType,
        status: 'assigned'
      }));

      const { error } = await supabase
        .from('assignment_distributions')
        .insert(assignments);

      if (error) throw error;

      toast({
        title: "Assignment Created",
        description: `Successfully assigned to ${selectedGyms.length} gym(s).`,
      });

      // Reset form
      resetForm();
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment.",
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
    setContentType('');
    setContentRequirements([]);
    setFileRequirements('High-quality files. Video: MP4/MOV, max 100MB. Images: JPG/PNG, max 25MB.');
    setDueDate('');
    setSelectedGyms([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assignment Title (e.g., Cartwheel Confidence Transfer)"
                className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus:ring-0"
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Left Panel - Content Type & Assignment Settings */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            {/* Content Format Selection */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary">Content Format</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          <format.icon className="h-4 w-4" />
                          <span className="text-sm">{format.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Due Date */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary">Due Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gym Assignment */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary">Assign to Gyms</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={selectAllGyms} className="text-xs">
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={deselectAllGyms} className="text-xs">
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                {gymProfiles.map((gym) => (
                  <div key={gym.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={gym.id}
                      checked={selectedGyms.includes(gym.id)}
                      onCheckedChange={() => toggleGymSelection(gym.id)}
                    />
                    <label htmlFor={gym.id} className="text-sm flex-1 cursor-pointer">
                      <div className="font-medium">{gym.gym_name}</div>
                      <div className="text-xs text-muted-foreground">{gym.gym_location}</div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assignment Progress */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Selected Gyms: {selectedGyms.length}</span>
                    <span>Requirements: {contentRequirements.length}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ready to assign: {title && contentType && selectedGyms.length > 0 && dueDate ? 'Yes' : 'No'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Three Tab System */}
          <div className="col-span-6 overflow-hidden">
            <Tabs defaultValue="setup" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="setup" className="font-medium">Setup & Planning</TabsTrigger>
                <TabsTrigger value="tips" className="font-medium">Production Tips</TabsTrigger>
                <TabsTrigger value="examples" className="font-medium">Content Examples</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="setup" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold">🎯 Post Visual</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter the post visual description with emojis and formatting..."
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setup" className="text-sm font-semibold">Setup & Planning Strategy</Label>
                    <Textarea
                      id="setup"
                      value={setupPlanning}
                      onChange={(e) => setSetupPlanning(e.target.value)}
                      placeholder="1. First step of content planning...&#10;2. Second step...&#10;3. Third step..."
                      className="min-h-[200px] mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="tips" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="tips" className="text-sm font-semibold">📌 Content Notes</Label>
                    <Textarea
                      id="tips"
                      value={productionTips}
                      onChange={(e) => setProductionTips(e.target.value)}
                      placeholder="Enter detailed production tips, instructions, and guidelines..."
                      className="min-h-[300px] mt-2"
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
              <h3 className="font-semibold text-primary">Upload Requirements</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={addContentRequirement}
                disabled={!contentType}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {contentRequirements.map((req, index) => (
                <Card key={req.id} className="relative border-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
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
                        placeholder="Duration (e.g., 5-15 seconds)"
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
                      Upload Preview
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* File Requirements */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-primary">File Requirements</CardTitle>
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
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={resetForm} className="font-medium">
              Reset Form
            </Button>
            <div className="text-sm text-muted-foreground">
              <Building2 className="inline h-4 w-4 mr-1" />
              {selectedGyms.length} gym(s) selected
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="font-medium">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAssignment} 
              disabled={isLoading || !title || !contentType || selectedGyms.length === 0 || !dueDate}
              className="font-medium"
            >
              {isLoading ? 'Creating...' : `Assign to ${selectedGyms.length} Gym(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentModal;