import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFormatSubmissions, useFormatProgress } from '@/hooks/useContentFormats';
import { 
  Upload, 
  CheckCircle, 
  Plus,
  FileText,
  Image as ImageIcon,
  Video
} from 'lucide-react';

interface ContentFormat {
  id: string;
  format_key: string;
  title: string;
  description: string;
  format_type: 'photo' | 'video' | 'carousel' | 'story' | 'animated';
  total_required: number;
}

interface UploadPanelProps {
  selectedFormat: ContentFormat;
}

export function UploadPanel({ selectedFormat }: UploadPanelProps) {
  const { data: submissions = [] } = useFormatSubmissions(selectedFormat?.id || '');
  const { data: progress } = useFormatProgress(selectedFormat?.id || '');
  
  if (!selectedFormat) {
    return (
      <Card className="w-full h-full bg-card border shadow-sm flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Select a format to begin uploading</p>
        </CardContent>
      </Card>
    );
  }

  const completed = progress?.completed_count || 0;
  const pending = progress?.pending_count || 0;
  const progressPercent = selectedFormat.total_required > 0 ? Math.round((completed / selectedFormat.total_required) * 100) : 0;

  // Create upload slots based on total_required
  const uploadSlots = Array.from({ length: selectedFormat.total_required }, (_, index) => {
    const submission = submissions[index];
    return {
      id: index + 1,
      title: `${selectedFormat.title} ${index + 1}`,
      description: `Upload requirement ${index + 1} of ${selectedFormat.total_required}`,
      submission: submission || null,
      uploaded: !!submission
    };
  });

  return (
    <Card className="w-full h-full bg-card border shadow-sm flex flex-col">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5" />
            Content Uploads
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="text-center flex-shrink-0">
            <div className="text-2xl font-bold text-primary">{completed}</div>
            <div className="text-sm text-muted-foreground">of {selectedFormat.total_required} uploaded</div>
            <Progress value={progressPercent} className="mt-2" />
            {pending > 0 && (
              <p className="text-xs text-orange-600 mt-1">{pending} pending review</p>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {uploadSlots.map((slot) => (
                <div key={slot.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{slot.title}</h4>
                    {slot.submission && (
                      <Badge variant={
                        slot.submission.status === 'approved' ? 'default' :
                        slot.submission.status === 'pending' ? 'secondary' :
                        slot.submission.status === 'needs_revision' ? 'destructive' :
                        'outline'
                      }>
                        {slot.submission.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{slot.description}</p>
                  
                  {/* Smart Upload Area */}
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 min-h-[120px] bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group">
                    {slot.uploaded && slot.submission ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-2">
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                          {slot.submission.file_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(slot.submission.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                          <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-xs font-medium text-foreground">Upload Files or Drop Here</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedFormat.format_type === 'video' ? 'Videos' : 
                             selectedFormat.format_type === 'photo' ? 'Images' : 
                             'Images or videos'}
                          </p>
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
              Save Draft
            </Button>
            <Button className="w-full" disabled={completed === 0}>
              Submit for Review ({completed}/{selectedFormat.total_required})
            </Button>
          </div>
        </CardContent>
    </Card>
  );
}