import { useState } from "react";
import { Search, Star, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { usePrices } from "@/contexts/PriceContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const categories = ["All", "Forex", "Crypto", "Stocks", "Commodities", "Indices"];

const MarketsPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { getPrice, getChange } = usePrices();

  const { data: instruments = [], isLoading } = useQuery({
    queryKey: ["market-instruments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_instruments")
        .select("symbol, name, category, spread")
        .eq("is_active", true)
        .order("category")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const filtered = instruments.filter((i) => {
    const matchCategory = activeCategory === "All" || i.category === activeCategory;
    const matchSearch = i.symbol.toLowerCase().includes(search.toLowerCase()) || i.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleToggle = (inst: typeof instruments[0]) => {
    toggleWatchlist({
      symbol: inst.symbol,
      name: inst.name,
      category: inst.category,
      spread: inst.spread,
    });
  };

  return (
    <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">Markets</h1>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search instruments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background border-border"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat ? "text-white shadow-md" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            style={activeCategory === cat ? { backgroundColor: '#0a1f66' } : undefined}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Instrument</span>
          <span className="text-right">Price</span>
          <span className="text-right">Change</span>
          <span className="text-right">Spread</span>
          <span className="w-8" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">No instruments found</div>
        ) : (
          filtered.map((inst) => {
            const price = getPrice(inst.symbol);
            const change = getChange(inst.symbol);
            return (
              <div
                key={inst.symbol}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{inst.symbol}</p>
                  <p className="text-xs text-muted-foreground">{inst.name}</p>
                </div>
                <p className="text-sm font-bold text-foreground text-right">
                  {price < 10 ? price.toFixed(4) : price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className={cn("flex items-center gap-1 text-xs font-semibold justify-end", change >= 0 ? "text-profit-green" : "text-loss-red")}>
                  {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground text-right">{inst.spread}</p>
                <button
                  onClick={() => handleToggle(inst)}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Star
                    size={16}
                    className={isInWatchlist(inst.symbol) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                  />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MarketsPage;
