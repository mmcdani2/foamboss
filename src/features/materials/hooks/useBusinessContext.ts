import { useEffect, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { useSupabase } from "@/core/providers/SupabaseProvider";

/**
 * Loads the authenticated user and their associated business_id once.
 * Centralized context to prevent duplicate getUser() + select() calls.
 */
export function useBusinessContext() {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setUser(null);
          setBusinessId(null);
          return;
        }

        setUser(userData.user);

        // Get business_id from the users table
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("business_id")
          .eq("id", userData.user.id)
          .single();

        if (profileError) throw profileError;
        setBusinessId(profile?.business_id ?? null);
      } catch (err) {
        console.error("useBusinessContext error:", err);
        setBusinessId(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  return { user, businessId, loading };
}
