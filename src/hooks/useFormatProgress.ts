import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FormatProgress {
  id: string;
  gym_id: string;
  format_id: string;
  completed_count: number;
  pending_count: number;
  revision_count: number;
  last_submission_date: string | null;
  created_at: string;
}

export interface ProgressSummary {
  totalCompleted: number;
  totalPending: number;
  totalRevisions: number;
  overallProgress: number;
  formatProgress: Record<string, FormatProgress>;
}

export const useFormatProgress = () => {
  const { currentGym } = useAuth();

  return useQuery({
    queryKey: ['format-progress', currentGym?.id],
    queryFn: async (): Promise<FormatProgress[]> => {
      if (!currentGym) return [];

      const { data, error } = await supabase
        .from('format_progress')
        .select('*')
        .eq('gym_id', currentGym.id)
        .order('created_at');

      if (error) {
        throw new Error(`Failed to fetch progress: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!currentGym,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProgressSummary = () => {
  const { data: progressData, isLoading, error } = useFormatProgress();

  const summary: ProgressSummary = {
    totalCompleted: 0,
    totalPending: 0,
    totalRevisions: 0,
    overallProgress: 0,
    formatProgress: {}
  };

  if (progressData) {
    progressData.forEach(progress => {
      summary.totalCompleted += progress.completed_count;
      summary.totalPending += progress.pending_count;
      summary.totalRevisions += progress.revision_count;
      summary.formatProgress[progress.format_id] = progress;
    });

    const totalSubmissions = summary.totalCompleted + summary.totalPending + summary.totalRevisions;
    summary.overallProgress = totalSubmissions > 0 
      ? Math.round((summary.totalCompleted / totalSubmissions) * 100)
      : 0;
  }

  return {
    summary,
    isLoading,
    error
  };
};