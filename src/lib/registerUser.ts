
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

  try {
    // Etapa 2: criar empresa se for company
    let companyId: string | undefined = undefined;
    if (isCompany) {
      const { data: companyInsert, error: companyError } = await supabase
        .from("companies")
        .insert([{ name, email, owner_id: userId }])
        .select("id")
        .single();

      if (companyError) {
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
      throw new Error("Erro ao atualizar perfil: " + profileUpdateError.message);
    }

    return {
      user: signUpData.user,
      companyId
    };
  } catch (error: any) {
    // Se tiver erro, já não vamos tentar fazer rollback do usuário Auth
    // já que o usuário poderá tentar novamente o fluxo com o mesmo email
    // e o sistema vai apenas atualizar o profile/company
    console.error("Erro no processo de registro:", error);
    throw error;
  }
}
