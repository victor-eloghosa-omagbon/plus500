import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePrices } from "@/contexts/PriceContext";

interface ClosedTrade {
  id: string;
  symbol: string;
  order_type: string;
  amount: number;
  leverage: string;
  created_at: string;
  pl: number;
}

const HistoryPage = () => {
  const [trades, setTrades] = useState<ClosedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPrice } = usePrices();

  useEffect(() => {
    const fetchTrades = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "closed")
        .order("created_at", { ascending: false });

      if (!data) { setLoading(false); return; }

      const mapped: ClosedTrade[] = data.map((o: any) => {
        const current = getPrice(o.symbol) || o.amount;
        const entry = o.entry_price || current;
        const lev = parseInt(o.leverage.split(":")[1] || "1");
        const notional = o.amount * lev;
        const pl = o.order_type === "buy"
          ? ((current - entry) / entry) * notional
          : ((entry - current) / entry) * notional;
        return {
          id: o.id,
          symbol: o.symbol,
          order_type: o.order_type,
          amount: o.amount,
          leverage: o.leverage,
          created_at: o.created_at,
          pl: Math.round(pl * 100) / 100,
        };
      });

      setTrades(mapped);
      setLoading(false);
    };
    fetchTrades();
  }, [getPrice]);

  const totalPL = trades.reduce((sum, t) => sum + t.pl, 0);
  const wins = trades.filter((t) => t.pl > 0).length;
  const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(0) : "0";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">Portfolio History</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Trades</p>
          <p className="text-xl font-bold text-foreground mt-1">{trades.length}</p>
        </div>
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Win Rate</p>
          <p className={cn("text-xl font-bold mt-1", parseInt(winRate) >= 50 ? "text-profit-green" : "text-loss-red")}>{winRate}%</p>
        </div>
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total P/L</p>
          <p className={cn("text-xl font-bold mt-1", totalPL >= 0 ? "text-profit-green" : "text-loss-red")}>
            {totalPL >= 0 ? "+" : ""}${totalPL.toFixed(2)}
          </p>
        </div>
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Winning Trades</p>
          <p className="text-xl font-bold text-foreground mt-1">{wins} / {trades.length}</p>
        </div>
      </div>

      {trades.length === 0 ? (
        <div className="bg-background rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No closed trades yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Close a position to see it here</p>
        </div>
      ) : (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          {/* Desktop table */}
          <table className="hidden sm:table w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Instrument</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-right px-4 py-3">Leverage</th>
                <th className="text-right px-4 py-3">P/L</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(trade.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{trade.symbol}</td>
                  <td className={cn("px-4 py-3 font-semibold capitalize", trade.order_type === "buy" ? "text-profit-green" : "text-loss-red")}>{trade.order_type}</td>
                  <td className="px-4 py-3 text-right text-foreground">${trade.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{trade.leverage}</td>
                  <td className={cn("px-4 py-3 text-right font-bold", trade.pl >= 0 ? "text-profit-green" : "text-loss-red")}>
                    {trade.pl >= 0 ? "+" : ""}${trade.pl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-border">
            {trades.map((trade) => (
              <div key={trade.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{trade.symbol}</span>
                    <span className={cn("text-xs font-semibold capitalize px-1.5 py-0.5 rounded", trade.order_type === "buy" ? "text-profit-green bg-profit-green/10" : "text-loss-red bg-loss-red/10")}>{trade.order_type}</span>
                  </div>
                  <span className={cn("text-sm font-bold", trade.pl >= 0 ? "text-profit-green" : "text-loss-red")}>
                    {trade.pl >= 0 ? "+" : ""}${trade.pl.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(trade.created_at).toLocaleDateString()}</span>
                  <span>${trade.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} · {trade.leverage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
