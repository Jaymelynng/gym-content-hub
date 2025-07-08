import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Building2 } from 'lucide-react';

const Login = () => {
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, gymProfiles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) {
      toast({
        title: "PIN Required",
        description: "Please enter your PIN code to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const success = await login(pinCode.trim());
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to the assignment tracking system!",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid PIN code. Please check and try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleGymClick = (gym: any) => {
    setPinCode(gym.pin_code);
  };

  const regularGyms = gymProfiles.filter(gym => !['1426', '2222'].includes(gym.id));
  const adminGyms = gymProfiles.filter(gym => ['1426', '2222'].includes(gym.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Admin Panel */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Admin Access</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your admin PIN to manage all gym assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter Admin PIN"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="text-center text-lg"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Signing In...' : 'Admin Sign In'}
              </Button>
            </form>

            {adminGyms.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Admin Access</h3>
                <div className="space-y-2">
                  {adminGyms.map((gym) => (
                    <div
                      key={gym.id}
                      onClick={() => handleGymClick(gym)}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{gym.gym_name}</div>
                          <div className="text-sm text-muted-foreground">{gym.gym_location}</div>
                        </div>
                        <Badge variant="secondary">{gym.pin_code}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gym Selection */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Gym Access</CardTitle>
            <CardDescription className="text-muted-foreground">
              Select your gym or enter your assigned PIN code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter Gym PIN"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                  className="text-center text-lg"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                variant="outline"
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Signing In...' : 'Gym Sign In'}
              </Button>
            </form>

            {regularGyms.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Your Gym</h3>
                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                  {regularGyms.map((gym) => (
                    <div
                      key={gym.id}
                      onClick={() => handleGymClick(gym)}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{gym.gym_name}</div>
                          <div className="text-sm text-muted-foreground">{gym.gym_location}</div>
                        </div>
                        <Badge variant="outline">{gym.pin_code}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;