import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalGyms: number;
  activeAssignments: number;
  totalAssignments: number;
  completionRate: number;
  overdueAssignments: number;
  pendingReview: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalGyms: 0,
    activeAssignments: 0,
    totalAssignments: 0,
    completionRate: 0,
    overdueAssignments: 0,
    pendingReview: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Set admin context
      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: '1426',
        is_local: false
      });

      // Get total gyms
      const { data: gymsData, error: gymsError } = await supabase
        .from('gym_profiles')
        .select('id')
        .eq('active', true);

      if (gymsError) throw gymsError;

      // Get all assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignment_distributions')
        .select('status, due_date');

      if (assignmentsError) throw assignmentsError;

      const now = new Date();
      const assignments = assignmentsData || [];
      
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
      const pendingReview = assignments.filter(
        a => a.status === 'submitted'
      ).length;

      setStats({
        totalGyms: gymsData?.length || 0,
        activeAssignments,
        totalAssignments,
        completionRate: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0,
        overdueAssignments,
        pendingReview,
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, loadStats };
};