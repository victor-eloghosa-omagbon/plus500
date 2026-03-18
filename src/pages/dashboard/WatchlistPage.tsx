import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { usePrices } from "@/contexts/PriceContext";

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { getPrice, getChange } = usePrices();
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <Star size={20} className="text-yellow-500 fill-yellow-500" />
        <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
      </div>

      {watchlist.length === 0 ? (
        <div className="bg-background rounded-xl border border-border p-12 text-center">
          <Star size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Your watchlist is empty</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add instruments from the Markets page</p>
        </div>
      ) : (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Instrument</span>
            <span className="text-right">Bid</span>
            <span className="text-right">Ask</span>
            <span className="text-right">Change</span>
            <span className="text-center">Trade</span>
            <span className="w-8" />
          </div>
          {watchlist.map((item) => {
            const price = getPrice(item.symbol);
            const change = getChange(item.symbol);
            const spreadNum = parseFloat(item.spread) || 0;
            const bid = price - spreadNum / 2;
            const ask = price + spreadNum / 2;

            return (
              <div key={item.symbol}>
                {/* Desktop row */}
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors items-center">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                  <p className="text-sm font-mono text-foreground text-right">
                    {bid < 10 ? bid.toFixed(4) : bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm font-mono text-foreground text-right">
                    {ask < 10 ? ask.toFixed(4) : ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className={cn("text-xs font-semibold text-right", change >= 0 ? "text-profit-green" : "text-loss-red")}>
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                  </p>
                  <Button
                    size="sm"
                    className="text-xs text-white"
                    style={{ backgroundColor: '#0a1f66' }}
                    onClick={() => navigate(`/dashboard/trade/${encodeURIComponent(item.symbol)}`)}
                  >
                    <ShoppingCart size={12} className="mr-1" /> Trade
                  </Button>
                  <button onClick={() => removeFromWatchlist(item.symbol)} className="p-1 rounded hover:bg-muted transition-colors">
                    <X size={16} className="text-muted-foreground hover:text-loss-red" />
                  </button>
                </div>

                {/* Mobile card */}
                <div className="sm:hidden border-b border-border last:border-0 px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs font-semibold", change >= 0 ? "text-profit-green" : "text-loss-red")}>
                        {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                      </span>
                      <button onClick={() => removeFromWatchlist(item.symbol)} className="p-1 rounded hover:bg-muted transition-colors">
                        <X size={14} className="text-muted-foreground hover:text-loss-red" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Bid: <span className="font-mono text-foreground">{bid < 10 ? bid.toFixed(4) : bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
                      <span>Ask: <span className="font-mono text-foreground">{ask < 10 ? ask.toFixed(4) : ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
                    </div>
                    <Button
                      size="sm"
                      className="text-xs text-white h-7 px-3"
                      style={{ backgroundColor: '#0a1f66' }}
                      onClick={() => navigate(`/dashboard/trade/${encodeURIComponent(item.symbol)}`)}
                    >
                      <ShoppingCart size={12} className="mr-1" /> Trade
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
