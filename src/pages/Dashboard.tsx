import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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

  const handleStartTask = async (assignmentId: number) => {
    try {
      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: currentGym!.id,
        is_local: false
      });

      const { error } = await supabase
        .from('assignment_distributions')
        .update({ 
          status: 'in-progress'
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Task Started",
        description: "Assignment has been marked as in progress.",
      });
      
      loadAssignments();
    } catch (error) {
      console.error('Error starting task:', error);
      toast({
        title: "Error",
        description: "Failed to start task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (assignmentId: number) => {
    navigate(`/submit?assignment=${assignmentId}`);
  };

  if (isAdmin) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all gyms and their access</p>
          </div>
        </div>

        {/* Admin Panel Link */}
        <div className="flex justify-center">
          <Button onClick={() => navigate('/admin')} size="lg">
            Go to Admin Panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
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