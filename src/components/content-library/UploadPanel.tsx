import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  CheckCircle, 
  Plus,
  FileText,
  Image as ImageIcon,
  Video
} from 'lucide-react';

interface UploadItem {
  id: number;
  title: string;
  description: string;
  uploaded: boolean;
}

interface ContentFormat {
  uploaded: number;
  total: number;
  progress: number;
}

interface UploadPanelProps {
  selectedFormat: ContentFormat;
  uploads: UploadItem[];
}

export function UploadPanel({ selectedFormat, uploads }: UploadPanelProps) {
  return (
    <div className="w-72 flex-shrink-0 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Content Uploads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{selectedFormat.uploaded}</div>
            <div className="text-sm text-muted-foreground">of {selectedFormat.total} uploaded</div>
            <Progress value={selectedFormat.progress} className="mt-2" />
          </div>

          <div className="space-y-4">
            {uploads.map((upload, index) => (
              <div key={upload.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{upload.title}</h4>
                  <Badge variant={upload.uploaded ? "default" : "secondary"} className="text-xs">
                    {upload.uploaded ? "Added" : "Required"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{upload.description}</p>
                
                {/* Visual Upload Area */}
                <div className="border-2 border-dashed border-muted rounded-lg p-4 min-h-[120px] bg-muted/20">
                  {upload.uploaded ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <span className="text-xs text-green-600 font-medium">Content Added</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-2 w-full">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start h-7 text-xs"
                        >
                          <FileText className="h-3 w-3 mr-2" />
                          Add Text
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start h-7 text-xs"
                        >
                          <ImageIcon className="h-3 w-3 mr-2" />
                          Upload Image
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start h-7 text-xs"
                        >
                          <Video className="h-3 w-3 mr-2" />
                          Upload Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t space-y-2">
            <Button variant="outline" className="w-full">
              Save Draft
            </Button>
            <Button className="w-full">
              Start Creating
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}