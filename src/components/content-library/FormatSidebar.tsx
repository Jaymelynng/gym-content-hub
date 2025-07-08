import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFormatProgress } from '@/hooks/useContentFormats';
import { Camera, Video, Image, Play, Repeat } from 'lucide-react';

interface ContentFormat {
  id: string;
  format_key: string;
  title: string;
  description: string;
  format_type: 'photo' | 'video' | 'carousel' | 'story' | 'animated';
  total_required: number;
}

interface FormatSidebarProps {
  contentFormats: ContentFormat[];
  selectedFormat: ContentFormat;
  onFormatSelect: (format: ContentFormat) => void;
}

const getFormatIcon = (type: string) => {
  switch (type) {
    case 'photo': return <Camera className="h-4 w-4" />;
    case 'video': return <Video className="h-4 w-4" />;
    case 'carousel': return <Image className="h-4 w-4" />;
    case 'story': return <Play className="h-4 w-4" />;
    case 'animated': return <Repeat className="h-4 w-4" />;
    default: return <Camera className="h-4 w-4" />;
  }
};

const getFormatColors = (type: string) => {
  switch (type) {
    case 'photo': return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' };
    case 'video': return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
    case 'carousel': return { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' };
    case 'story': return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' };
    case 'animated': return { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800' };
    default: return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-800' };
  }
};

interface FormatProgressItemProps {
  format: ContentFormat;
  isSelected: boolean;
  onSelect: () => void;
}

function FormatProgressItem({ format, isSelected, onSelect }: FormatProgressItemProps) {
  const { data: progress } = useFormatProgress(format.id);
  const completed = progress?.completed_count || 0;
  const progressPercent = format.total_required > 0 ? Math.round((completed / format.total_required) * 100) : 0;
  const colors = getFormatColors(format.format_type);

  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer transition-all border ${
        isSelected 
          ? 'bg-primary/10 border-primary text-primary' 
          : 'hover:bg-muted border-transparent'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-1.5 rounded-md ${colors.bg}`}>
          {getFormatIcon(format.format_type)}
        </div>
        <span className="font-medium text-sm">{format.title}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{completed}/{format.total_required}</span>
        <div className="w-16 h-1.5 bg-muted rounded-full">
          <div 
            className="h-1.5 bg-primary rounded-full transition-all" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function FormatSidebar({
  contentFormats,
  selectedFormat,
  onFormatSelect
}: FormatSidebarProps) {
  // Calculate overall progress
  const totalRequired = contentFormats.reduce((sum, format) => sum + format.total_required, 0);
  const [totalCompleted, setTotalCompleted] = React.useState(0);
  const [overallProgress, setOverallProgress] = React.useState(0);

  React.useEffect(() => {
    // Calculate total completed across all formats
    let completed = 0;
    Promise.all(
      contentFormats.map(async (format) => {
        const { data: progress } = await useFormatProgress(format.id);
        return progress?.completed_count || 0;
      })
    ).then((completedCounts) => {
      const total = completedCounts.reduce((sum, count) => sum + count, 0);
      setTotalCompleted(total);
      setOverallProgress(totalRequired > 0 ? Math.round((total / totalRequired) * 100) : 0);
    });
  }, [contentFormats, totalRequired]);

  return (
    <Card className="w-full h-full bg-card border shadow-sm flex flex-col">
      <CardHeader className="pb-6 flex-shrink-0">
        <CardTitle className="text-lg">Content Formats</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-6 overflow-hidden">
        {/* Overall Progress Summary */}
        <div className="p-4 bg-muted rounded-lg border flex-shrink-0">
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold">{totalCompleted}/{totalRequired}</div>
            <div className="text-xs text-muted-foreground">Total Progress</div>
            <Progress value={overallProgress} className="h-2" />
            <div className="text-xs font-medium">{overallProgress}% Complete</div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-4">
                                                      {contentFormats.map((format) => (
                <div key={format.id}>
                  <FormatProgressItem
                    format={format}
                    isSelected={selectedFormat?.id === format.id}
                    onSelect={() => onFormatSelect(format)}
                  />
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
