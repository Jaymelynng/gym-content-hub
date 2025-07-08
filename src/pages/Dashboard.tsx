import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useContentFormats } from '@/hooks/useContentFormats';
import { useProgressSummary } from '@/hooks/useFormatProgress';
import { useFormatSubmissions } from '@/hooks/useFormatSubmissions';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { currentGym, isAdmin } = useAuth();
  const { data: contentFormats } = useContentFormats();
  const { summary, isLoading: progressLoading } = useProgressSummary();

  // Get recent submissions for the current gym
  const { data: recentSubmissions } = useFormatSubmissions('all'); // This would need to be modified to get all submissions for the gym

  if (isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Use the admin panel to manage all gyms and review submissions.
          </p>
          <Link to="/admin">
            <Button size="lg">
              <Building2 className="h-5 w-5 mr-2" />
              Go to Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentGym) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Gym Selected</h2>
          <p className="text-muted-foreground">Please log in with your gym credentials.</p>
        </div>
      </div>
    );
  }

  const totalCompleted = summary.totalCompleted;
  const totalPending = summary.totalPending;
  const totalRevisions = summary.totalRevisions;
  const totalSubmissions = totalCompleted + totalPending + totalRevisions;
  const overallProgress = totalSubmissions > 0 
    ? Math.round((totalCompleted / totalSubmissions) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {currentGym.gym_name}
          </h1>
          <p className="text-muted-foreground">
            {currentGym.location} • {currentGym.contact_info?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/content-library">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-rose-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress by Format */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progress by Content Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            {progressLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading progress...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contentFormats?.map(format => {
                  const progress = summary.formatProgress[format.id];
                  const completed = progress?.completed_count || 0;
                  const pending = progress?.pending_count || 0;
                  const revisions = progress?.revision_count || 0;
                  const total = completed + pending + revisions;
                  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div key={format.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{format.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {completed}/{format.total_required} completed
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {percentage}%
                        </Badge>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{completed} ✓</span>
                        <span>{pending} ⏳</span>
                        <span>{revisions} 🔄</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {recentSubmissions && recentSubmissions.length > 0 ? (
                  recentSubmissions.slice(0, 10).map(submission => (
                    <div key={submission.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {submission.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {submission.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                        {submission.status === 'needs_revision' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{submission.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {submission.file_type}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent submissions</p>
                    <p className="text-xs">Start creating content to see activity here</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/content-library">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Content Library</span>
                <span className="text-xs text-muted-foreground">Create & manage content</span>
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Upload Content</span>
                <span className="text-xs text-muted-foreground">Submit new files</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
              <span className="text-xs text-muted-foreground">Track performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;