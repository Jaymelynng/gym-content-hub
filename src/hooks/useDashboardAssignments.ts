import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ContentFormat {
  format_key: string;
  title: string;
  icon_name: string;
  format_type: string;
}

export interface AssignmentWithDetails {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  formats: ContentFormat[];
}

export const useDashboardAssignments = () => {
  const { currentGym } = useAuth();
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAssignments = async () => {
    if (!currentGym) return;

    try {
      setLoading(true);

      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: currentGym.id,
        is_local: false
      });

      const { data: assignmentData, error } = await supabase
        .from('assignment_distributions')
        .select(`
          id,
          custom_title,
          custom_description,
          due_date,
          status,
          priority_override,
          assignment_templates (
            title,
            description,
            priority,
            formats_required
          )
        `)
        .eq('assigned_to_gym_id', currentGym.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        return;
      }

      const { data: contentFormats, error: formatsError } = await supabase
        .from('content_formats')
        .select('format_key, title, icon_name, format_type')
        .eq('is_active', true);

      if (formatsError) {
        console.error('Error loading content formats:', formatsError);
        return;
      }

      const assignments = assignmentData || [];
      const formats = contentFormats || [];

      const processedAssignments = assignments.slice(0, 6).map(assignment => {
        const template = assignment.assignment_templates;
        const requiredFormats = template?.formats_required || [];
        
        const assignmentFormats = requiredFormats.map(formatKey => 
          formats.find(f => f.format_key === formatKey)
        ).filter(Boolean) as ContentFormat[];

        return {
          id: assignment.id,
          title: assignment.custom_title || template?.title || 'Untitled Assignment',
          description: assignment.custom_description || template?.description || 'No description provided',
          due_date: assignment.due_date,
          status: assignment.status,
          priority: assignment.priority_override || template?.priority || 'medium',
          formats: assignmentFormats,
        };
      });

      setAssignments(processedAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [currentGym]);

  return { assignments, loading, loadAssignments };
};