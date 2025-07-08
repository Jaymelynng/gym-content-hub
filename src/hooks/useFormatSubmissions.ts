import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FormatSubmission {
  id: string;
  format_id: string;
  gym_id: string;
  file_name: string;
  file_path: string;
  file_type: 'image' | 'video' | 'text';
  file_size?: number;
  thumbnail_url?: string;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  feedback_notes?: string;
  admin_notes?: string;
  submission_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface UploadProgress {
  formatId: string;
  completedCount: number;
  pendingCount: number;
  revisionCount: number;
  lastSubmissionDate?: string;
}

export function useFormatSubmissions(formatId: string) {
  const { currentGym } = useAuth();
  
  return useQuery({
    queryKey: ['format-submissions', formatId, currentGym?.id],
    queryFn: async () => {
      if (!currentGym?.id) throw new Error('No gym authenticated');
      
      const { data, error } = await supabase
        .from('format_submissions')
        .select('*')
        .eq('format_id', formatId)
        .eq('gym_id', currentGym.id)
        .order('submitted_at', { ascending: false });
        
      if (error) throw error;
      return data as FormatSubmission[];
    },
    enabled: !!currentGym?.id && !!formatId,
  });
}

export function useUploadSubmission() {
  const queryClient = useQueryClient();
  const { currentGym } = useAuth();

  return useMutation({
    mutationFn: async (submission: {
      formatId: string;
      fileName: string;
      filePath: string;
      fileType: 'image' | 'video' | 'text';
      fileSize?: number;
      thumbnailUrl?: string;
      submissionNotes?: string;
    }) => {
      if (!currentGym?.id) throw new Error('No gym authenticated');

      const { data, error } = await supabase
        .from('format_submissions')
        .insert({
          format_id: submission.formatId,
          gym_id: currentGym.id,
          file_name: submission.fileName,
          file_path: submission.filePath,
          file_type: submission.fileType,
          file_size: submission.fileSize,
          thumbnail_url: submission.thumbnailUrl,
          submission_notes: submission.submissionNotes,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as FormatSubmission;
    },
    onSuccess: (data) => {
      // Invalidate and refetch format submissions
      queryClient.invalidateQueries({
        queryKey: ['format-submissions', data.format_id, currentGym?.id]
      });
      
      // Invalidate format progress
      queryClient.invalidateQueries({
        queryKey: ['format-progress', data.format_id, currentGym?.id]
      });

      toast.success('Content uploaded successfully!');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload content. Please try again.');
    },
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();
  const { currentGym } = useAuth();

  return useMutation({
    mutationFn: async (update: {
      submissionId: string;
      updates: Partial<FormatSubmission>;
    }) => {
      const { data, error } = await supabase
        .from('format_submissions')
        .update(update.updates)
        .eq('id', update.submissionId)
        .select()
        .single();

      if (error) throw error;
      return data as FormatSubmission;
    },
    onSuccess: (data) => {
      // Invalidate and refetch format submissions
      queryClient.invalidateQueries({
        queryKey: ['format-submissions', data.format_id, currentGym?.id]
      });
      
      // Invalidate format progress
      queryClient.invalidateQueries({
        queryKey: ['format-progress', data.format_id, currentGym?.id]
      });

      toast.success('Submission updated successfully!');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update submission. Please try again.');
    },
  });
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient();
  const { currentGym } = useAuth();

  return useMutation({
    mutationFn: async (submissionId: string) => {
      const { error } = await supabase
        .from('format_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;
      return submissionId;
    },
    onSuccess: (submissionId) => {
      // Invalidate and refetch format submissions
      queryClient.invalidateQueries({
        queryKey: ['format-submissions']
      });
      
      // Invalidate format progress
      queryClient.invalidateQueries({
        queryKey: ['format-progress']
      });

      toast.success('Submission deleted successfully!');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete submission. Please try again.');
    },
  });
}

export function useFormatProgress(formatId: string) {
  const { currentGym } = useAuth();
  
  return useQuery({
    queryKey: ['format-progress', formatId, currentGym?.id],
    queryFn: async () => {
      if (!currentGym?.id) throw new Error('No gym authenticated');
      
      const { data, error } = await supabase
        .from('format_progress')
        .select('*')
        .eq('format_id', formatId)
        .eq('gym_id', currentGym.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      // If no progress record exists, create one with default values
      if (!data) {
        return {
          completed_count: 0,
          pending_count: 0,
          revision_count: 0,
          last_submission_date: null,
        };
      }
      
      return data;
    },
    enabled: !!currentGym?.id && !!formatId,
  });
}

export function useCalculateProgress() {
  const queryClient = useQueryClient();
  const { currentGym } = useAuth();

  return useMutation({
    mutationFn: async (formatId: string) => {
      if (!currentGym?.id) throw new Error('No gym authenticated');

      // Get all submissions for this format and gym
      const { data: submissions, error } = await supabase
        .from('format_submissions')
        .select('status, submitted_at')
        .eq('format_id', formatId)
        .eq('gym_id', currentGym.id);

      if (error) throw error;

      // Calculate progress
      const completedCount = submissions.filter(s => s.status === 'approved').length;
      const pendingCount = submissions.filter(s => s.status === 'pending').length;
      const revisionCount = submissions.filter(s => s.status === 'needs_revision').length;
      
      const lastSubmission = submissions
        .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0];

      // Upsert progress record
      const { data, error: upsertError } = await supabase
        .from('format_progress')
        .upsert({
          format_id: formatId,
          gym_id: currentGym.id,
          completed_count: completedCount,
          pending_count: pendingCount,
          revision_count: revisionCount,
          last_submission_date: lastSubmission?.submitted_at || null,
          calculated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (upsertError) throw upsertError;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate format progress
      queryClient.invalidateQueries({
        queryKey: ['format-progress', data.format_id, currentGym?.id]
      });
    },
    onError: (error) => {
      console.error('Progress calculation error:', error);
    },
  });
}