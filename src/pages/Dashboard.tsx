import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import AssetCard from "@/components/dashboard/AssetCard";
import TradePanel from "@/components/dashboard/TradePanel";
import { ASSETS } from "@/components/dashboard/assetsData";
import type { Asset } from "@/components/dashboard/AssetCard";

const categories = ["All", "Crypto", "Metals", "Energy", "Agriculture"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [activeCategory, setActiveCategory] = useState("All");
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

  const filteredAssets = activeCategory === "All"
    ? ASSETS
    : ASSETS.filter((a) => a.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <DashboardHeader displayName={displayName} />

      <main className="flex-1 px-4 sm:px-6 py-5 space-y-5 max-w-7xl mx-auto w-full">
        {/* Portfolio Summary */}
        <PortfolioSummary />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Asset List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Markets</h2>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  style={activeCategory === cat ? { backgroundColor: '#0a1f66' } : undefined}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  selected={selectedAsset.id === asset.id}
                  onSelect={setSelectedAsset}
                />
              ))}
            </div>
          </div>

          {/* Trade Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-5">
              <h2 className="text-lg font-bold text-foreground mb-4">Place Trade</h2>
              <TradePanel asset={selectedAsset} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
