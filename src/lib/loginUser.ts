
import { supabase } from "@/integrations/supabase/client";
import { hydrateUser } from "./hydrateUser";
import { toast } from "sonner";

export async function loginUser(email: string, password: string) {
  // Validação forte para senha - mesma regra do cadastro
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
  }

  console.log("Iniciando login no Supabase para o usuário:", email);
  
  // Tentativa de login no Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Erro de login:", error.message);
    throw new Error(error.message);
  }

  console.log("Login bem-sucedido, dados do usuário:", data);
  
  // Hidratar profile/company/configurações após login
  try {
    console.log("Iniciando hidratação de dados...");
    const hydration = await hydrateUser();
    console.log("Dados hidratados:", hydration);
    
    return { ...data, ...hydration };
  } catch (hydrationError) {
    console.error("Erro na hidratação:", hydrationError);
    toast.error("Login realizado, mas houve um erro ao carregar dados do perfil");
    return data;
  }
}
