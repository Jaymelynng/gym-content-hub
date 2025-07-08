import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from '@/components/AssignmentCard';
import { AssignmentWithDetails } from '@/hooks/useDashboardAssignments';

interface AssignmentGridProps {
  assignments: AssignmentWithDetails[];
  loading: boolean;
  onStartTask: (id: number) => void;
  onSubmit: (id: number) => void;
}

const AssignmentGrid: React.FC<AssignmentGridProps> = ({ 
  assignments, 
  loading, 
  onStartTask, 
  onSubmit 
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Assignments</h2>
          <Button variant="outline" disabled>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Assignments</h2>
        <Button variant="outline" onClick={() => navigate('/assignments')}>
          View All
        </Button>
      </div>
      
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
            <p className="text-muted-foreground mb-4">
              New assignments will appear here when they're assigned to your gym
            </p>
            <Button onClick={() => navigate('/content-library')}>
              Explore Content Library
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              id={assignment.id}
              title={assignment.title}
              description={assignment.description}
              status={assignment.status}
              priority={assignment.priority}
              dueDate={assignment.due_date}
              formats={assignment.formats}
              onStartTask={onStartTask}
              onSubmit={onSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentGrid;