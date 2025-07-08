import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface SubmissionNotesProps {
  submissionNotes: string;
  onNotesChange: (notes: string) => void;
}

const SubmissionNotes: React.FC<SubmissionNotesProps> = ({ 
  submissionNotes, 
  onNotesChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submission Notes</CardTitle>
        <CardDescription>
          Add any notes or context about your submission (optional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add notes about your submission..."
          value={submissionNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default SubmissionNotes;