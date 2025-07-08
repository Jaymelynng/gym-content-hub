import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Image, Play, Zap } from 'lucide-react';
import { ContentFormat } from '@/hooks/useContentFormats';
import { ProgressSummary } from '@/hooks/useFormatProgress';
import { cn } from '@/lib/utils';

interface FormatSidebarProps {
  contentFormats: ContentFormat[];
  selectedFormat: ContentFormat | null;
  onFormatSelect: (format: ContentFormat) => void;
  progressSummary: ProgressSummary;
}

const getFormatIcon = (formatType: string) => {
  switch (formatType) {
    case 'photo':
      return <Camera className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'carousel':
      return <Image className="h-5 w-5" />;
    case 'story':
      return <Play className="h-5 w-5" />;
    case 'animated':
      return <Zap className="h-5 w-5" />;
    default:
      return <Camera className="h-5 w-5" />;
  }
};

const getFormatColor = (formatType: string) => {
  switch (formatType) {
    case 'photo':
      return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
    case 'video':
      return 'border-green-200 bg-green-50 hover:bg-green-100';
    case 'carousel':
      return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
    case 'story':
      return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
    case 'animated':
      return 'border-pink-200 bg-pink-50 hover:bg-pink-100';
    default:
      return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
  }
};

export const FormatSidebar: React.FC<FormatSidebarProps> = ({
  contentFormats,
  selectedFormat,
  onFormatSelect,
  progressSummary
}) => {
  const totalCompleted = progressSummary.totalCompleted;
  const totalPending = progressSummary.totalPending;
  const totalRevisions = progressSummary.totalRevisions;
  const totalSubmissions = totalCompleted + totalPending + totalRevisions;
  const overallProgress = totalSubmissions > 0 
    ? Math.round((totalCompleted / totalSubmissions) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Content Formats</h2>
        <p className="text-sm text-muted-foreground">
          Select a format to view planning guides and upload content
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{totalCompleted} completed</span>
              <span>{totalPending} pending</span>
              <span>{totalRevisions} revisions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format List */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {contentFormats.map((format) => {
          const progress = progressSummary.formatProgress[format.id];
          const completed = progress?.completed_count || 0;
          const pending = progress?.pending_count || 0;
          const revisions = progress?.revision_count || 0;
          const total = completed + pending + revisions;
          const formatProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isSelected = selectedFormat?.id === format.id;

          return (
            <Card
              key={format.id}
              className={cn(
                'cursor-pointer transition-all duration-200 border-2',
                getFormatColor(format.format_type),
                isSelected && 'ring-2 ring-rose-500 ring-offset-2'
              )}
              onClick={() => onFormatSelect(format)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Format Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFormatIcon(format.format_type)}
                      <span className="font-medium text-sm">{format.title}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {format.total_required}
                    </Badge>
                  </div>

                  {/* Format Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {format.description}
                  </p>

                  {/* Format Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium">{formatProgress}%</span>
                    </div>
                    <Progress value={formatProgress} className="h-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{completed} ✓</span>
                      <span>{pending} ⏳</span>
                      <span>{revisions} 🔄</span>
                    </div>
                  </div>

                  {/* Format Specs */}
                  <div className="text-xs text-muted-foreground">
                    <div>{format.dimensions}</div>
                    {format.duration && <div>{format.duration}</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
