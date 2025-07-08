import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Building2, TrendingUp, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import CreateAssignmentModal from '@/components/admin/CreateAssignmentModal';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useGymSubmissions } from '@/hooks/useGymSubmissions';

const AdminPanel = () => {
  const { currentGym, isAdmin } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { stats, loading: statsLoading } = useAdminStats();
  const { gyms, loading: gymsLoading } = useGymSubmissions();

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              You don't have permission to access this area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-50 border-green-200 text-green-800';
      case 'good': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Admin Master Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">Monitor all gym submissions and assignments</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 h-12 px-6 text-lg font-semibold"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Create Assignment
        </Button>
      </div>

      {/* Quick Stats Cards - MAIN FOCUS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Quick Stats Overview</h2>
        </div>
        <AdminStatsCards stats={stats} loading={statsLoading} />
      </div>

      {/* Gym Performance Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Gym Performance</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {gyms.length} Active Gyms
          </div>
        </div>

        {gymsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym) => (
              <Card key={gym.id} className={`border-2 hover:shadow-lg transition-all ${getStatusColor(gym.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{gym.gym_name}</CardTitle>
                    <Badge 
                      variant={gym.status === 'excellent' ? 'default' : gym.status === 'critical' ? 'destructive' : 'secondary'} 
                      className="capitalize"
                    >
                      {gym.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{gym.gym_location}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Completion Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-2xl font-bold text-primary">{gym.completionRate}%</span>
                    </div>
                    <Progress value={gym.completionRate} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {gym.completedAssignments} of {gym.totalAssignments} assignments
                    </p>
                  </div>

                  {/* Assignment Status */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-600">{gym.completedAssignments}</div>
                      <div className="text-xs text-green-600">Done</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-blue-600">{gym.inProgressAssignments}</div>
                      <div className="text-xs text-blue-600">Active</div>
                    </div>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-red-600">{gym.overdueAssignments}</div>
                      <div className="text-xs text-red-600">Overdue</div>
                    </div>
                  </div>

                  {/* Response Time & Last Submission */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Avg Response:</span>
                      <div className="font-medium">
                        {gym.averageResponseTime > 0 ? `${gym.averageResponseTime} days` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Activity:</span>
                      <div className="font-medium">
                        {gym.lastSubmission ? '2 days ago' : 'Never'}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Plus className="h-5 w-5" />
              <span>New Assignment</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span>Bulk Reminder</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Export Report</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Building2 className="h-5 w-5" />
              <span>Manage Gyms</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Assignment Modal */}
      <CreateAssignmentModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};

export default AdminPanel;