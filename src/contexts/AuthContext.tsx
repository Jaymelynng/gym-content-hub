import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GymProfile {
  id: string;
  gym_name: string;
  gym_location: string;
  pin_code: string;
  contact_email?: string;
  contact_phone?: string;
  active: boolean;
}

interface AuthContextType {
  currentGym: GymProfile | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  gymProfiles: GymProfile[];
  login: (pinCode: string) => Promise<boolean>;
  logout: () => void;
  setSupabaseContext: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentGym, setCurrentGym] = useState<GymProfile | null>(null);
  const [gymProfiles, setGymProfiles] = useState<GymProfile[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAdmin = currentGym?.id === '1426' || currentGym?.id === '2222';

  const setSupabaseContext = async () => {
    if (currentGym) {
      // Set the gym context for Supabase RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: currentGym.id,
        is_local: true
      });
    }
  };

  const login = async (pinCode: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('gym_profiles')
        .select('*')
        .eq('pin_code', pinCode)
        .eq('active', true)
        .single();

      if (error || !data) {
        return false;
      }

      setCurrentGym(data);
      setIsAuthenticated(true);
      localStorage.setItem('currentGym', JSON.stringify(data));

      // Set Supabase context
      await supabase.rpc('set_config', {
        setting_name: 'app.current_gym_id',
        setting_value: data.id,
        is_local: true
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentGym(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentGym');
  };

  const loadGymProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('gym_profiles')
        .select('*')
        .eq('active', true)
        .order('gym_name');

      if (error) {
        console.error('Error loading gym profiles:', error);
        return;
      }

      setGymProfiles(data || []);
    } catch (error) {
      console.error('Error loading gym profiles:', error);
    }
  };

  useEffect(() => {
    // Check for stored session
    const storedGym = localStorage.getItem('currentGym');
    if (storedGym) {
      try {
        const gym = JSON.parse(storedGym);
        setCurrentGym(gym);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored gym:', error);
        localStorage.removeItem('currentGym');
      }
    }

    loadGymProfiles();
  }, []);

  useEffect(() => {
    if (currentGym) {
      setSupabaseContext();
    }
  }, [currentGym]);

  return (
    <AuthContext.Provider
      value={{
        currentGym,
        isAdmin,
        isAuthenticated,
        gymProfiles,
        login,
        logout,
        setSupabaseContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};