import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <Card className="w-full h-full bg-card border shadow-sm flex flex-col">
      <CardHeader className="pb-6 flex-shrink-0">
        <CardTitle className="text-lg">Content Formats</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-6 overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-4">
            {contentFormats.map((format) => (
              <div 
                key={format.id} 
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  selectedFormat.id === format.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'hover:bg-muted border-transparent'
                }`}
                onClick={() => onFormatSelect(format)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 rounded-md bg-background">
                    {format.icon}
                  </div>
                  <span className="font-medium text-sm">{format.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{format.uploaded}/{format.total}</span>
                  <div className="w-16 h-1.5 bg-muted rounded-full">
                    <div 
                      className="h-1.5 bg-primary rounded-full transition-all" 
                      style={{ width: `${format.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Overall Progress Summary */}
        <div className="p-4 bg-muted rounded-lg border flex-shrink-0">
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold">{totalUploaded}/{totalRequired}</div>
            <div className="text-xs text-muted-foreground">Total Progress</div>
            <Progress value={overallProgress} className="h-2" />
            <div className="text-xs font-medium">{Math.round(overallProgress)}% Complete</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}