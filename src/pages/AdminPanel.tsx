import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useContentFormats } from '@/hooks/useContentFormats';
import { useFormatSubmissions } from '@/hooks/useFormatSubmissions';
import { useFormatProgress } from '@/hooks/useFormatProgress';

interface GymData {
  id: string;
  gym_name: string;
  location: string;
  contact_info: {
    email: string;
    phone: string;
  };
}

// Mock data for demonstration - in real app this would come from database
const mockGyms: GymData[] = [
  { id: 'CPF', gym_name: 'Capital Gymnastics', location: 'Central location', contact_info: { email: 'cpf@capitalgym.com', phone: '512-555-0101' } },
  { id: 'CRR', gym_name: 'Capital Gymnastics', location: 'Secondary facility', contact_info: { email: 'crr@capitalgym.com', phone: '512-555-0102' } },
  { id: 'CCP', gym_name: 'Capital Gymnastics', location: 'Community center partnership', contact_info: { email: 'ccp@capitalgym.com', phone: '512-555-0103' } },
  { id: 'RBA', gym_name: 'Rowland Ballard', location: 'Regional branch A', contact_info: { email: 'rba@rowlandballard.com', phone: '713-555-0101' } },
  { id: 'RBK', gym_name: 'Rowland Ballard', location: 'Regional branch K', contact_info: { email: 'rbk@rowlandballard.com', phone: '713-555-0102' } },
  { id: 'HGA', gym_name: 'Houston Gymnastics Academy', location: 'High-performance gym A', contact_info: { email: 'hga@houstongym.com', phone: '713-555-0201' } },
  { id: 'EST', gym_name: 'Estrella Gymnastics', location: 'Established location', contact_info: { email: 'est@estrellagym.com', phone: '602-555-0101' } },
  { id: 'OAS', gym_name: 'Oasis Gymnastics', location: 'Outdoor adventure sports', contact_info: { email: 'oas@oasisgym.com', phone: '602-555-0201' } },
  { id: 'SGT', gym_name: 'Scottsdale Gymnastics', location: 'Specialty gymnastics training', contact_info: { email: 'sgt@scottsdalegym.com', phone: '480-555-0101' } },
  { id: 'TIG', gym_name: 'Training Institute for Gymnastics', location: 'Training institute for gymnastics', contact_info: { email: 'tig@traininginstitute.com', phone: '512-555-0301' } },
];

function AdminPanel() {
  const { currentGym } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGym, setSelectedGym] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: contentFormats } = useContentFormats();
  const { data: allProgress } = useFormatProgress();

  // Check if user is admin
  if (!currentGym || (currentGym.id !== '1426' && currentGym.id !== '2222')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const filteredGyms = mockGyms.filter(gym =>
    gym.gym_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGyms = mockGyms.length;
  const totalFormats = contentFormats?.length || 0;
  const totalSubmissions = allProgress?.reduce((sum, progress) => 
    sum + progress.completed_count + progress.pending_count + progress.revision_count, 0
  ) || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentGym.gym_name === 'OWNER ADMIN' ? 'Jayme' : 'Kim'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Gyms</p>
                <p className="text-2xl font-bold">{totalGyms}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Content Formats</p>
                <p className="text-2xl font-bold">{totalFormats}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-rose-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved Content</p>
                <p className="text-2xl font-bold">
                  {allProgress?.reduce((sum, progress) => sum + progress.completed_count, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gym List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Gym Network
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search gyms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                <div className="space-y-1 p-4">
                  {filteredGyms.map((gym) => {
                    const gymProgress = allProgress?.filter(p => p.gym_id === gym.id) || [];
                    const totalCompleted = gymProgress.reduce((sum, p) => sum + p.completed_count, 0);
                    const totalPending = gymProgress.reduce((sum, p) => sum + p.pending_count, 0);
                    const totalRevisions = gymProgress.reduce((sum, p) => sum + p.revision_count, 0);
                    const totalSubs = totalCompleted + totalPending + totalRevisions;
                    const progressPercentage = totalSubs > 0 ? Math.round((totalCompleted / totalSubs) * 100) : 0;

                    return (
                      <div
                        key={gym.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedGym === gym.id
                            ? 'border-rose-500 bg-rose-50'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedGym(gym.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-sm">{gym.gym_name}</h3>
                            <p className="text-xs text-muted-foreground">{gym.location}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {gym.id}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-1" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{totalCompleted} ✓</span>
                            <span>{totalPending} ⏳</span>
                            <span>{totalRevisions} 🔄</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Gym Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedGym ? (
                  <div className="flex items-center justify-between">
                    <span>Gym Details</span>
                    <Button size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Submissions
                    </Button>
                  </div>
                ) : (
                  'Select a gym to view details'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedGym ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Contact Information</h3>
                        <div className="space-y-1 text-sm">
                          <p><strong>Email:</strong> {mockGyms.find(g => g.id === selectedGym)?.contact_info.email}</p>
                          <p><strong>Phone:</strong> {mockGyms.find(g => g.id === selectedGym)?.contact_info.phone}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Quick Stats</h3>
                        <div className="space-y-1 text-sm">
                          <p>Total Submissions: {allProgress?.filter(p => p.gym_id === selectedGym).reduce((sum, p) => sum + p.completed_count + p.pending_count + p.revision_count, 0) || 0}</p>
                          <p>Approved: {allProgress?.filter(p => p.gym_id === selectedGym).reduce((sum, p) => sum + p.completed_count, 0) || 0}</p>
                          <p>Pending Review: {allProgress?.filter(p => p.gym_id === selectedGym).reduce((sum, p) => sum + p.pending_count, 0) || 0}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="submissions" className="space-y-4">
                    <p className="text-muted-foreground">Submission review interface would go here...</p>
                  </TabsContent>

                  <TabsContent value="progress" className="space-y-4">
                    <div className="space-y-4">
                      {contentFormats?.map(format => {
                        const progress = allProgress?.find(p => p.gym_id === selectedGym && p.format_id === format.id);
                        const completed = progress?.completed_count || 0;
                        const pending = progress?.pending_count || 0;
                        const revisions = progress?.revision_count || 0;
                        const total = completed + pending + revisions;
                        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                        return (
                          <div key={format.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">{format.title}</h4>
                              <Badge variant="outline">{format.total_required} target</Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{percentage}%</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{completed} completed</span>
                                <span>{pending} pending</span>
                                <span>{revisions} revisions</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a gym from the list to view detailed information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;