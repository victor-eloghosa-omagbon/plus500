import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const cryptoAssets: Record<string, { name: string; symbol: string; icon: string; price: number; change: number; network: string; walletAddress: string }> = {
  btc: {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    price: 67842.50,
    change: 3.24,
    network: "Bitcoin (BTC)",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  },
  eth: {
    name: "Ethereum",
    symbol: "ETH",
    icon: "⟠",
    price: 3521.80,
    change: 1.87,
    network: "Ethereum (ERC-20)",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
};

const CryptoBuyPage = () => {
  const { asset } = useParams<{ asset: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const crypto = cryptoAssets[asset || ""];

  if (!crypto) {
    return (
      <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Asset not found.</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft size={16} className="mr-2" /> Go back
        </Button>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(crypto.walletAddress);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Buy {crypto.name}</h1>
          <p className="text-sm text-muted-foreground">{crypto.symbol} · {crypto.network}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className={cn("text-sm font-semibold", crypto.change >= 0 ? "text-profit-green" : "text-loss-red")}>
            {crypto.change >= 0 ? "+" : ""}{crypto.change.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{crypto.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Deposit {crypto.symbol}</h2>
              <p className="text-sm text-muted-foreground">
                Send {crypto.symbol} to the wallet address below
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* QR Code */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-2xl border border-border shadow-sm">
              <QRCodeSVG
                value={crypto.walletAddress}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Scan QR code to get the wallet address
            </p>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {crypto.symbol} Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-xl px-4 py-3 border border-border">
                <p className="text-sm font-mono text-foreground break-all select-all">
                  {crypto.walletAddress}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0 h-12 w-12 rounded-xl border-border"
              >
                {copied ? (
                  <Check size={18} className="text-profit-green" />
                ) : (
                  <Copy size={18} className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ Only send <strong>{crypto.symbol}</strong> on the <strong>{crypto.network}</strong> network. Sending other assets or using a different network may result in permanent loss.
            </p>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Details</h3>
            {[
              { label: "Network", value: crypto.network },
              { label: "Minimum Deposit", value: crypto.symbol === "BTC" ? "0.0001 BTC" : "0.01 ETH" },
              { label: "Confirmations", value: crypto.symbol === "BTC" ? "3 confirmations" : "12 confirmations" },
              { label: "Processing Time", value: "~10–30 min" },
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

export default CryptoBuyPage;
