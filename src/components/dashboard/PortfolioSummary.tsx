import { DollarSign, Activity, ChevronDown, ChevronUp, Wallet, BarChart3, PiggyBank } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { usePrices } from "@/contexts/PriceContext";
import { useHeldAssets } from "@/hooks/useHeldAssets";
import AssetsCard from "./AssetsCard";

const PortfolioSummary = () => {
  const [openCount, setOpenCount] = useState(0);
  const [unrealizedPL, setUnrealizedPL] = useState(0);
  const [balance, setBalance] = useState(0);
  const [positionsValue, setPositionsValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const location = useLocation();
  const { getPrice } = usePrices();
  const { getTotalValue } = useHeldAssets();

  const assetsValue = Math.round(getTotalValue() * 100) / 100;

  const fetchStats = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    const uid = session.user.id;

    const [profileRes, ordersRes] = await Promise.all([
      supabase.from("profiles").select("balance").eq("user_id", uid).single(),
      supabase.from("orders").select("*").eq("user_id", uid),
    ]);

    const userBalance = (profileRes.data as any)?.balance ?? 0;
    setBalance(userBalance);

    const orders = ordersRes.data || [];
    const filled = orders.filter((o: any) => o.status === "filled");

    setOpenCount(filled.length);

    let totalPL = 0;
    let totalMarketValue = 0;
    filled.forEach((o: any) => {
      const currentPrice = getPrice(o.symbol) || 0;
      const entryPrice = o.entry_price || currentPrice;
      const lev = parseInt(o.leverage.split(":")[1] || "1");
      const notional = o.amount * lev;
      const pl = o.order_type === "buy"
        ? ((currentPrice - entryPrice) / entryPrice) * notional
        : ((entryPrice - currentPrice) / entryPrice) * notional;
      totalPL += pl;
      totalMarketValue += o.amount + pl;
    });
    setUnrealizedPL(Math.round(totalPL * 100) / 100);
    setPositionsValue(Math.round(totalMarketValue * 100) / 100);

    setLoading(false);
  }, [getPrice]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, location.pathname]);

  useEffect(() => {
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const portfolioValue = Math.round((balance + positionsValue + assetsValue) * 100) / 100;

  const stats = [
    {
      label: "Balance",
      value: loading ? "—" : `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: null,
      positive: true,
    },
    {
      label: "Open Positions",
      value: loading ? "—" : `${openCount}`,
      icon: Activity,
      change: null,
      positive: true,
    },
  ];

  const fmt = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Portfolio Value card with breakdown */}
      <div
        className="bg-background rounded-xl border border-border p-4 flex flex-col gap-1 shadow-sm cursor-pointer select-none transition-colors hover:bg-muted/30"
        onClick={() => setShowBreakdown(!showBreakdown)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign size={14} />
            <span className="text-xs font-medium uppercase tracking-wider">Portfolio Value</span>
          </div>
          {showBreakdown ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
        <p className={cn(
          "text-lg sm:text-xl font-bold",
          unrealizedPL !== 0 ? (unrealizedPL >= 0 ? "text-profit-green" : "text-loss-red") : "text-foreground"
        )}>
          {loading ? "—" : fmt(portfolioValue)}
        </p>
        {unrealizedPL !== 0 && (
          <span className={cn("text-xs font-semibold", unrealizedPL >= 0 ? "text-profit-green" : "text-loss-red")}>
            {unrealizedPL >= 0 ? "+" : ""}{fmt(unrealizedPL)} unrealized
          </span>
        )}
        {showBreakdown && !loading && (
          <div className="mt-2 pt-2 border-t border-border space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Wallet size={12} /> Cash Balance
              </span>
              <span className="font-medium text-foreground">{fmt(balance)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <BarChart3 size={12} /> Open Positions
              </span>
              <span className="font-medium text-foreground">{fmt(positionsValue)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <PiggyBank size={12} /> Held Assets
              </span>
              <span className="font-medium text-foreground">{fmt(assetsValue)}</span>
            </div>
          </div>
        )}
      </div>

      {stats.map((s) => (
        <div key={s.label} className="bg-background rounded-xl border border-border p-4 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <s.icon size={14} />
            <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">{s.value}</p>
        </div>
      ))}
      <AssetsCard />
    </div>
  );
};

export default PortfolioSummary;
