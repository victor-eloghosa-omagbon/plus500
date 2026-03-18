import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useOrders } from "@/hooks/useOrders";
import type { Asset } from "./AssetCard";

interface TradePanelProps {
  asset: Asset;
}

const TradePanel = ({ asset }: TradePanelProps) => {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const { placeOrder } = useOrders();

  const handlePlaceTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const success = await placeOrder({
      symbol: asset.symbol,
      name: asset.name,
      order_type: orderType,
      order_mode: "Market",
      amount: parseFloat(amount),
      leverage: "1:100",
      take_profit: takeProfit ? parseFloat(takeProfit) : null,
      stop_loss: stopLoss ? parseFloat(stopLoss) : null,
    });
    if (success) {
      setAmount("");
      setTakeProfit("");
      setStopLoss("");
    }
  };

  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{asset.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-foreground">{asset.name}</h3>
            <p className="text-xs text-muted-foreground">{asset.symbol} · Daily Signal</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xl font-bold text-foreground">
              ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className={cn("text-xs font-semibold", asset.change >= 0 ? "text-profit-green" : "text-loss-red")}>
              {asset.change >= 0 ? "+" : ""}{asset.change.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setOrderType("buy")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
              orderType === "buy"
                ? "text-white shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            )}
            style={orderType === "buy" ? { backgroundColor: '#0a1f66' } : undefined}
          >
            <ArrowUpCircle size={16} /> Buy
          </button>
          <button
            onClick={() => setOrderType("sell")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
              orderType === "sell"
                ? "bg-loss-red text-white shadow-lg shadow-loss-red/25"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowDownCircle size={16} /> Sell
          </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        <FieldRow label="Amount (USD)">
          <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-muted border-border text-foreground placeholder:text-muted-foreground text-right font-semibold" />
        </FieldRow>
        <FieldRow label="Take Profit">
          <Input type="number" placeholder="—" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="bg-muted border-border text-profit-green placeholder:text-muted-foreground text-right font-semibold" />
        </FieldRow>
        <FieldRow label="Stop Loss">
          <Input type="number" placeholder="—" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="bg-muted border-border text-loss-red placeholder:text-muted-foreground text-right font-semibold" />
        </FieldRow>
      </div>

      <div className="px-5 pb-5">
        <Button
          onClick={handlePlaceTrade}
          className={cn(
            "w-full py-6 text-base font-bold rounded-xl transition-all text-white",
            orderType === "buy" ? "shadow-lg" : "bg-loss-red hover:bg-loss-red/90 shadow-lg shadow-loss-red/20"
          )}
          style={orderType === "buy" ? { backgroundColor: '#0a1f66' } : undefined}
        >
          {orderType === "buy" ? "Place Buy Order" : "Place Sell Order"}
        </Button>
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

export default TradePanel;
