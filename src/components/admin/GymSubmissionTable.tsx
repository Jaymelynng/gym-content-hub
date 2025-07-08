import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { GymSubmissionStatus } from '@/hooks/useGymSubmissions';
import { formatDistanceToNow } from 'date-fns';

interface GymSubmissionTableProps {
  gyms: GymSubmissionStatus[];
  loading: boolean;
}

const getStatusBadge = (status: GymSubmissionStatus['status']) => {
  const variants = {
    excellent: 'default',
    good: 'secondary',
    warning: 'outline',
    critical: 'destructive',
  } as const;

  const labels = {
    excellent: 'Excellent',
    good: 'Good',
    warning: 'Warning',
    critical: 'Critical',
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

const GymSubmissionTable: React.FC<GymSubmissionTableProps> = ({ gyms, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gym Submission Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gym Submission Status</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Reminder
          </Button>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gym</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Assignments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Avg Response</TableHead>
              <TableHead>Last Submission</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gyms.map((gym) => (
              <TableRow key={gym.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{gym.gym_name}</div>
                    <div className="text-sm text-muted-foreground">{gym.gym_location}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{gym.completionRate}%</span>
                      <span className="text-muted-foreground">
                        {gym.completedAssignments}/{gym.totalAssignments}
                      </span>
                    </div>
                    <Progress value={gym.completionRate} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      {gym.completedAssignments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-600" />
                      {gym.inProgressAssignments}
                    </div>
                    {gym.overdueAssignments > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        {gym.overdueAssignments}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(gym.status)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {gym.averageResponseTime > 0 ? `${gym.averageResponseTime} days` : 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {gym.lastSubmission 
                      ? formatDistanceToNow(new Date(gym.lastSubmission), { addSuffix: true })
                      : 'Never'
                    }
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Send Message
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GymSubmissionTable;