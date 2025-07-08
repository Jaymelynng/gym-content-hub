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
    <Card className="w-full h-fit bg-card border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
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
                
                {/* Smart Upload Area */}
                <div className="border-2 border-dashed border-muted rounded-lg p-4 min-h-[120px] bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group">
                  {upload.uploaded ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-2">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Content Added</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-medium text-foreground">Upload Files or Drop Here</p>
                        <p className="text-xs text-muted-foreground">Images, videos, or text files</p>
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
  );
}