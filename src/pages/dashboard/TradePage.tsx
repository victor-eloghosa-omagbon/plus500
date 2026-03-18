import { useState, useMemo } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { ASSETS } from "@/components/dashboard/assetsData";
import { usePrices } from "@/contexts/PriceContext";

const orderTypes = ["Market", "Limit", "Stop"];
const leverageOptions = ["1:10", "1:20", "1:50", "1:100", "1:200"];

const TradePage = () => {
  const { getPrice, getChange } = usePrices();

  const instruments = useMemo(() =>
    ASSETS.map((a) => ({
      symbol: a.symbol,
      name: a.name,
      price: getPrice(a.symbol) || a.price,
    })),
    [getPrice]
  );

  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderMode, setOrderMode] = useState("Market");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("1:100");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const { placeOrder } = useOrders();

  const handlePlaceOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const success = await placeOrder({
      symbol: selectedInstrument.symbol,
      name: selectedInstrument.name,
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
    <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">New Order</h1>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {/* Instrument Selector */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Instrument</label>
          <div className="flex gap-2 flex-wrap">
            {instruments.map((inst) => (
              <button
                key={inst.symbol}
                onClick={() => setSelectedInstrument(inst)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  selectedInstrument.symbol === inst.symbol
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {inst.name}
              </button>
            ))}
          </div>
          <p className="text-xl font-bold text-foreground mt-3">
            {selectedInstrument.name} — ${selectedInstrument.price < 10 ? selectedInstrument.price.toFixed(4) : selectedInstrument.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Buy / Sell */}
        <div className="px-5 pt-4">
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setOrderType("buy")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                orderType === "buy" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowUpCircle size={16} /> Buy
            </button>
            <button
              onClick={() => setOrderType("sell")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                orderType === "sell" ? "bg-loss-red text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowDownCircle size={16} /> Sell
            </button>
          </div>
        </div>

        {/* Order Type */}
        <div className="px-5 pt-4">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Order Type</label>
          <div className="flex gap-2">
            {orderTypes.map((t) => (
              <button
                key={t}
                onClick={() => setOrderMode(t)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                  orderMode === t ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
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
            <div className="flex gap-2">
              {leverageOptions.map((lev) => (
                <button
                  key={lev}
                  onClick={() => setLeverage(lev)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                    leverage === lev ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground"
                  )}
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
              "w-full py-6 text-base font-bold rounded-xl transition-all",
              orderType === "buy"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                : "bg-loss-red hover:bg-loss-red/90 text-primary-foreground shadow-lg"
            )}
          >
            Place {orderMode} {orderType === "buy" ? "Buy" : "Sell"} Order
          </Button>
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

export default TradePage;
