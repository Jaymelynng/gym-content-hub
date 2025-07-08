import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Play, Upload } from 'lucide-react';

interface ContentFormat {
  format_key: string;
  title: string;
  icon_name: string;
  format_type: string;
}

interface AssignmentCardProps {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  formats: ContentFormat[];
  onStartTask: (id: number) => void;
  onSubmit: (id: number) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  formats,
  onStartTask,
  onSubmit,
}) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const canStart = ['assigned', 'acknowledged'].includes(status);
  const canSubmit = ['in-progress'].includes(status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <Badge variant={getPriorityVariant(priority)} className="capitalize">
            {priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Content Format Badges */}
        <div className="flex flex-wrap gap-2">
          {formats.map((format) => (
            <Badge key={format.format_key} variant="outline" className="capitalize">
              {format.title}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Due Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={isOverdue(dueDate) && !['completed', 'approved'].includes(status) 
            ? 'text-destructive font-medium' 
            : 'text-muted-foreground'
          }>
            Due {formatDate(dueDate)}
            {isOverdue(dueDate) && !['completed', 'approved'].includes(status) && ' (Overdue)'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {canStart && (
            <Button 
              onClick={() => onStartTask(id)}
              className="flex-1"
              size="sm"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Task
            </Button>
          )}
          {canSubmit && (
            <Button 
              onClick={() => onSubmit(id)}
              className="flex-1"
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Submit Work
            </Button>
          )}
          {['completed', 'approved', 'submitted', 'under-review'].includes(status) && (
            <Button 
              variant="outline"
              className="flex-1"
              size="sm"
              disabled
            >
              <Clock className="mr-2 h-4 w-4" />
              {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;