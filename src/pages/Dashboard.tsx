import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Upload } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useDashboardAssignments } from '@/hooks/useDashboardAssignments';
import StatsCards from '@/components/dashboard/StatsCards';
import AssignmentGrid from '@/components/dashboard/AssignmentGrid';

const Dashboard = () => {
  const { currentGym, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { assignments, loading: assignmentsLoading, loadAssignments } = useDashboardAssignments();

  const handleStartTask = (assignmentId: number) => {
    toast({
      title: "Task Started",
      description: "Assignment has been marked as in progress.",
    });
    // TODO: Update assignment status to 'in-progress'
    loadAssignments();
  };

  const handleSubmit = (assignmentId: number) => {
    navigate('/submit');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {currentGym?.gym_name} - {currentGym?.gym_location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/assignments')}>
            <ClipboardList className="mr-2 h-4 w-4" />
            View Assignments
          </Button>
          <Button variant="outline" onClick={() => navigate('/submit')}>
            <Upload className="mr-2 h-4 w-4" />
            Submit Work
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Assignment Cards */}
      <AssignmentGrid 
        assignments={assignments}
        loading={assignmentsLoading}
        onStartTask={handleStartTask}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Dashboard;