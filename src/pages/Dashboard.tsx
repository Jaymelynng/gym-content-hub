import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Upload
} from 'lucide-react';

interface DashboardStats {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
  submissionRate: number;
  avgQualityScore: number;
}

interface RecentAssignment {
  id: number;
  title: string;
  due_date: string;
  status: string;
  priority: string;
}

const Dashboard = () => {
  const { currentGym, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignments: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    overdueAssignments: 0,
    submissionRate: 0,
    avgQualityScore: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState<RecentAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!currentGym) return;

    try {
      setLoading(true);

      // Load assignments for current gym
      const { data: assignments, error } = await supabase
        .from('assignment_distributions')
        .select(`
          id,
          custom_title,
          due_date,
          status,
          priority_override,
          assignment_templates (
            title,
            priority
          )
        `)
        .eq('assigned_to_gym_id', currentGym.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        return;
      }

      const now = new Date();
      const assignmentData = assignments || [];

      // Calculate stats
      const totalAssignments = assignmentData.length;
      const activeAssignments = assignmentData.filter(
        a => ['assigned', 'acknowledged', 'in-progress'].includes(a.status)
      ).length;
      const completedAssignments = assignmentData.filter(
        a => ['completed', 'approved'].includes(a.status)
      ).length;
      const overdueAssignments = assignmentData.filter(
        a => new Date(a.due_date) < now && !['completed', 'approved'].includes(a.status)
      ).length;

      const submissionRate = totalAssignments > 0 
        ? Math.round((completedAssignments / totalAssignments) * 100)
        : 0;

      setStats({
        totalAssignments,
        activeAssignments,
        completedAssignments,
        overdueAssignments,
        submissionRate,
        avgQualityScore: 8.5, // Mock data - would come from submissions
      });

      // Recent assignments
      const recent = assignmentData.slice(0, 5).map(assignment => ({
        id: assignment.id,
        title: assignment.custom_title || assignment.assignment_templates?.title || 'Untitled Assignment',
        due_date: assignment.due_date,
        status: assignment.status,
        priority: assignment.priority_override || assignment.assignment_templates?.priority || 'medium',
      }));

      setRecentAssignments(recent);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentGym]);

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

      {/* Progress and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Submission Rate
            </CardTitle>
            <CardDescription>
              Percentage of assignments completed on time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{stats.submissionRate}%</span>
            </div>
            <Progress value={stats.submissionRate} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {stats.completedAssignments} of {stats.totalAssignments} assignments completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Score</CardTitle>
            <CardDescription>
              Average quality rating from admin reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Score</span>
              <span className="text-2xl font-bold">{stats.avgQualityScore}/10</span>
            </div>
            <Progress value={stats.avgQualityScore * 10} className="h-2" />
            <div className="text-sm text-muted-foreground">
              Based on submitted work reviews
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Assignments
          </CardTitle>
          <CardDescription>
            Your latest assignment activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No assignments yet</p>
              <p className="text-sm">New assignments will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(assignment.status)}`}></div>
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className={`text-sm ${isOverdue(assignment.due_date) && !['completed', 'approved'].includes(assignment.status) ? 'text-destructive' : 'text-muted-foreground'}`}>
                        Due: {formatDate(assignment.due_date)}
                        {isOverdue(assignment.due_date) && !['completed', 'approved'].includes(assignment.status) && ' (Overdue)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityVariant(assignment.priority)}>
                      {assignment.priority}
                    </Badge>
                    <Badge variant="outline">
                      {assignment.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;