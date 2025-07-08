import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Camera, 
  Video, 
  Image, 
  Clock, 
  Zap,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock as ClockIcon
} from 'lucide-react';

interface FormatSubmission {
  id: string;
  format_id: string;
  gym_id: string;
  gym_name: string;
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

interface ContentFormat {
  id: string;
  format_key: string;
  title: string;
  description: string;
  format_type: 'photo' | 'video' | 'carousel' | 'story' | 'animated';
  dimensions: string;
  duration: string;
  total_required: number;
  icon: React.ReactNode;
}

const formatIcons = {
  'static-photo': <Camera className="h-5 w-5" />,
  'carousel-images': <Image className="h-5 w-5" />,
  'video-reel': <Video className="h-5 w-5" />,
  'story': <Clock className="h-5 w-5" />,
  'animated-image': <Zap className="h-5 w-5" />,
};

const formatColors = {
  'static-photo': 'bg-rose-50 border-rose-200',
  'carousel-images': 'bg-pink-50 border-pink-200',
  'video-reel': 'bg-purple-50 border-purple-200',
  'story': 'bg-indigo-50 border-indigo-200',
  'animated-image': 'bg-amber-50 border-amber-200',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  needs_revision: 'bg-orange-100 text-orange-800 border-orange-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  pending: <ClockIcon className="h-4 w-4" />,
  approved: <CheckCircle className="h-4 w-4" />,
  needs_revision: <AlertTriangle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
};

interface ContentFormatManagerProps {
  submissions: FormatSubmission[];
  loading: boolean;
}

export function ContentFormatManager({ submissions, loading }: ContentFormatManagerProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gymFilter, setGymFilter] = useState<string>('all');

  // Get unique formats from submissions
  const formats = Array.from(new Set(submissions.map(s => s.format_id))).map(formatId => ({
    id: formatId,
    format_key: formatId,
    title: formatId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: `Content submissions for ${formatId}`,
    format_type: formatId.includes('photo') ? 'photo' : 
                 formatId.includes('video') ? 'video' : 
                 formatId.includes('carousel') ? 'carousel' : 
                 formatId.includes('story') ? 'story' : 'animated',
    dimensions: formatId.includes('photo') ? '1080x1080' : 
                formatId.includes('video') ? '1080x1920' : '1080x1080',
    duration: formatId.includes('video') ? '15-60s' : 
              formatId.includes('story') ? '1-15s' : 'N/A',
    total_required: 12,
    icon: formatIcons[formatId as keyof typeof formatIcons] || <Camera className="h-5 w-5" />,
  }));

  // Get unique gyms
  const gyms = Array.from(new Set(submissions.map(s => s.gym_name)));

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesFormat = selectedFormat === 'all' || submission.format_id === selectedFormat;
    const matchesSearch = submission.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.gym_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesGym = gymFilter === 'all' || submission.gym_name === gymFilter;
    
    return matchesFormat && matchesSearch && matchesStatus && matchesGym;
  });

  const getStatusCount = (status: string) => {
    return submissions.filter(s => s.status === status).length;
  };

  const getFormatStats = (formatId: string) => {
    const formatSubmissions = submissions.filter(s => s.format_id === formatId);
    return {
      total: formatSubmissions.length,
      pending: formatSubmissions.filter(s => s.status === 'pending').length,
      approved: formatSubmissions.filter(s => s.status === 'approved').length,
      needs_revision: formatSubmissions.filter(s => s.status === 'needs_revision').length,
      rejected: formatSubmissions.filter(s => s.status === 'rejected').length,
    };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading submissions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Format Management</h2>
          <p className="text-muted-foreground">Review and manage all content submissions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold mt-1">{getStatusCount('pending')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <div className="text-2xl font-bold mt-1">{getStatusCount('approved')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Needs Revision</span>
            </div>
            <div className="text-2xl font-bold mt-1">{getStatusCount('needs_revision')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
            <div className="text-2xl font-bold mt-1">{getStatusCount('rejected')}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">All Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Format Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formats.map((format) => {
              const stats = getFormatStats(format.id);
              return (
                <Card key={format.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formatColors[format.format_key as keyof typeof formatColors]}`}>
                        {format.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{format.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{format.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {format.dimensions}
                        </Badge>
                        {format.duration !== 'N/A' && (
                          <Badge variant="outline" className="text-xs">
                            {format.duration}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-medium ml-1">{stats.total}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Approved:</span>
                          <span className="font-medium ml-1 text-green-600">{stats.approved}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pending:</span>
                          <span className="font-medium ml-1 text-yellow-600">{stats.pending}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revision:</span>
                          <span className="font-medium ml-1 text-orange-600">{stats.needs_revision}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    {formats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="needs_revision">Needs Revision</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={gymFilter} onValueChange={setGymFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by gym" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Gyms</SelectItem>
                    {gyms.map((gym) => (
                      <SelectItem key={gym} value={gym}>
                        {gym}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${formatColors[submission.format_id as keyof typeof formatColors]}`}>
                          {formatIcons[submission.format_id as keyof typeof formatIcons]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{submission.file_name}</p>
                          <p className="text-sm text-muted-foreground">{submission.gym_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(submission.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${statusColors[submission.status]}`}
                        >
                          {statusIcons[submission.status]}
                          <span className="ml-1 capitalize">{submission.status.replace('_', ' ')}</span>
                        </Badge>
                        
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredSubmissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No submissions found matching your filters.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}