
import { supabase } from "@/integrations/supabase/client";
import { hydrateUser } from "./hydrateUser";

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // Hidratar profile/company/configurações após login
  const hydration = await hydrateUser();
  return { ...data, ...hydration };
}
