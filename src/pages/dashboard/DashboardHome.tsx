import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import AssetCard from "@/components/dashboard/AssetCard";
import TradePanel from "@/components/dashboard/TradePanel";
import { ASSETS } from "@/components/dashboard/assetsData";
import { usePrices } from "@/contexts/PriceContext";
import type { Asset } from "@/components/dashboard/AssetCard";

const categories = ["All", "Crypto", "Metals", "Energy", "Agriculture"];

const CRYPTO_IDS = ["btc", "eth"];

const DashboardHome = () => {
  const navigate = useNavigate();
  const { getPrice, getChange } = usePrices();

  // Hydrate assets with live prices
  const liveAssets = useMemo(() => {
    return ASSETS.map((a) => ({
      ...a,
      price: getPrice(a.symbol) || a.price,
      change: getChange(a.symbol) ?? a.change,
    }));
  }, [getPrice, getChange]);

  const [selectedAsset, setSelectedAsset] = useState<Asset>(liveAssets[0]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Keep selected asset prices live
  const liveSelectedAsset = useMemo(() => {
    const found = liveAssets.find((a) => a.id === selectedAsset.id);
    return found || selectedAsset;
  }, [liveAssets, selectedAsset]);

  const handleAssetSelect = (asset: Asset) => {
    if (CRYPTO_IDS.includes(asset.id)) {
      navigate(`/dashboard/buy/${asset.id}`);
    } else {
      setSelectedAsset(asset);
    }
  };

  const filteredAssets = activeCategory === "All"
    ? liveAssets
    : liveAssets.filter((a) => a.category === activeCategory);

  return (
    <div className="px-4 sm:px-6 py-5 space-y-5 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-foreground">Hello 👋</h1>
      <PortfolioSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Markets</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selected={liveSelectedAsset.id === asset.id}
                onSelect={handleAssetSelect}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-5">
            <h2 className="text-lg font-bold text-foreground mb-4">Place Trade</h2>
            <TradePanel asset={liveSelectedAsset} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
