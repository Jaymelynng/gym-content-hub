import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, File, X, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ContentFormat } from '@/hooks/useContentFormats';
import { ProgressSummary } from '@/hooks/useFormatProgress';
import { useFormatSubmissions, useUploadSubmission } from '@/hooks/useFormatSubmissions';
import { cn } from '@/lib/utils';

interface UploadPanelProps {
  selectedFormat: ContentFormat;
  progressSummary: ProgressSummary;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'needs_revision':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case 'rejected':
      return <X className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'pending':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'needs_revision':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'rejected':
      return 'bg-red-50 border-red-200 text-red-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export const UploadPanel: React.FC<UploadPanelProps> = ({
  selectedFormat,
  progressSummary
}) => {
  const [uploading, setUploading] = useState(false);
  const { data: submissions, isLoading } = useFormatSubmissions(selectedFormat.id);
  const uploadMutation = useUploadSubmission();

  const progress = progressSummary.formatProgress[selectedFormat.id];
  const completed = progress?.completed_count || 0;
  const pending = progress?.pending_count || 0;
  const revisions = progress?.revision_count || 0;
  const total = completed + pending + revisions;
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        await uploadMutation.mutateAsync({
          formatId: selectedFormat.id,
          file,
          fileName: file.name.replace(/\.[^/.]+$/, '') // Remove extension
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [selectedFormat.id, uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true
  });

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Upload Tracker</h2>
        <p className="text-sm text-muted-foreground">
          Upload and track your content submissions
        </p>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Format Progress</span>
              <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completed} approved</span>
              <span>{pending} pending</span>
              <span>{revisions} revisions</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Target: {selectedFormat.total_required} submissions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-rose-500 bg-rose-50'
                : 'border-muted-foreground/25 hover:border-rose-500/50 hover:bg-rose-50/50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-sm font-medium text-rose-600">Drop files here...</p>
            ) : (
              <div>
                <p className="text-sm font-medium mb-1">Drag & drop files here</p>
                <p className="text-xs text-muted-foreground mb-3">
                  or click to select files
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Accepted: JPG, PNG, GIF, MP4, MOV</p>
                  <p>Max size: 100MB per file</p>
                </div>
              </div>
            )}
          </div>
          {uploading && (
            <div className="mt-3 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500 mx-auto mb-2"></div>
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading submissions...</p>
            </div>
          ) : submissions && submissions.length > 0 ? (
            <ScrollArea className="h-64">
              <div className="space-y-2 p-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={cn(
                      'p-3 rounded-lg border flex items-center gap-3',
                      getStatusColor(submission.status)
                    )}
                  >
                    <div className="flex-shrink-0">
                      {getStatusIcon(submission.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {submission.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                      {submission.feedback_notes && (
                        <p className="text-xs mt-1 line-clamp-2">
                          {submission.feedback_notes}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {submission.file_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-4 text-center">
              <File className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No submissions yet</p>
              <p className="text-xs text-muted-foreground">
                Upload your first piece of content
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};