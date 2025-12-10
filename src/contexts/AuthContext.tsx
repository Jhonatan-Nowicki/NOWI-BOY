import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '@/types';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  usuario: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<Usuario>) => Promise<void>;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  whatsapp: string;
  cidade: string;
  meta_mensal_lucro?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST (sync only!)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(() => {
            loadUserProfile(session.user);
          }, 0);
        } else {
          setUsuario(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      if (profile) {
        setUsuario({
          id: user.id,
          nome: profile.nome,
          email: profile.email,
          whatsapp: profile.whatsapp || '',
          cidade: profile.cidade || '',
          meta_mensal_lucro: profile.meta_mensal_lucro,
          data_cadastro: profile.created_at,
        });
      } else {
        // Profile doesn't exist yet, create a basic user object
        setUsuario({
          id: user.id,
          nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          whatsapp: user.user_metadata?.whatsapp || '',
          cidade: user.user_metadata?.cidade || '',
          meta_mensal_lucro: user.user_metadata?.meta_mensal_lucro || null,
          data_cadastro: user.created_at,
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      throw new Error(error.message);
    }
    // Don't set isLoading here - onAuthStateChange will handle it
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.senha,
      options: {
        data: {
          nome: data.nome,
          whatsapp: data.whatsapp,
          cidade: data.cidade,
          meta_mensal_lucro: data.meta_mensal_lucro,
        },
      },
    });

    if (signUpError) {
      setIsLoading(false);
      throw new Error(signUpError.message);
    }

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          nome: data.nome,
          email: data.email,
          whatsapp: data.whatsapp,
          cidade: data.cidade,
          meta_mensal_lucro: data.meta_mensal_lucro || null,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  const updateUser = async (data: Partial<Usuario>) => {
    if (!usuario) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        nome: data.nome,
        whatsapp: data.whatsapp,
        cidade: data.cidade,
        meta_mensal_lucro: data.meta_mensal_lucro,
      })
      .eq('user_id', usuario.id);

    if (error) {
      throw new Error(error.message);
    }

    setUsuario(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      isLoading,
      isAuthenticated: !!session && !!usuario,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
