import React, { useState } from 'react';
import { FormatSidebar } from '@/components/content-library/FormatSidebar';
import { ContentTabs } from '@/components/content-library/ContentTabs';
import { UploadPanel } from '@/components/content-library/UploadPanel';
import { contentFormats, contentPlans, ContentFormat } from '@/data/contentFormats';

function ContentLibrary() {
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>(contentFormats[0]);
  const [activeTab, setActiveTab] = useState('setup');

  const currentPlan = contentPlans[selectedFormat.id as keyof typeof contentPlans];
  const totalUploaded = contentFormats.reduce((sum, format) => sum + format.uploaded, 0);
  const totalRequired = contentFormats.reduce((sum, format) => sum + format.total, 0);
  const overallProgress = totalRequired > 0 ? (totalUploaded / totalRequired) * 100 : 0;

  return (
    <div className="flex h-screen gap-6 p-6 bg-muted/20">
      <div className="w-[18%] flex-shrink-0">
        <FormatSidebar
          contentFormats={contentFormats}
          selectedFormat={selectedFormat}
          onFormatSelect={setSelectedFormat}
          totalUploaded={totalUploaded}
          totalRequired={totalRequired}
          overallProgress={overallProgress}
        />
      </div>

      <div className="w-[57%] flex-shrink-0">
        <ContentTabs
          currentPlan={currentPlan}
          selectedFormat={selectedFormat}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <div className="w-[25%] flex-shrink-0">
        <UploadPanel
          selectedFormat={selectedFormat}
          uploads={currentPlan.uploads}
        />
      </div>
    </div>
  );
}

export default ContentLibrary;