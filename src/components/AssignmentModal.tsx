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
  FileVideo, 
  Camera, 
  Lightbulb,
  CheckCircle,
  MessageCircle,
  Calendar
} from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  due_date: string;
  status: string;
  priority: string;
  clips_required: number;
  clips_uploaded: number;
}

interface AssignmentModalProps {
  assignment: Assignment;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onUploadComplete
}) => {
  const [activeTab, setActiveTab] = useState('setup');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{assignment.title}</DialogTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due {formatDate(assignment.due_date)}
                </div>
                <Badge variant={getPriorityColor(assignment.priority)}>
                  {assignment.priority}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-xl font-bold">
                {assignment.clips_uploaded}/{assignment.clips_required}
              </div>
              <Progress 
                value={(assignment.clips_uploaded / assignment.clips_required) * 100}
                className="w-24 h-2 mt-1"
              />
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup & Planning</TabsTrigger>
            <TabsTrigger value="production">Production Tips</TabsTrigger>
            <TabsTrigger value="examples">Content Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Assignment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Content Requirements</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {assignment.clips_required} clips total</li>
                      <li>• Mixed content types welcome</li>
                      <li>• Focus on authentic moments</li>
                      <li>• Clear audio and good lighting</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Submission Details</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Upload as you create content</li>
                      <li>• Add descriptions for each clip</li>
                      <li>• Review and submit when ready</li>
                      <li>• Feedback provided within 24-48 hours</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Your Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: assignment.clips_required }, (_, i) => (
                    <div key={i} className="space-y-2">
                      <div 
                        className={`
                          aspect-video rounded-lg border-2 border-dashed 
                          flex items-center justify-center
                          ${i < assignment.clips_uploaded 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-muted-foreground/25 hover:border-primary/50'
                          }
                        `}
                      >
                        {i < assignment.clips_uploaded ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Clip {i + 1}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Filming Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">Lighting</h4>
                    <p className="text-sm text-muted-foreground">Natural light works best. Face windows when possible.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Audio</h4>
                    <p className="text-sm text-muted-foreground">Record in quiet spaces. Speak clearly and enthusiastically.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Framing</h4>
                    <p className="text-sm text-muted-foreground">Keep subjects centered. Leave some space around the action.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Content Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium">Class Highlights</h4>
                    <p className="text-sm text-muted-foreground">Capture kids learning new skills and having fun.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Behind the Scenes</h4>
                    <p className="text-sm text-muted-foreground">Show preparation, setup, and candid moments.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Success Stories</h4>
                    <p className="text-sm text-muted-foreground">Feature student achievements and progress.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <FileVideo className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium">Class in Action</h4>
                    <p className="text-xs text-muted-foreground">Students practicing skills</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <FileVideo className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium">Coach Tips</h4>
                    <p className="text-xs text-muted-foreground">Instructional content</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <FileVideo className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium">Fun Moments</h4>
                    <p className="text-xs text-muted-foreground">Candid interactions</p>
                  </div>
                </div>
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
              Comments
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};