import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface ProgressOverviewProps {
  totalProgress: number;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ totalProgress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Submission Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Completion</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;