import React, { useState } from 'react';
import { FormatSidebar } from '@/components/content-library/FormatSidebar';
import { ContentTabs } from '@/components/content-library/ContentTabs';
import { UploadPanel } from '@/components/content-library/UploadPanel';
import { useContentFormats } from '@/hooks/useContentFormats';
import { useAuth } from '@/contexts/AuthContext';

function ContentLibrary() {
  const [selectedFormatId, setSelectedFormatId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('setup');
  const { currentGym } = useAuth();
  
  const { data: contentFormats = [], isLoading } = useContentFormats();
  
  // Set default selected format when data loads
  React.useEffect(() => {
    if (!selectedFormatId && contentFormats.length > 0) {
      setSelectedFormatId(contentFormats[0].id);
    }
  }, [contentFormats, selectedFormatId]);
  
  const selectedFormat = contentFormats.find(f => f.id === selectedFormatId) || contentFormats[0];
  
  if (isLoading || !currentGym) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex gap-6 p-6 bg-muted/20" style={{ height: 'calc(100vh - 3rem)' }}>
      <div className="w-[18%] flex-shrink-0 h-full">
        <FormatSidebar
          contentFormats={contentFormats}
          selectedFormat={selectedFormat}
          onFormatSelect={(format) => setSelectedFormatId(format.id)}
        />
      </div>

      <div className="w-[57%] flex-shrink-0 h-full">
        <ContentTabs
          selectedFormat={selectedFormat}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="w-[25%] flex-shrink-0 h-full">
        <UploadPanel
          selectedFormat={selectedFormat}
        />
      </div>
    </div>
  );
}

export default ContentLibrary;