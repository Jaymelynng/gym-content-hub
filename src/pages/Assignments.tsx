import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Upload,
  FileText,
  Video,
  Image,
  Zap
} from 'lucide-react';

interface Assignment {
  id: number;
  custom_title?: string;
  custom_description?: string;
  due_date: string;
  status: string;
  priority_override?: string;
  special_instructions?: string;
  assignment_templates: {
    title: string;
    description: string;
    priority: string;
    assignment_brief: string;
    requirements_text: string;
    submission_guidelines: string;
    formats_required: string[];
    estimated_hours?: number;
  };
}

const Assignments = () => {
  const { currentGym, isAdmin } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const loadAssignments = async () => {
    if (!currentGym) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assignment_distributions')
        .select(`
          id,
          custom_title,
          custom_description,
          due_date,
          status,
          priority_override,
          special_instructions,
          assignment_templates (
            title,
            description,
            priority,
            assignment_brief,
            requirements_text,
            submission_guidelines,
            formats_required,
            estimated_hours
          )
        `)
        .eq('assigned_to_gym_id', currentGym.id)
        .order('due_date', { ascending: true });

      if (error) throw error;

      setAssignments(data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [currentGym]);

  useEffect(() => {
    let filtered = assignments;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment => {
        const title = assignment.custom_title || assignment.assignment_templates?.title || '';
        const description = assignment.custom_description || assignment.assignment_templates?.description || '';
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredAssignments(filtered);
  }, [assignments, statusFilter, searchTerm]);

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
      case 'assigned':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
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

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && !['completed', 'approved'].includes(status);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video-reel':
        return <Video className="h-4 w-4" />;
      case 'static-photo':
      case 'carousel-images':
        return <Image className="h-4 w-4" />;
      case 'animated-image':
        return <Zap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleAcknowledge = async (assignmentId: number) => {
    try {
      const { error } = await supabase
        .from('assignment_distributions')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Assignment Acknowledged",
        description: "You've acknowledged this assignment.",
      });

      loadAssignments();
    } catch (error) {
      console.error('Error acknowledging assignment:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge assignment.",
        variant: "destructive",
      });
    }
  };

  const handleStartWork = async (assignmentId: number) => {
    try {
      const { error } = await supabase
        .from('assignment_distributions')
        .update({ 
          status: 'in-progress',
          started_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Work Started",
        description: "Assignment status updated to in progress.",
      });

      loadAssignments();
    } catch (error) {
      console.error('Error starting work:', error);
      toast({
        title: "Error",
        description: "Failed to start work on assignment.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground">
            Manage and track your content creation assignments
          </p>
        </div>
        <Button onClick={() => window.location.href = '/submit'}>
          <Upload className="mr-2 h-4 w-4" />
          Submit Work
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="needs-revision">Needs Revision</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assignment Grid */}
      {filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No assignments found</h3>
            <p className="text-muted-foreground">
              {assignments.length === 0 
                ? "You don't have any assignments yet. New assignments will appear here."
                : "No assignments match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => {
            const title = assignment.custom_title || assignment.assignment_templates?.title || 'Untitled Assignment';
            const description = assignment.custom_description || assignment.assignment_templates?.description || '';
            const priority = assignment.priority_override || assignment.assignment_templates?.priority || 'medium';
            const daysUntilDue = getDaysUntilDue(assignment.due_date);
            const overdue = isOverdue(assignment.due_date, assignment.status);

            return (
              <Dialog key={assignment.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight mb-2">{title}</CardTitle>
                          <CardDescription className="line-clamp-2">{description}</CardDescription>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(assignment.status)} flex-shrink-0 mt-1`}></div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Due Date */}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className={overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                            Due: {formatDate(assignment.due_date)}
                            {overdue && ' (Overdue)'}
                          </span>
                        </div>

                        {/* Time to deadline */}
                        {!overdue && daysUntilDue <= 7 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600">
                              {daysUntilDue === 0 ? 'Due today' : 
                               daysUntilDue === 1 ? 'Due tomorrow' : 
                               `${daysUntilDue} days left`}
                            </span>
                          </div>
                        )}

                        {/* Required Formats */}
                        <div className="flex flex-wrap gap-1">
                          {assignment.assignment_templates?.formats_required?.map((format) => (
                            <div key={format} className="flex items-center gap-1 bg-accent px-2 py-1 rounded-sm text-xs">
                              {getFormatIcon(format)}
                              <span className="capitalize">{format.replace('-', ' ')}</span>
                            </div>
                          ))}
                        </div>

                        {/* Status and Priority */}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {assignment.status.replace('-', ' ')}
                          </Badge>
                          <Badge variant={getPriorityVariant(priority)} className="text-xs">
                            {priority}
                          </Badge>
                        </div>

                        {/* Progress indicator */}
                        <div className="w-full">
                          <Progress 
                            value={
                              assignment.status === 'completed' || assignment.status === 'approved' ? 100 :
                              assignment.status === 'submitted' || assignment.status === 'under-review' ? 80 :
                              assignment.status === 'in-progress' ? 40 :
                              assignment.status === 'acknowledged' ? 20 :
                              0
                            } 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                {/* Assignment Detail Dialog */}
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription>
                      {description}
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="brief" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="brief">Assignment Brief</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="submission">Submission Guidelines</TabsTrigger>
                    </TabsList>

                    <TabsContent value="brief" className="space-y-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Due Date</h4>
                            <p className={`text-sm ${overdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {formatDate(assignment.due_date)}
                              {overdue && ' (Overdue)'}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Estimated Time</h4>
                            <p className="text-sm text-muted-foreground">
                              {assignment.assignment_templates?.estimated_hours || 'Not specified'} hours
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Assignment Overview</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {assignment.assignment_templates?.assignment_brief || 'No brief provided.'}
                          </p>
                        </div>

                        {assignment.special_instructions && (
                          <div>
                            <h4 className="font-medium mb-2">Special Instructions</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {assignment.special_instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="requirements" className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Technical Requirements</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {assignment.assignment_templates?.requirements_text || 'No specific requirements provided.'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Required Formats</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {assignment.assignment_templates?.formats_required?.map((format) => (
                            <div key={format} className="flex items-center gap-2 p-2 bg-accent rounded">
                              {getFormatIcon(format)}
                              <span className="text-sm capitalize">{format.replace('-', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="submission" className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Submission Process</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {assignment.assignment_templates?.submission_guidelines || 'Standard submission process applies.'}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        {assignment.status === 'assigned' && (
                          <Button 
                            onClick={() => handleAcknowledge(assignment.id)}
                            variant="outline"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Acknowledge Assignment
                          </Button>
                        )}
                        
                        {(['acknowledged', 'assigned'].includes(assignment.status)) && (
                          <Button onClick={() => handleStartWork(assignment.id)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Start Working
                          </Button>
                        )}

                        {(['in-progress', 'acknowledged', 'assigned'].includes(assignment.status)) && (
                          <Button 
                            onClick={() => window.location.href = `/submit?assignment=${assignment.id}`}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Work
                          </Button>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;