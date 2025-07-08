import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  format: string;
  files: File[];
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

interface FileUploadZoneProps {
  formatKey: string;
  onUpload: (files: File[]) => void;
  uploadState: UploadedFile;
  accept?: Record<string, string[]>;
  maxFiles?: number;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  formatKey,
  onUpload,
  uploadState,
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
  },
  maxFiles = 10,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: uploadState.status === 'uploading',
  });

  const getStatusIcon = () => {
    switch (uploadState.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'uploading':
        return <Upload className="h-6 w-6 text-blue-500 animate-spin" />;
      default:
        return <Upload className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (uploadState.status) {
      case 'completed':
        return `${uploadState.files.length} file(s) uploaded successfully`;
      case 'error':
        return 'Upload failed. Please try again.';
      case 'uploading':
        return 'Uploading files...';
      default:
        return 'Drag & drop files here, or click to select';
    }
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/5",
          uploadState.status === 'completed' && "border-green-500 bg-green-50",
          uploadState.status === 'error' && "border-red-500 bg-red-50",
          uploadState.status === 'uploading' && "border-blue-500 bg-blue-50"
        )}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {getStatusIcon()}
            <div>
              <p className="text-sm font-medium">{getStatusText()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports images and videos up to 100MB each
              </p>
            </div>
            {uploadState.status === 'pending' && (
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadState.files.length > 0 && (
        <div className="space-y-2">
          {uploadState.files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <File className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadState.status === 'completed' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {uploadState.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {fileRejections.length > 0 && (
        <div className="space-y-2">
          {fileRejections.map(({ file, errors }, index) => (
            <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
              <p className="font-medium">{file.name}:</p>
              <ul className="list-disc list-inside">
                {errors.map((error) => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;