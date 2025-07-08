import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubmitActionsProps {
  isSubmitting: boolean;
  totalProgress: number;
  onSubmit: () => void;
}

const SubmitActions: React.FC<SubmitActionsProps> = ({ 
  isSubmitting, 
  totalProgress, 
  onSubmit 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <Button variant="outline" onClick={() => navigate('/assignments')}>
        Back to Assignments
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || totalProgress === 0}
        className="min-w-32"
      >
        {isSubmitting ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Submit Work
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitActions;