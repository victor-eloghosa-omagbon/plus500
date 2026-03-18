import { LineChart } from "lucide-react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { usePrices } from "@/contexts/PriceContext";
import { useNavigate } from "react-router-dom";
import PriceChart from "@/components/dashboard/PriceChart";
import { cn } from "@/lib/utils";

const ChartsPage = () => {
  const { watchlist, loading } = useWatchlist();
  const { getPrice, getChange } = usePrices();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <LineChart size={20} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Charts</h1>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-background rounded-xl border border-border p-12 text-center">
          <LineChart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No charts to display</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Add instruments to your watchlist from the Markets page
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {watchlist.map((item) => {
            const price = getPrice(item.symbol);
            const change = getChange(item.symbol);
            return (
              <div
                key={item.symbol}
                className="bg-background rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/dashboard/trade/${encodeURIComponent(item.symbol)}`)}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.symbol}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold text-foreground">
                      {price < 10 ? price.toFixed(4) : price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className={cn("text-xs font-semibold", change >= 0 ? "text-profit-green" : "text-loss-red")}>
                      {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="p-2">
                  <PriceChart symbol={item.symbol} basePrice={price} change={change} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChartsPage;
