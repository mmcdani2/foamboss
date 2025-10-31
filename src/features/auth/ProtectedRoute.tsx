import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSupabase } from "@/core/providers/SupabaseProvider";

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
        .maybeSingle();

      if (error) console.error(error);

      // If no data, assume onboarding is needed
      if (!data || data.onboarding_complete === false) {
        setNeedsOnboarding(true);
      }

      setChecking(false);
    };

    checkOnboarding();
  }, [user, supabase]);

  if (loading || checking)
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;
  if (needsOnboarding) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}
