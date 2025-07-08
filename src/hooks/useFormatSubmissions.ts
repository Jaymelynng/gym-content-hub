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
  file_type: 'photo' | 'video' | 'gif';
  thumbnail_url: string | null;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  feedback_notes: string | null;
  admin_notes: string | null;
  submitted_at: string;
  created_at: string;
}

export interface UploadSubmissionData {
  formatId: string;
  file: File;
  fileName: string;
}

export const useFormatSubmissions = (formatId: string) => {
  const { currentGym } = useAuth();

  return useQuery({
    queryKey: ['format-submissions', formatId, currentGym?.id],
    queryFn: async (): Promise<FormatSubmission[]> => {
      if (!currentGym) return [];

      const { data, error } = await supabase
        .from('format_submissions')
        .select('*')
        .eq('format_id', formatId)
        .eq('gym_id', currentGym.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch submissions: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!currentGym && !!formatId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUploadSubmission = () => {
  const queryClient = useQueryClient();
  const { currentGym } = useAuth();

  return useMutation({
    mutationFn: async ({ formatId, file, fileName }: UploadSubmissionData): Promise<FormatSubmission> => {
      if (!currentGym) {
        throw new Error('No gym context available');
      }

      // Determine file type
      const fileType = file.type.startsWith('image/') 
        ? (file.type.includes('gif') ? 'gif' : 'photo')
        : 'video';

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileNameWithExt = `${Date.now()}-${fileName}.${fileExt}`;
      const filePath = `submissions/${currentGym.id}/${formatId}/${fileNameWithExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content-uploads')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('content-uploads')
        .getPublicUrl(filePath);

      // Create submission record
      const { data: submissionData, error: submissionError } = await supabase
        .from('format_submissions')
        .insert({
          format_id: formatId,
          gym_id: currentGym.id,
          file_name: fileName,
          file_path: filePath,
          file_type: fileType,
          thumbnail_url: urlData.publicUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      return submissionData;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch submissions
      queryClient.invalidateQueries({
        queryKey: ['format-submissions', variables.formatId, currentGym?.id]
      });
      
      // Invalidate progress data
      queryClient.invalidateQueries({
        queryKey: ['format-progress', currentGym?.id]
      });

      toast.success('Content uploaded successfully!');
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    }
  });
};

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();
  const { currentGym } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      submissionId, 
      status, 
      feedbackNotes 
    }: { 
      submissionId: string; 
      status: FormatSubmission['status']; 
      feedbackNotes?: string; 
    }): Promise<FormatSubmission> => {
      const { data, error } = await supabase
        .from('format_submissions')
        .update({ 
          status, 
          feedback_notes: feedbackNotes || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update submission: ${error.message}`);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate all submission and progress queries
      queryClient.invalidateQueries({
        queryKey: ['format-submissions']
      });
      queryClient.invalidateQueries({
        queryKey: ['format-progress']
      });
      
      toast.success('Submission status updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });
};