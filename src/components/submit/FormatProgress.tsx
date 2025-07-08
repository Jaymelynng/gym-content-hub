import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Upload, AlertCircle, Clock } from 'lucide-react';

interface UploadedFile {
  format: string;
  files: File[];
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

interface FormatProgressProps {
  formatKey: string;
  required: number;
  uploadState: UploadedFile;
}

const FormatProgress: React.FC<FormatProgressProps> = ({
  formatKey,
  required,
  uploadState,
}) => {
  const uploaded = uploadState.files.length;
  const progressPercentage = required > 0 ? (uploaded / required) * 100 : 0;

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <Upload className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (uploaded >= required && uploadState.status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
    }
    if (uploadState.status === 'error') {
      return <Badge variant="destructive">Error</Badge>;
    }
    if (uploadState.status === 'uploading') {
      return <Badge className="bg-blue-100 text-blue-800">Uploading</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {uploaded} of {required} files uploaded
          </span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {uploadState.status === 'uploading' && (
        <div className="text-xs text-muted-foreground">
          Uploading files... Please wait.
        </div>
      )}

      {uploadState.status === 'error' && (
        <div className="text-xs text-red-600">
          Upload failed. Please try uploading again.
        </div>
      )}

      {uploaded >= required && uploadState.status === 'completed' && (
        <div className="text-xs text-green-600">
          All required files uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default FormatProgress;