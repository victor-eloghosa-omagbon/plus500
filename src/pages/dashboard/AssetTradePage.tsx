import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, Brain, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PriceChart from "@/components/dashboard/PriceChart";
import ReactMarkdown from "react-markdown";
import { useOrders } from "@/hooks/useOrders";
import { usePrices } from "@/contexts/PriceContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const leverageOptions = ["1:10", "1:20", "1:50", "1:100", "1:200"];
const orderModes = ["Market", "Limit", "Stop"];

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-asset`;

const AssetTradePage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(symbol || "");
  const { getPrice, getChange } = usePrices();
  const { orders, placeOrder, closePosition } = useOrders();

  // Fetch instrument from database
  const { data: asset, isLoading: assetLoading } = useQuery({
    queryKey: ["instrument", decoded],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_instruments")
        .select("symbol, name, category, spread")
        .eq("symbol", decoded)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!decoded,
  });

  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderMode, setOrderMode] = useState("Market");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("1:100");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  // AI analysis state
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  // Get live price
  const livePrice = asset ? (getPrice(asset.symbol) || 0) : 0;
  const liveChange = asset ? (getChange(asset.symbol) || 0) : 0;

  // Compute bid/ask from spread
  const spreadNum = asset ? parseFloat(asset.spread) || 0 : 0;
  const bid = livePrice - spreadNum / 2;
  const ask = livePrice + spreadNum / 2;

  // Find open positions for this asset
  const openPositions = orders
    .filter((o) => o.status === "filled" && o.symbol === decoded)
    .map((o) => {
      const currentPrice = getPrice(o.symbol) || o.amount;
      const entryPrice = o.entry_price || currentPrice;
      const lev = parseInt(o.leverage.split(":")[1] || "1");
      const notional = o.amount * lev;
      const pl = o.order_type === "buy"
        ? ((currentPrice - entryPrice) / entryPrice) * notional
        : ((entryPrice - currentPrice) / entryPrice) * notional;
      return {
        id: o.id,
        order_type: o.order_type,
        amount: o.amount,
        leverage: o.leverage,
        entry_price: entryPrice,
        current_price: currentPrice,
        pl: Math.round(pl * 100) / 100,
        created_at: o.created_at,
        take_profit: o.take_profit,
        stop_loss: o.stop_loss,
      };
    });

  const runAnalysis = useCallback(async () => {
    if (!asset) return;
    setAnalyzing(true);
    setAnalysis("");

    try {
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ symbol: asset.symbol, name: asset.name, price: livePrice, change: liveChange }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({}));
        toast.error((err as any).error || "AI analysis failed");
        setAnalyzing(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              full += content;
              setAnalysis(full);
            }
          } catch { /* partial */ }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to connect to AI analysis");
    } finally {
      setAnalyzing(false);
    }
  }, [asset, livePrice, liveChange]);

  useEffect(() => {
    if (asset) runAnalysis();
  }, [asset?.symbol]);

  if (assetLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Instrument not found.</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft size={16} className="mr-2" /> Go back
        </Button>
      </div>
    );
  }

  const formatPrice = (p: number) =>
    p < 10 ? p.toFixed(4) : p.toLocaleString(undefined, { minimumFractionDigits: 2 });

  const handlePlaceOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const success = await placeOrder({
      symbol: asset.symbol,
      name: asset.name,
      order_type: orderType,
      order_mode: orderMode,
      amount: parseFloat(amount),
      leverage,
      take_profit: takeProfit ? parseFloat(takeProfit) : null,
      stop_loss: stopLoss ? parseFloat(stopLoss) : null,
      trigger_price: limitPrice ? parseFloat(limitPrice) : null,
    });
    if (success) {
      setAmount("");
      setTakeProfit("");
      setStopLoss("");
      setLimitPrice("");
    }
  };

  return (
    <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{asset.name}</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-sm font-semibold text-muted-foreground">{asset.symbol}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{asset.category}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">${formatPrice(livePrice)}</p>
          <div className={cn("flex items-center gap-1 justify-end text-sm font-semibold", liveChange >= 0 ? "text-profit-green" : "text-loss-red")}>
            {liveChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {liveChange >= 0 ? "+" : ""}{liveChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Price Info Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Bid", value: formatPrice(bid) },
          { label: "Ask", value: formatPrice(ask) },
          { label: "Spread", value: asset.spread },
          { label: "Daily Change", value: `${liveChange >= 0 ? "+" : ""}${liveChange.toFixed(2)}%`, color: liveChange >= 0 ? "text-profit-green" : "text-loss-red" },
        ].map((item) => (
          <div key={item.label} className="bg-background rounded-xl border border-border p-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
            <p className={cn("text-lg font-bold mt-1", item.color || "text-foreground")}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Open Positions for this asset */}
      {openPositions.length > 0 && (
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Your Open Position{openPositions.length > 1 ? "s" : ""} — {asset.symbol}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-4 py-2.5">Type</th>
                  <th className="text-right px-4 py-2.5">Amount</th>
                  <th className="text-right px-4 py-2.5">Leverage</th>
                  <th className="text-right px-4 py-2.5">Entry</th>
                  <th className="text-right px-4 py-2.5">Current</th>
                  <th className="text-right px-4 py-2.5">TP</th>
                  <th className="text-right px-4 py-2.5">SL</th>
                  <th className="text-right px-4 py-2.5">P/L</th>
                  <th className="text-center px-4 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((pos) => (
                  <tr key={pos.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className={cn("px-4 py-3 font-semibold capitalize", pos.order_type === "buy" ? "text-profit-green" : "text-loss-red")}>
                      {pos.order_type}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">
                      ${pos.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{pos.leverage}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">${formatPrice(pos.entry_price)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">${formatPrice(pos.current_price)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {pos.take_profit ? `$${formatPrice(pos.take_profit)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {pos.stop_loss ? `$${formatPrice(pos.stop_loss)}` : "—"}
                    </td>
                    <td className={cn("px-4 py-3 text-right font-bold", pos.pl >= 0 ? "text-profit-green" : "text-loss-red")}>
                      {pos.pl >= 0 ? "+" : ""}${pos.pl.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => closePosition(pos.id)}
                        className="text-xs"
                      >
                        Close
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart + AI — left 2 cols */}
        <div className="lg:col-span-2 space-y-5">
          {/* Chart */}
          <div className="bg-background rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Price Chart — 90 Days</h2>
            <PriceChart symbol={asset.symbol} basePrice={livePrice} change={liveChange} />
          </div>

          {/* AI Analysis */}
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">AI Analysis</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={runAnalysis} disabled={analyzing} className="text-xs">
                <RefreshCw size={12} className={cn("mr-1", analyzing && "animate-spin")} />
                {analyzing ? "Analyzing…" : "Refresh"}
              </Button>
            </div>
            <div className="px-5 py-4 min-h-[120px]">
              {analyzing && !analysis ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <RefreshCw size={14} className="animate-spin" /> Generating AI analysis…
                </div>
              ) : analysis ? (
                <div className="prose prose-sm max-w-none text-foreground [&_strong]:text-foreground [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_p]:text-sm [&_li]:text-sm [&_ul]:my-1">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click Refresh to generate analysis.</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Panel — right col */}
        <div className="space-y-5">
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Place Order</h2>
            </div>

            {/* Buy / Sell */}
            <div className="px-5 pt-4">
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <button
                  onClick={() => setOrderType("buy")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                    orderType === "buy" ? "text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                  style={orderType === "buy" ? { backgroundColor: '#0a1f66' } : undefined}
                >
                  <ArrowUpCircle size={16} /> Buy
                </button>
                <button
                  onClick={() => setOrderType("sell")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                    orderType === "sell" ? "bg-loss-red text-white shadow-lg shadow-loss-red/25" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowDownCircle size={16} /> Sell
                </button>
              </div>
            </div>

            {/* Order Mode */}
            <div className="px-5 pt-4">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Order Type</label>
              <div className="flex gap-2">
                {orderModes.map((m) => (
                  <button
                    key={m}
                    onClick={() => setOrderMode(m)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                      orderMode === m ? "text-white shadow" : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                    style={orderMode === m ? { backgroundColor: '#0a1f66' } : undefined}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            <div className="px-5 py-4 space-y-3">
              <FieldRow label="Amount (USD)">
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-muted border-border text-right font-semibold" />
              </FieldRow>

              {orderMode !== "Market" && (
                <FieldRow label={orderMode === "Limit" ? "Limit Price" : "Stop Price"}>
                  <Input type="number" placeholder="0.00" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} className="bg-muted border-border text-right font-semibold" />
                </FieldRow>
              )}

              <FieldRow label="Leverage">
                <div className="flex gap-1.5">
                  {leverageOptions.map((lev) => (
                    <button
                      key={lev}
                      onClick={() => setLeverage(lev)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                        leverage === lev ? "text-white shadow" : "bg-muted text-muted-foreground"
                      )}
                      style={leverage === lev ? { backgroundColor: '#0a1f66' } : undefined}
                    >
                      {lev}
                    </button>
                  ))}
                </div>
              </FieldRow>

              <FieldRow label="Take Profit">
                <Input type="number" placeholder="—" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="bg-muted border-border text-profit-green text-right font-semibold" />
              </FieldRow>
              <FieldRow label="Stop Loss">
                <Input type="number" placeholder="—" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="bg-muted border-border text-loss-red text-right font-semibold" />
              </FieldRow>
            </div>

            {/* Submit */}
            <div className="px-5 pb-5">
              <Button
                onClick={handlePlaceOrder}
                className={cn(
                  "w-full py-6 text-base font-bold rounded-xl transition-all text-white",
                  orderType === "buy"
                    ? "shadow-lg"
                    : "bg-loss-red hover:bg-loss-red/90 shadow-lg shadow-loss-red/20"
                )}
                style={orderType === "buy" ? { backgroundColor: '#0a1f66' } : undefined}
              >
                Place {orderMode} {orderType === "buy" ? "Buy" : "Sell"} Order
              </Button>
            </div>
          </div>

          {/* Asset Details */}
          <div className="bg-background rounded-xl border border-border p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Asset Details</h2>
            {[
              { label: "Symbol", value: asset.symbol },
              { label: "Category", value: asset.category },
              { label: "Spread", value: asset.spread },
              { label: "Min Leverage", value: "1:10" },
              { label: "Max Leverage", value: "1:200" },
              { label: "Trading Hours", value: asset.category === "Crypto" ? "24/7" : "Mon–Fri" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

export default AssetTradePage;
