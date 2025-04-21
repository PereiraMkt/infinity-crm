
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { Company } from "@/types/company";

export async function hydrateUser() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) throw new Error("Usuário não autenticado!");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
    
  if (profileError) {
    console.error("Erro ao buscar perfil:", profileError);
    throw new Error("Erro ao buscar dados do usuário");
  }

  let company = null;
  if (profile?.company_id) {
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", profile.company_id)
      .single();
      
    if (!companyError) {
      company = companyData;
    } else {
      console.error("Erro ao buscar empresa:", companyError);
    }
  }

  // Adicione fetch para clients, leads, tasks aqui se necessário

  return {
    profile,
    company,
  };
}
