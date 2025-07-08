import React, { useState } from 'react';
import { FormatSidebar } from '@/components/content-library/FormatSidebar';
import { ContentTabs } from '@/components/content-library/ContentTabs';
import { UploadPanel } from '@/components/content-library/UploadPanel';
import { useContentFormats } from '@/hooks/useContentFormats';
import { useProgressSummary } from '@/hooks/useFormatProgress';
import { ContentFormat } from '@/hooks/useContentFormats';

function ContentLibrary() {
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat | null>(null);
  const [activeTab, setActiveTab] = useState('setup');

  const { data: contentFormats, isLoading: formatsLoading, error: formatsError } = useContentFormats();
  const { summary, isLoading: progressLoading } = useProgressSummary();

  // Set default selected format when data loads
  React.useEffect(() => {
    if (contentFormats && contentFormats.length > 0 && !selectedFormat) {
      setSelectedFormat(contentFormats[0]);
    }
  }, [contentFormats, selectedFormat]);

  if (formatsLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content library...</p>
        </div>
      </div>
    );
  }

  if (formatsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading content formats</p>
          <p className="text-muted-foreground">{formatsError.message}</p>
        </div>
      </div>
    );
  }

  if (!contentFormats || contentFormats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">No content formats available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 bg-muted/20" style={{ height: 'calc(100vh - 3rem)' }}>
      {/* Left Panel - Format Selection (20%) */}
      <div className="w-[20%] flex-shrink-0 h-full">
        <FormatSidebar
          contentFormats={contentFormats}
          selectedFormat={selectedFormat}
          onFormatSelect={setSelectedFormat}
          progressSummary={summary}
        />
      </div>

      {/* Center Panel - Main Workspace (55%) */}
      <div className="w-[55%] flex-shrink-0 h-full">
        {selectedFormat && (
          <ContentTabs
            selectedFormat={selectedFormat}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>

      {/* Right Panel - Upload Tracker (25%) */}
      <div className="w-[25%] flex-shrink-0 h-full">
        {selectedFormat && (
          <UploadPanel
            selectedFormat={selectedFormat}
            progressSummary={summary}
          />
        )}
      </div>
    </div>
  );
}

export default ContentLibrary;