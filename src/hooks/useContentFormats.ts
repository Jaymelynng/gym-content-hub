import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContentFormat {
  id: string;
  format_key: string;
  title: string;
  description: string;
  format_type: 'photo' | 'video' | 'carousel' | 'story' | 'animated';
  dimensions: string;
  duration: string | null;
  total_required: number;
  setup_planning: {
    title: string;
    checklist: string[];
    timeline: string;
    requirements: string[];
  };
  production_tips: {
    title: string;
    tips: string[];
    dosDonts: {
      dos: string[];
      donts: string[];
    };
    equipment: string[];
  };
  examples: {
    title: string;
    descriptions: string[];
    commonMistakes: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface FormatSubmission {
  id: string;
  format_id: string;
  gym_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  thumbnail_url: string;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  submitted_at: string;
}

export const useContentFormats = () => {
  return useQuery({
    queryKey: ['content-formats'],
    queryFn: async (): Promise<ContentFormat[]> => {
      const { data, error } = await supabase
        .from('content_formats')
        .select('*')
        .order('created_at');

      if (error) {
        throw new Error(`Failed to fetch content formats: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useContentFormat = (formatKey: string) => {
  return useQuery({
    queryKey: ['content-format', formatKey],
    queryFn: async (): Promise<ContentFormat | null> => {
      const { data, error } = await supabase
        .from('content_formats')
        .select('*')
        .eq('format_key', formatKey)
        .single();

      if (error) {
        throw new Error(`Failed to fetch content format: ${error.message}`);
      }

      return data;
    },
    enabled: !!formatKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

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
      return data || { completed_count: 0, pending_count: 0, revision_count: 0 };
    },
    enabled: !!currentGym?.id && !!formatId,
  });
}