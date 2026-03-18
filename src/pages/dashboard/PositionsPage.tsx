import { X, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOrders } from "@/hooks/useOrders";
import { usePrices } from "@/contexts/PriceContext";

const PositionsPage = () => {
  const { orders, loading, closePosition } = useOrders();
  const { getPrice } = usePrices();
  const navigate = useNavigate();

  const filled = orders.filter((o) => o.status === "filled");

  const positions = filled.map((o) => {
    const currentPrice = getPrice(o.symbol) || o.amount;
    const entryPrice = o.entry_price || currentPrice;
    const lev = parseInt(o.leverage.split(":")[1] || "1");
    const notional = o.amount * lev;
    const pl = o.order_type === "buy"
      ? ((currentPrice - entryPrice) / entryPrice) * notional
      : ((entryPrice - currentPrice) / entryPrice) * notional;
    return {
      id: o.id,
      symbol: o.symbol,
      order_type: o.order_type,
      amount: o.amount,
      leverage: o.leverage,
      entry_price: entryPrice,
      current_price: currentPrice,
      pl: Math.round(pl * 100) / 100,
      margin: Math.round(o.amount * 100) / 100,
    };
  });

  const totalPL = positions.reduce((sum, p) => sum + p.pl, 0);
  const totalMargin = positions.reduce((sum, p) => sum + p.margin, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">Open Positions</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Open Trades</p>
          <p className="text-xl font-bold text-foreground mt-1">{positions.length}</p>
        </div>
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Margin</p>
          <p className="text-xl font-bold text-foreground mt-1">${totalMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-background rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Unrealized P/L</p>
          <p className={cn("text-xl font-bold mt-1", totalPL >= 0 ? "text-profit-green" : "text-loss-red")}>
            {totalPL >= 0 ? "+" : ""}${totalPL.toFixed(2)}
          </p>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="bg-background rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No open positions</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Place a trade to see it here</p>
        </div>
      ) : (
        <div className="bg-background rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="text-left px-4 py-3">Instrument</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-right px-4 py-3">Leverage</th>
                <th className="text-right px-4 py-3">Entry</th>
                <th className="text-right px-4 py-3">Current</th>
                <th className="text-right px-4 py-3">P/L</th>
                <th className="text-center px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <tr
                  key={pos.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/trade/${encodeURIComponent(pos.symbol)}`)}
                >
                  <td className="px-4 py-3 font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      {pos.symbol}
                      <ExternalLink size={12} className="text-muted-foreground" />
                    </span>
                  </td>
                  <td className={cn("px-4 py-3 font-semibold capitalize", pos.order_type === "buy" ? "text-profit-green" : "text-loss-red")}>{pos.order_type}</td>
                  <td className="px-4 py-3 text-right text-foreground">${pos.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{pos.leverage}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">${pos.entry_price < 10 ? pos.entry_price.toFixed(4) : pos.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">${pos.current_price < 10 ? pos.current_price.toFixed(4) : pos.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className={cn("px-4 py-3 text-right font-bold", pos.pl >= 0 ? "text-profit-green" : "text-loss-red")}>
                    {pos.pl >= 0 ? "+" : ""}${pos.pl.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        closePosition(pos.id);
                      }}
                      className="text-xs"
                    >
                      <X size={12} className="mr-1" /> Close
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PositionsPage;
