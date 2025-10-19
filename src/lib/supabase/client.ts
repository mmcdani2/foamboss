import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, hasSupabaseConfig } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

const ensureClient = (): SupabaseClient => {
  if (browserClient) return browserClient;
  if (!hasSupabaseConfig()) {
    throw new Error(
      "Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }

  browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
};

export const getSupabaseClient = ensureClient;
