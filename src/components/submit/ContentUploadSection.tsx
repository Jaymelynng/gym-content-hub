import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import FormatProgress from './FormatProgress';

interface ContentFormat {
  format_key: string;
  title: string;
  description: string;
  total_required: number;
}

interface UploadedFile {
  format: string;
  files: File[];
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

interface ContentUploadSectionProps {
  format: ContentFormat;
  uploadState: UploadedFile;
  onFileUpload: (files: File[]) => void;
}

const ContentUploadSection: React.FC<ContentUploadSectionProps> = ({
  format,
  uploadState,
  onFileUpload,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{format.title}</span>
          <div className="flex items-center gap-2">
            {uploadState?.status === 'completed' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <Badge variant="outline">
              {format.total_required} required
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>{format.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUploadZone
          formatKey={format.format_key}
          onUpload={onFileUpload}
          uploadState={uploadState}
        />
        <FormatProgress
          formatKey={format.format_key}
          required={format.total_required}
          uploadState={uploadState}
        />
      </CardContent>
    </Card>
  );
};

export default ContentUploadSection;