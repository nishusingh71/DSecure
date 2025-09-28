import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, profileService, Profile } from '../services/supabaseService';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange is called on initial load and whenever the auth state changes.
    // This single listener handles everything.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        try {
          const userProfile = await profileService.getProfile(currentUser.id);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      // The first time this runs, the initial session is loaded. We can now stop loading.
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      return false;
    }
    toast.success('Successfully logged in!');
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
    
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      toast.error('Registration failed: This email address is already in use.');
      return false;
    }

    toast.success('Account created! Please check your email to verify your account.');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  const value = {
    session,
    user,
    profile,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  // Render a loading screen while the initial session is being fetched.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
