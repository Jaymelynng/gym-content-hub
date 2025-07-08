import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

const Login = () => {
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
        description: "Welcome to the content library!",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Content Library</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your PIN code to access your assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your PIN code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                className="text-center text-lg h-12"
                disabled={loading}
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;