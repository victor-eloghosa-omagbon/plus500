import { useState } from "react";
import { Wallet, Plus, X, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHeldAssets } from "@/hooks/useHeldAssets";
import { usePrices } from "@/contexts/PriceContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BUYABLE_ASSETS = [
  { symbol: "BTC/USD", name: "Bitcoin", icon: "₿" },
  { symbol: "ETH/USD", name: "Ethereum", icon: "⟠" },
  { symbol: "SOL/USD", name: "Solana", icon: "◎" },
  { symbol: "XAU/USD", name: "Gold", icon: "🥇" },
  { symbol: "XAG/USD", name: "Silver", icon: "🥈" },
];

const AssetsCard = () => {
  const { assets, loading, buyAsset, sellAsset, getTotalValue } = useHeldAssets();
  const { getPrice } = usePrices();
  const [open, setOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(BUYABLE_ASSETS[0]);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalValue = getTotalValue();

  const handleBuy = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    setSubmitting(true);
    const ok = await buyAsset({
      symbol: selectedAsset.symbol,
      name: selectedAsset.name,
      icon: selectedAsset.icon,
      amountUsd: num,
    });
    if (ok) {
      setAmount("");
      setBuyOpen(false);
    }
    setSubmitting(false);
  };

  const handleSell = async (id: string) => {
    setSubmitting(true);
    await sellAsset(id);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-background rounded-xl border border-border p-4 flex flex-col gap-1 shadow-sm text-left w-full hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet size={14} />
            <span className="text-xs font-medium uppercase tracking-wider">Assets</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">
            {loading ? "—" : assets.length > 0 ? `$${Math.round(totalValue * 100 / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}
          </p>
          <span className="text-xs text-muted-foreground">
            {assets.length} asset{assets.length !== 1 ? "s" : ""} held
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            My Assets
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {assets.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No assets held. Buy some below!
            </p>
          )}
          {assets.map((a) => {
            const currentPrice = getPrice(a.symbol) || a.purchase_price;
            const currentValue = a.quantity * currentPrice;
            const pl = currentValue - a.amount_usd;
            const plPct = (pl / a.amount_usd) * 100;
            return (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <span className="text-xl">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.quantity.toFixed(6)} × ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={cn("text-xs font-medium", pl >= 0 ? "text-profit-green" : "text-loss-red")}>
                    {pl >= 0 ? "+" : ""}{plPct.toFixed(2)}%
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-2"
                  disabled={submitting}
                  onClick={() => handleSell(a.id)}
                >
                  Sell
                </Button>
              </div>
            );
          })}
        </div>

        {/* Buy section */}
        {!buyOpen ? (
          <Button onClick={() => setBuyOpen(true)} className="w-full gap-2" style={{ backgroundColor: '#0a1f66' }}>
            <Plus size={16} /> Buy Asset
          </Button>
        ) : (
          <div className="space-y-3 border border-border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Buy Asset</span>
              <button onClick={() => setBuyOpen(false)}>
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {BUYABLE_ASSETS.map((ba) => (
                <button
                  key={ba.symbol}
                  onClick={() => setSelectedAsset(ba)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                    selectedAsset.symbol === ba.symbol
                      ? "text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  style={selectedAsset.symbol === ba.symbol ? { backgroundColor: '#0a1f66' } : undefined}
                >
                  {ba.icon} {ba.name}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Current price: ${getPrice(selectedAsset.symbol)?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "—"}
            </div>
            <Input
              type="number"
              placeholder="Amount in USD"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
            />
            <Button
              onClick={handleBuy}
              disabled={submitting || !amount || parseFloat(amount) <= 0}
              className="w-full"
              style={{ backgroundColor: '#0a1f66' }}
            >
              {submitting ? "Processing..." : `Buy ${selectedAsset.name}`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetsCard;
