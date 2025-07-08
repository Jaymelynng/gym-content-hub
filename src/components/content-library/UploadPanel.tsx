import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  CheckCircle, 
  Plus,
  FileText,
  Image as ImageIcon,
  Video,
  Clock,
  AlertCircle,
  X,
  Eye
} from 'lucide-react';

interface UploadItem {
  id: number;
  title: string;
  description: string;
  uploaded: boolean;
  status?: 'pending' | 'uploading' | 'completed' | 'error';
  fileType?: 'image' | 'video' | 'text';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
}

interface ContentFormat {
  uploaded: number;
  total: number;
  progress: number;
  dimensions: string;
  duration: string;
}

interface UploadPanelProps {
  selectedFormat: ContentFormat;
  uploads: UploadItem[];
}

export function UploadPanel({ selectedFormat, uploads }: UploadPanelProps) {
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, uploadId: number) => {
    e.preventDefault();
    setDragOver(uploadId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, uploadId: number) => {
    e.preventDefault();
    setDragOver(null);
    // Handle file drop logic here
    console.log('Files dropped for upload:', uploadId, e.dataTransfer.files);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'uploading':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Completed</Badge>;
      case 'uploading':
        return <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">Uploading</Badge>;
      case 'error':
        return <Badge variant="default" className="text-xs bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
    }
  };

  const getFileTypeIcon = (fileType?: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full h-full bg-card border shadow-sm flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          Content Uploads
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {selectedFormat.dimensions}
          </Badge>
          {selectedFormat.duration !== 'N/A' && (
            <Badge variant="outline" className="text-xs">
              {selectedFormat.duration}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
        {/* Progress Summary */}
        <div className="text-center flex-shrink-0 p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{selectedFormat.uploaded}</div>
          <div className="text-sm text-muted-foreground">of {selectedFormat.total} uploaded</div>
          <Progress value={selectedFormat.progress} className="mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round(selectedFormat.progress)}% complete
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4">
            {uploads.map((upload, index) => (
              <div key={upload.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{upload.title}</h4>
                    {getStatusIcon(upload.status)}
                  </div>
                  {getStatusBadge(upload.status)}
                </div>
                
                <p className="text-xs text-muted-foreground">{upload.description}</p>
                
                {/* File Info (if uploaded) */}
                {upload.uploaded && upload.fileName && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    {getFileTypeIcon(upload.fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{upload.fileName}</p>
                      {upload.fileSize && (
                        <p className="text-xs text-muted-foreground">{upload.fileSize}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Smart Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 min-h-[120px] transition-all cursor-pointer group ${
                    dragOver === upload.id 
                      ? 'border-primary bg-primary/5' 
                      : upload.uploaded 
                        ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                        : 'border-muted bg-muted/20 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onDragOver={(e) => handleDragOver(e, upload.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, upload.id)}
                >
                  {upload.uploaded ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-2">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Content Added</span>
                      <p className="text-xs text-muted-foreground mt-1">Click to replace</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-medium text-foreground">Upload Files or Drop Here</p>
                        <p className="text-xs text-muted-foreground">Images, videos, or text files</p>
                        <p className="text-xs text-muted-foreground">Supports: JPG, PNG, MP4, MOV</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t space-y-2 flex-shrink-0">
          <Button variant="outline" className="w-full">
            <Clock className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Start Creating
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}