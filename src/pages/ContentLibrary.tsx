import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Play, 
  Calendar,
  Clock,
  MessageCircle
} from 'lucide-react';
import { AssignmentModal } from '@/components/AssignmentModal';

interface Assignment {
  id: number;
  title: string;
  due_date: string;
  status: string;
  priority: string;
  clips_required: number;
  clips_uploaded: number;
}

const ContentLibrary = () => {
  const { currentGym } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAssignments = async () => {
    if (!currentGym) return;

    try {
      const { data, error } = await supabase
        .from('assignment_distributions')
        .select(`
          id,
          custom_title,
          due_date,
          status,
          priority_override,
          assignment_templates (
            title,
            priority,
            clips_required
          )
        `)
        .eq('assigned_to_gym_id', currentGym.id)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error loading assignments:', error);
        return;
      }

      // Get upload counts for each assignment
      const assignmentsWithProgress = await Promise.all(
        (data || []).map(async (assignment) => {
          const { count } = await supabase
            .from('assignment_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('assignment_id', assignment.id)
            .eq('gym_id', currentGym.id);

          return {
            id: assignment.id,
            title: assignment.custom_title || assignment.assignment_templates?.title || 'Content Assignment',
            due_date: assignment.due_date,
            status: assignment.status,
            priority: assignment.priority_override || assignment.assignment_templates?.priority || 'medium',
            clips_required: assignment.assignment_templates?.clips_required || 4,
            clips_uploaded: count || 0,
          };
        })
      );

      setAssignments(assignmentsWithProgress);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [currentGym]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
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

  const getProgressColor = (uploaded: number, required: number) => {
    const percentage = (uploaded / required) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">
            {currentGym?.gym_name} - {currentGym?.gym_location}
          </p>
        </div>
      </div>

      {/* Assignments Grid */}
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
          <p className="text-muted-foreground">New content assignments will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <Card 
              key={assignment.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAssignment(assignment)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {assignment.title}
                  </CardTitle>
                  <Badge variant={getPriorityColor(assignment.priority)}>
                    {assignment.priority}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {assignment.clips_uploaded}/{assignment.clips_required}
                    </span>
                  </div>
                  <Progress 
                    value={(assignment.clips_uploaded / assignment.clips_required) * 100}
                    className="h-2"
                    style={{
                      background: `hsl(var(--muted))`,
                    }}
                  />
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due {formatDate(assignment.due_date)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAssignment(assignment);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Clips
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle view/preview action
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onUploadComplete={loadAssignments}
        />
      )}
    </div>
  );
};

export default ContentLibrary;