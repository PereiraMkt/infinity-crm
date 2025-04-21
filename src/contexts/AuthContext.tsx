import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/loginUser";
import { hydrateUser } from "@/lib/hydrateUser";
import { toast } from "sonner";
import LoadingScreen from "@/components/ui/loading-screen";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  profile: any;
  company: any;
}

interface WeakPassword {
  message: string;
  suggestions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    session: Session | null;
    profile: any;
    company: any;
    loading: boolean;
  }>({
    user: null,
    session: null,
    profile: null,
    company: null,
    loading: true
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.info("Inicializando AuthContext");
    
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info("Evento de autenticação:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          try {
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              const hydrationResult = await hydrateUser();
              setState({
                user: session.user,
                session,
                profile: hydrationResult.profile,
                company: hydrationResult.company,
                loading: false
              });
            }, 0);
          } catch (error) {
            console.error("Erro na hidratação do usuário:", error);
            setState({
              user: session.user,
              session,
              profile: null,
              company: null,
              loading: false
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, session: null, profile: null, company: null, loading: false });
        navigate('/login', { replace: true });
      } else if (event === 'INITIAL_SESSION') {
        console.info("Sessão existente:", session);
        if (session) {
          try {
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              const hydrationResult = await hydrateUser();
              setState({
                user: session.user,
                session,
                profile: hydrationResult.profile,
                company: hydrationResult.company,
                loading: false
              });
            }, 0);
          } catch (error) {
            console.error("Erro na hidratação do usuário:", error);
            setState({
              user: session.user,
              session,
              profile: null,
              company: null,
              loading: false
            });
          }
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function signIn(email: string, password: string) {
    try {
      const { user, session } = await loginUser(email, password);
      
      if (user) {
        const hydrationResult = await hydrateUser();
        setState({
          user,
          session,
          profile: hydrationResult.profile,
          company: hydrationResult.company,
          loading: false
        });
        
        navigate('/app', { replace: true });
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signUp(email: string, password: string, name: string, isCompany: boolean) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            is_company: isCompany
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Conta criada com sucesso! Você será redirecionado para o dashboard.");
        navigate('/app', { replace: true });
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error instanceof AuthError) {
        if (error.message.includes("User already registered")) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        } else if (error.message.includes("Password should be")) {
          errorMessage = "A senha não atende aos requisitos de segurança.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Explicitly update state and navigate after signout
      setState({ user: null, session: null, profile: null, company: null, loading: false });
      toast.info("Sessão encerrada com sucesso");
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao encerrar sessão");
    }
  }

  const value = {
    user: state.user,
    session: state.session,
    loading: state.loading,
    signIn,
    signUp,
    signOut,
    profile: state.profile,
    company: state.company
  };

  if (state.loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
