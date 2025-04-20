
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast: toastNotification } = useToast();

  useEffect(() => {
    // Configurar listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Verificar se já existe uma sessão ativa
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Login realizado com sucesso!');
      navigate('/app');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      
      // Mapeamento de mensagens de erro amigáveis
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
      }
      
      toastNotification({
        title: 'Erro de autenticação',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    try {
      // Cria o usuário no Supabase Auth
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Se for uma empresa, criar registro na tabela companies
      if (isCompany && data?.user) {
        const { error: companyError } = await supabase.from('companies').insert({
          name,
          email,
          owner_id: data.user.id
        });
        
        if (companyError) throw companyError;
        
        // Atualizar o perfil do usuário com o ID da empresa
        const { data: companyData } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', data.user.id)
          .single();
          
        if (companyData) {
          await supabase
            .from('profiles')
            .update({ company_id: companyData.id, role: 'admin' })
            .eq('id', data.user.id);
        }
      }
      
      toast.success('Cadastro realizado com sucesso!');
      navigate('/app');
    } catch (error: any) {
      console.error('Erro ao criar conta:', error.message);
      
      // Mapeamento de mensagens de erro amigáveis
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (error.message.includes('Email format is invalid')) {
        errorMessage = 'O formato do email é inválido.';
      }
      
      toastNotification({
        title: 'Erro no cadastro',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.info('Você saiu do sistema');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
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
