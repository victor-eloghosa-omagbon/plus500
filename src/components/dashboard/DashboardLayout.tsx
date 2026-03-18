import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "./DashboardSidebar";
import MobileBottomNav from "./MobileBottomNav";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
const DashboardLayout = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", session.user.id)
        .single();
      setDisplayName(data?.display_name ?? session.user.email ?? null);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <WatchlistProvider>
      <div className="min-h-screen bg-surface flex">
        <DashboardSidebar displayName={displayName} />
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0 premium-scrollbar">
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </WatchlistProvider>
  );
};

export default DashboardLayout;
