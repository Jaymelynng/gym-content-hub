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
    <div className="flex h-screen gap-4 p-6">
      <FormatSidebar
        contentFormats={contentFormats}
        selectedFormat={selectedFormat}
        onFormatSelect={setSelectedFormat}
        totalUploaded={totalUploaded}
        totalRequired={totalRequired}
        overallProgress={overallProgress}
      />

      <ContentTabs
        currentPlan={currentPlan}
        selectedFormat={selectedFormat}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <UploadPanel
        selectedFormat={selectedFormat}
        uploads={currentPlan.uploads}
      />
    </div>
  );
}

export default ContentLibrary;