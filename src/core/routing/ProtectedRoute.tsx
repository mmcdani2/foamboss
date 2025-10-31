import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSupabase } from "@/core/providers/SupabaseProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function ProtectedRoute() {
  const { user, loading, supabase } = useSupabase();
  const [checking, setChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("onboarding_complete")
        .eq("id", user.id)
        .single();

      if (error) console.error(error);
      setNeedsOnboarding(!data?.onboarding_complete);
      setChecking(false);
    };

    if (user) checkOnboarding();
  }, [user, supabase]);

  if (loading || checking) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;
  if (needsOnboarding) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}
