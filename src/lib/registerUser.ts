
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  isCompany: boolean;
}

export async function registerUser({ name, email, password, isCompany }: RegisterUserPayload) {
  // Validação forte para senha
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
  }

  try {
    // Etapa 1: criar usuário no Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (signUpError) throw new Error(signUpError.message);

    if (!signUpData?.user) throw new Error("Erro inesperado ao registrar usuário.");

    const userId = signUpData.user.id;

    // Importante: Fazer login imediatamente para obter um token válido para operações que exigem autenticação
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (signInError) {
      throw new Error("Erro ao autenticar após registro: " + signInError.message);
    }

    // Etapa 2: criar empresa se for company
    let companyId: string | undefined = undefined;
    if (isCompany) {
      // Como o usuário agora está autenticado, esta operação deve funcionar com a RLS policy
      const { data: companyInsert, error: companyError } = await supabase
        .from("companies")
        .insert([{ name, email, owner_id: userId }])
        .select("id")
        .single();

      if (companyError) {
        // Capturar o erro específico para diagnóstico
        console.error("Erro completo na criação da empresa:", companyError);
        throw new Error("Erro ao criar empresa: " + companyError.message);
      }

      companyId = companyInsert?.id;
    }

    // Etapa 3: atualizar profile com company_id (e papel 'admin' se company)
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ company_id: companyId, role: isCompany ? "admin" : "user" })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error("Erro completo na atualização do perfil:", profileUpdateError);
      throw new Error("Erro ao atualizar perfil: " + profileUpdateError.message);
    }

    return {
      user: signUpData.user,
      companyId
    };
  } catch (error: any) {
    // Exibir erro detalhado no console para diagnóstico
    console.error("Erro no processo de registro:", error);
    throw error;
  }
}
