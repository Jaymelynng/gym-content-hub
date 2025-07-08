import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentFormat {
  id: string;
  title: string;
  type: string;
  icon: React.ReactNode;
  uploaded: number;
  total: number;
  progress: number;
  bgColor: string;
  borderColor: string;
}

interface FormatSidebarProps {
  contentFormats: ContentFormat[];
  selectedFormat: ContentFormat;
  onFormatSelect: (format: ContentFormat) => void;
  totalUploaded: number;
  totalRequired: number;
  overallProgress: number;
}

export function FormatSidebar({
  contentFormats,
  selectedFormat,
  onFormatSelect,
  totalUploaded,
  totalRequired,
  overallProgress
}: FormatSidebarProps) {
  return (
    <Card className="w-80 flex-shrink-0 h-fit bg-card border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Content Formats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          {contentFormats.map((format) => (
            <div 
              key={format.id} 
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedFormat.id === format.id 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'hover:bg-muted border-transparent'
              }`}
              onClick={() => onFormatSelect(format)}
            >
              <div className="flex items-center gap-2 mb-2">
                {format.icon}
                <span className="font-medium text-sm">{format.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{format.uploaded}/{format.total}</span>
                <div className="w-12 h-1 bg-muted rounded">
                  <div 
                    className="h-1 bg-primary rounded" 
                    style={{ width: `${format.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress Summary */}
        <div className="p-3 bg-muted rounded-lg border">
          <div className="text-center">
            <div className="text-xl font-bold">{totalUploaded}/{totalRequired}</div>
            <div className="text-xs text-muted-foreground mb-2">Total Progress</div>
            <Progress value={overallProgress} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}