import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FileUploadZone from '@/components/submit/FileUploadZone';
import FormatProgress from '@/components/submit/FormatProgress';

interface Assignment {
  id: number;
  custom_title?: string;
  custom_description?: string;
  due_date: string;
  status: string;
  assignment_templates: {
    title: string;
    description: string;
    formats_required: string[];
  };
}

interface ContentFormat {
  format_key: string;
  title: string;
  description: string;
  total_required: number;
}

interface UploadedFile {
  format: string;
  files: File[];
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

const Submit = () => {
  const { currentGym } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [contentFormats, setContentFormats] = useState<ContentFormat[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const assignmentId = searchParams.get('assignment');

  useEffect(() => {
    if (!currentGym || !assignmentId) {
      setLoading(false);
      return;
    }
    loadAssignmentData();
  }, [currentGym, assignmentId]);

  const loadAssignmentData = async () => {
    try {
      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: currentGym!.id,
        is_local: false
      });

      // Load assignment
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignment_distributions')
        .select(`
          id,
          custom_title,
          custom_description,
          due_date,
          status,
          assignment_templates (
            title,
            description,
            formats_required
          )
        `)
        .eq('id', parseInt(assignmentId))
        .single();

      if (assignmentError) throw assignmentError;
      setAssignment(assignmentData);

      // Load content formats
      const { data: formatsData, error: formatsError } = await supabase
        .from('content_formats')
        .select('format_key, title, description, total_required')
        .in('format_key', assignmentData.assignment_templates.formats_required)
        .eq('is_active', true);

      if (formatsError) throw formatsError;
      setContentFormats(formatsData || []);

      // Initialize upload state
      const initialUploadState: Record<string, UploadedFile> = {};
      (formatsData || []).forEach(format => {
        initialUploadState[format.format_key] = {
          format: format.format_key,
          files: [],
          progress: 0,
          status: 'pending'
        };
      });
      setUploadedFiles(initialUploadState);

    } catch (error) {
      console.error('Error loading assignment data:', error);
      toast({
        title: "Error",
        description: "Failed to load assignment data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (formatKey: string, files: File[]) => {
    setUploadedFiles(prev => ({
      ...prev,
      [formatKey]: {
        ...prev[formatKey],
        files,
        status: 'uploading',
        progress: 0
      }
    }));

    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentGym!.id}/${assignmentId}/${formatKey}/${Date.now()}_${index}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('assignment-content')
          .upload(fileName, file);

        if (error) throw error;
        return fileName;
      });

      await Promise.all(uploadPromises);

      setUploadedFiles(prev => ({
        ...prev,
        [formatKey]: {
          ...prev[formatKey],
          progress: 100,
          status: 'completed'
        }
      }));

      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${files.length} file(s) for ${formatKey}.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadedFiles(prev => ({
        ...prev,
        [formatKey]: {
          ...prev[formatKey],
          status: 'error',
          progress: 0
        }
      }));

      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!assignment || !currentGym) return;

    const completedFormats = Object.values(uploadedFiles).filter(
      upload => upload.status === 'completed' && upload.files.length > 0
    );

    if (completedFormats.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload at least one file before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create submission record
      const { data: submission, error: submissionError } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: assignment.id,
          gym_id: currentGym.id,
          selected_formats: Object.keys(uploadedFiles).filter(
            key => uploadedFiles[key].status === 'completed'
          ),
          submission_notes: submissionNotes,
          submission_status: 'submitted',
          submitted_at: new Date().toISOString(),
          uploaded_files: JSON.stringify(uploadedFiles) as any
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Update assignment status
      const { error: updateError } = await supabase
        .from('assignment_distributions')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .eq('id', assignment.id);

      if (updateError) throw updateError;

      toast({
        title: "Submission Complete",
        description: "Your work has been submitted for review.",
      });

      navigate('/assignments');

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your work. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalProgress = () => {
    const totalFormats = contentFormats.length;
    const completedFormats = Object.values(uploadedFiles).filter(
      upload => upload.status === 'completed'
    ).length;
    return totalFormats > 0 ? (completedFormats / totalFormats) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
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

  if (!assignment) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Submit Work</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Assignment Selected</h3>
            <p className="text-muted-foreground mb-4">
              Please select an assignment from your dashboard to submit work.
            </p>
            <Button onClick={() => navigate('/assignments')}>
              View Assignments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const title = assignment.custom_title || assignment.assignment_templates.title;
  const description = assignment.custom_description || assignment.assignment_templates.description;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Submit Work</h1>
        <p className="text-muted-foreground">Upload your content for assignment review</p>
      </div>

      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Badge variant="outline">
              Due: {new Date(assignment.due_date).toLocaleDateString()}
            </Badge>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Submission Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Completion</span>
              <span>{Math.round(getTotalProgress())}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Content Upload Sections */}
      <div className="space-y-4">
        {contentFormats.map((format) => (
          <Card key={format.format_key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{format.title}</span>
                <div className="flex items-center gap-2">
                  {uploadedFiles[format.format_key]?.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <Badge variant="outline">
                    {format.total_required} required
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>{format.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadZone
                formatKey={format.format_key}
                onUpload={(files) => handleFileUpload(format.format_key, files)}
                uploadState={uploadedFiles[format.format_key]}
              />
              <FormatProgress
                formatKey={format.format_key}
                required={format.total_required}
                uploadState={uploadedFiles[format.format_key]}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submission Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Notes</CardTitle>
          <CardDescription>
            Add any notes or context about your submission (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about your submission..."
            value={submissionNotes}
            onChange={(e) => setSubmissionNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/assignments')}>
          Back to Assignments
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || getTotalProgress() === 0}
          className="min-w-32"
        >
          {isSubmitting ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Submit Work
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Submit;