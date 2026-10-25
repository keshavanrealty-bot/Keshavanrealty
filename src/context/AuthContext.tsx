import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpAdmin: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if current user is an admin in public.admin_profiles
  const checkAdminProfile = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser) {
      setIsAdmin(false);
      return false;
    }

    try {
      // 1. Direct query to admin_profiles
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('role')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data && (data.role === 'super_admin' || data.role === 'admin')) {
        setIsAdmin(true);
        return true;
      }

      // 2. Fallback check for designated business administrator accounts
      const adminEmails = [
        'keshavanrealty@gmail.com',
        'admin@keshavanrealty.com',
        'prathameshnagargoje0192@gmail.com',
      ];

      if (currentUser.email && adminEmails.includes(currentUser.email.toLowerCase())) {
        // Automatically ensure admin_profile exists for authorized administrator email
        await supabase.from('admin_profiles').upsert({
          id: currentUser.id,
          email: currentUser.email,
          role: 'super_admin',
        });
        setIsAdmin(true);
        return true;
      }

      setIsAdmin(false);
      return false;
    } catch {
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminProfile(session.user);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error };
    }
    if (data.user) {
      const isAuthorized = await checkAdminProfile(data.user);
      if (!isAuthorized) {
        await supabase.auth.signOut();
        setIsAdmin(false);
        setUser(null);
        setSession(null);
        return {
          error: new Error(
            'Access denied: Your account is authenticated, but does not have administrator privileges.'
          ),
        };
      }
    }
    return { error: null };
  };

  const signUpAdmin = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error && data.user) {
      // Insert into admin_profiles
      await supabase.from('admin_profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: 'admin',
      });
      await checkAdminProfile(data.user);
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const refreshAdminStatus = async () => {
    if (user) {
      await checkAdminProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signUpAdmin,
        signOut,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
