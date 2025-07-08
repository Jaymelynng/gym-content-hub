import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Video, Image as ImageIcon, Zap, Play, Upload, Clock } from 'lucide-react';
import { ContentFormatModal } from '@/components/ContentFormatModal';
import { useContentFormats } from '@/hooks/useContentFormats';

const formatIcons = {
  photo: Camera,
  video: Video,
  carousel: ImageIcon,
  story: Play,
  animated: Zap,
};

const formatThumbnails = {
  'static-photo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'carousel-images': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
  'video-reel': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop',
  'story': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'animated-image': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
};

function ContentLibrary() {
  const [selectedFormat, setSelectedFormat] = useState<any>(null);
  const { data: formats, isLoading } = useContentFormats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading content formats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
        <p className="text-muted-foreground">
          Create professional social media content with our guided format library
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formats?.map((format) => {
          const IconComponent = formatIcons[format.format_type];
          const thumbnail = formatThumbnails[format.format_key as keyof typeof formatThumbnails];
          
          return (
            <Card key={format.id} className="cursor-pointer hover:shadow-lg transition-all group overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img 
                  src={thumbnail}
                  alt={format.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="h-4 w-4" />
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
                      {format.format_type.charAt(0).toUpperCase() + format.format_type.slice(1)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{format.title}</h3>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {format.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format.dimensions}
                    </span>
                    {format.duration && (
                      <span>{format.duration}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{format.total_required}</span>
                      <span className="text-muted-foreground"> required</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => setSelectedFormat(format)}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Create
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedFormat && (
        <ContentFormatModal
          format={selectedFormat}
          isOpen={!!selectedFormat}
          onClose={() => setSelectedFormat(null)}
          onUploadComplete={() => {
            setSelectedFormat(null);
          }}
        />
      )}
    </div>
  );
}

export default ContentLibrary;