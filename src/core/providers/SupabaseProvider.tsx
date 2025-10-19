import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";

const SupabaseContext = createContext<SupabaseClient | undefined>(undefined);

interface SupabaseProviderProps {
  children: ReactNode;
  client?: SupabaseClient;
}

export const SupabaseProvider = ({ children, client }: SupabaseProviderProps) => {
  const value = useMemo(() => {
    if (client) return client;
    try {
      return getSupabaseClient();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[SupabaseProvider] Supabase client unavailable:", error);
      }
      return undefined;
    }
  }, [client]);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): SupabaseClient => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error(
      "Supabase client is not configured. Wrap your component tree with SupabaseProvider and set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY."
    );
  }
  return context;
};

export const useSupabaseOptional = (): SupabaseClient | null =>
  useContext(SupabaseContext) ?? null;
