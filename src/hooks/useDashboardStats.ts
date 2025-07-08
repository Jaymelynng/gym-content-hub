import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
}

export const useDashboardStats = () => {
  const { currentGym } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignments: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    overdueAssignments: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
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
        .select('status, due_date')
        .eq('assigned_to_gym_id', currentGym.id);

      if (error) {
        console.error('Error loading stats:', error);
        return;
      }

      const now = new Date();
      const assignments = assignmentData || [];

      const totalAssignments = assignments.length;
      const activeAssignments = assignments.filter(
        a => ['assigned', 'acknowledged', 'in-progress'].includes(a.status)
      ).length;
      const completedAssignments = assignments.filter(
        a => ['completed', 'approved'].includes(a.status)
      ).length;
      const overdueAssignments = assignments.filter(
        a => new Date(a.due_date) < now && !['completed', 'approved'].includes(a.status)
      ).length;

      setStats({
        totalAssignments,
        activeAssignments,
        completedAssignments,
        overdueAssignments,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [currentGym]);

  return { stats, loading, loadStats };
};