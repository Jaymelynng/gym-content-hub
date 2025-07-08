import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AssignmentCard from '@/components/AssignmentCard';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Upload
} from 'lucide-react';

interface DashboardStats {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
}

interface ContentFormat {
  format_key: string;
  title: string;
  icon_name: string;
  format_type: string;
}

interface AssignmentWithDetails {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  formats: ContentFormat[];
}

const Dashboard = () => {
  const { currentGym, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignments: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    overdueAssignments: 0,
  });
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!currentGym) return;

    try {
      setLoading(true);

      // Load assignments for current gym - first set the context for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: currentGym.id,
        is_local: false
      });

      // Load assignments with template and format data
      const { data: assignmentData, error } = await supabase
        .from('assignment_distributions')
        .select(`
          id,
          custom_title,
          custom_description,
          due_date,
          status,
          priority_override,
          assignment_templates (
            title,
            description,
            priority,
            formats_required
          )
        `)
        .eq('assigned_to_gym_id', currentGym.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        return;
      }

      // Load content formats
      const { data: contentFormats, error: formatsError } = await supabase
        .from('content_formats')
        .select('format_key, title, icon_name, format_type')
        .eq('is_active', true);

      if (formatsError) {
        console.error('Error loading content formats:', formatsError);
        return;
      }

      const now = new Date();
      const assignments = assignmentData || [];
      const formats = contentFormats || [];

      // Calculate stats
      const totalAssignments = assignments.length;
      const activeAssignments = assignments.filter(
        a => ['assigned', 'acknowledged', 'in-progress'].includes(a.status)
      ).length;
      const completedAssignments = assignments.filter(
        a => ['completed', 'approved'].includes(a.status)
      ).length;
      const overdueAssignments = assignments.filter(
        a => new Date(a.due_date) < now && !['completed', 'approved'].includes(a.status)
      ).length;

      setStats({
        totalAssignments,
        activeAssignments,
        completedAssignments,
        overdueAssignments,
      });

      // Process assignments with format details
      const processedAssignments = assignments.slice(0, 6).map(assignment => {
        const template = assignment.assignment_templates;
        const requiredFormats = template?.formats_required || [];
        
        // Get format details for required formats
        const assignmentFormats = requiredFormats.map(formatKey => 
          formats.find(f => f.format_key === formatKey)
        ).filter(Boolean) as ContentFormat[];

        return {
          id: assignment.id,
          title: assignment.custom_title || template?.title || 'Untitled Assignment',
          description: assignment.custom_description || template?.description || 'No description provided',
          due_date: assignment.due_date,
          status: assignment.status,
          priority: assignment.priority_override || template?.priority || 'medium',
          formats: assignmentFormats,
        };
      });

      setAssignments(processedAssignments);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentGym]);

  const handleStartTask = (assignmentId: number) => {
    toast({
      title: "Task Started",
      description: "Assignment has been marked as in progress.",
    });
    // TODO: Update assignment status to 'in-progress'
    loadDashboardData();
  };

  const handleSubmit = (assignmentId: number) => {
    navigate('/submit');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-500';
      case 'submitted':
      case 'under-review':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'needs-revision':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              All time assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Currently working on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Assignment Cards */}
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
                onStartTask={handleStartTask}
                onSubmit={handleSubmit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;