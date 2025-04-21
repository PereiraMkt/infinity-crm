
import { supabase } from "@/integrations/supabase/client";
import { hydrateUser } from "./hydrateUser";

export async function loginUser(email: string, password: string) {
  // Validação forte para senha - mesma regra do cadastro
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
  }

  // Tentativa de login no Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // Hidratar profile/company/configurações após login
  const hydration = await hydrateUser();
  
  console.log("Login bem-sucedido, dados do usuário:", data);
  console.log("Dados hidratados:", hydration);
  
  return { ...data, ...hydration };
}
