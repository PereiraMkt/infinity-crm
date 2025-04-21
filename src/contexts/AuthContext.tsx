
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { registerUser } from "@/lib/registerUser";
import { loginUser } from "@/lib/loginUser";
import { hydrateUser } from "@/lib/hydrateUser";
import { UserProfile } from '@/types/user';
import { Company } from '@/types/company';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  company: Company | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast: toastNotification } = useToast();

  // Função para buscar dados de perfil e empresa
  const fetchUserData = async (userId: string) => {
    try {
      console.log("Buscando dados do usuário:", userId);
      const result = await hydrateUser();
      
      if (result.profile) {
        console.log("Perfil encontrado:", result.profile);
        setProfile(result.profile);
      }
      
      if (result.company) {
        console.log("Empresa encontrada:", result.company);
        setCompany(result.company);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  useEffect(() => {
    console.log("Inicializando AuthContext");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Evento de autenticação:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Use setTimeout to avoid deadlock with Supabase client
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserData(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setCompany(null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Check if on login or register page, redirect to app
          const path = window.location.pathname;
          if (path === '/login' || path === '/register') {
            navigate('/app');
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Sessão existente:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Iniciando tentativa de login...");
      const result = await loginUser(email, password);
      
      if (result.profile) setProfile(result.profile);
      if (result.company) setCompany(result.company);
      
      toast.success('Login realizado com sucesso!');
      await new Promise((resolve) => setTimeout(resolve, 900)); // Breve delay visual
      navigate('/app');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
      } else if (error.message.includes('A senha deve conter')) {
        errorMessage = error.message;
      }
      
      toastNotification({
        title: 'Erro de autenticação',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    setLoading(true);
    try {
      console.log("Iniciando processo de registro...");
      // Registrar o usuário
      const result = await registerUser({ name, email, password, isCompany });
      console.log("Registro concluído, resultado:", result);
      
      // Buscar dados do usuário após registro bem-sucedido
      if (result.user) {
        // Buscar dados do perfil e empresa
        const userData = await hydrateUser();
        if (userData.profile) setProfile(userData.profile);
        if (userData.company) setCompany(userData.company);
      }
      
      toast.success('Cadastro realizado com sucesso!');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/app');
    } catch (error: any) {
      console.error('Erro ao criar conta:', error.message);
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.message.includes('Email format is invalid')) {
        errorMessage = 'O formato do email é inválido.';
      } else {
        errorMessage = error.message;
      }
      
      toastNotification({
        title: 'Erro no cadastro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setCompany(null);
    toast.info('Você saiu do sistema');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      company, 
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
