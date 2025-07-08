import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import CreateAssignmentModal from '@/components/admin/CreateAssignmentModal';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import GymPerformanceTable from '@/components/admin/GymPerformanceTable';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useGymPerformance } from '@/hooks/useGymPerformance';

const AdminPanel = () => {
  const { currentGym, isAdmin } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { stats, loading: statsLoading } = useAdminStats();
  const { gyms, loading: gymsLoading } = useGymPerformance();

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              You don't have permission to access this area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Master Dashboard</h1>
          <p className="text-muted-foreground">Monitor all gym performance and assignments</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      {/* Admin Stats Cards */}
      <AdminStatsCards stats={stats} loading={statsLoading} />

      {/* Gym Performance Table */}
      <GymPerformanceTable gyms={gyms} loading={gymsLoading} />

      {/* Create Assignment Modal */}
      <CreateAssignmentModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};

export default AdminPanel;