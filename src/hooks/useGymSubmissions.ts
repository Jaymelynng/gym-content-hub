import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GymSubmissionStatus {
  id: string;
  gym_name: string;
  gym_location: string;
  totalAssignments: number;
  completedAssignments: number;
  overdueAssignments: number;
  inProgressAssignments: number;
  completionRate: number;
  averageResponseTime: number;
  lastSubmission: string | null;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export const useGymSubmissions = () => {
  const { currentGym, isAdmin } = useAuth();
  const [gyms, setGyms] = useState<GymSubmissionStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGymSubmissions = async () => {
    try {
      setLoading(true);

      // Only proceed if user is admin
      if (!isAdmin || !currentGym?.id) {
        console.warn('Admin access required for gym submissions');
        return;
      }

      // Set admin context
      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: currentGym.id,
        is_local: false
      });

      // Get all gyms
      const { data: gymsData, error: gymsError } = await supabase
        .from('gym_profiles')
        .select('id, gym_name, gym_location')
        .eq('active', true);

      if (gymsError) throw gymsError;

      // Get all assignments with gym performance data
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignment_distributions')
        .select('assigned_to_gym_id, status, due_date, created_at, submitted_at');

      if (assignmentsError) throw assignmentsError;

      const now = new Date();
      const assignments = assignmentsData || [];

      const gymSubmissionStatus = (gymsData || []).map(gym => {
        const gymAssignments = assignments.filter(a => a.assigned_to_gym_id === gym.id);
        
        const totalAssignments = gymAssignments.length;
        const completedAssignments = gymAssignments.filter(
          a => ['completed', 'approved'].includes(a.status)
        ).length;
        const overdueAssignments = gymAssignments.filter(
          a => new Date(a.due_date) < now && !['completed', 'approved'].includes(a.status)
        ).length;
        const inProgressAssignments = gymAssignments.filter(
          a => ['assigned', 'acknowledged', 'in-progress'].includes(a.status)
        ).length;

        const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

        // Calculate average response time
        const submittedAssignments = gymAssignments.filter(a => a.submitted_at);
        const averageResponseTime = submittedAssignments.length > 0 
          ? submittedAssignments.reduce((acc, a) => {
              const responseTime = new Date(a.submitted_at!).getTime() - new Date(a.created_at).getTime();
              return acc + (responseTime / (1000 * 60 * 60 * 24)); // days
            }, 0) / submittedAssignments.length
          : 0;

        // Get last submission
        const lastSubmission = gymAssignments
          .filter(a => a.submitted_at)
          .sort((a, b) => new Date(b.submitted_at!).getTime() - new Date(a.submitted_at!).getTime())[0]?.submitted_at || null;

        // Determine status
        let status: GymSubmissionStatus['status'] = 'excellent';
        if (overdueAssignments > 0 || completionRate < 50) {
          status = 'critical';
        } else if (completionRate < 80 || averageResponseTime > 7) {
          status = 'warning';
        } else if (completionRate < 95) {
          status = 'good';
        }

        return {
          id: gym.id,
          gym_name: gym.gym_name,
          gym_location: gym.gym_location,
          totalAssignments,
          completedAssignments,
          overdueAssignments,
          inProgressAssignments,
          completionRate,
          averageResponseTime: Math.round(averageResponseTime * 10) / 10,
          lastSubmission,
          status,
        };
      });

      setGyms(gymSubmissionStatus);
    } catch (error) {
      console.error('Error loading gym submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGymSubmissions();
  }, [currentGym?.id, isAdmin]);

  return { gyms, loading, loadGymSubmissions };
};