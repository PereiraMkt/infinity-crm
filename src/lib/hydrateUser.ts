
import { supabase } from "@/integrations/supabase/client";

export async function hydrateUser() {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) throw new Error("Usuário não autenticado!");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  const { data: company } = profile?.company_id
    ? await supabase.from("companies").select("*").eq("id", profile.company_id).single()
    : { data: null };

  // Adicione fetch para clients, leads, tasks aqui se necessário

  return {
    profile,
    company,
  };
}
