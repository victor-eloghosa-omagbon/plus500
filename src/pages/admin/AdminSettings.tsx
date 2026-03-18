import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Power, PowerOff, Wallet, Save, Loader2, Globe, Shield,
  Bitcoin, CircleDollarSign, Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletAddress {
  id: string;
  crypto_name: string;
  crypto_symbol: string;
  wallet_address: string;
  network: string;
}

const cryptoIcons: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  XRP: "✕",
  USDT: "₮",
  SOL: "◎",
  BNB: "◆",
  TRX: "♦",
};

const AdminSettings = () => {
  const [siteEnabled, setSiteEnabled] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [wallets, setWallets] = useState<WalletAddress[]>([]);
  const [editedWallets, setEditedWallets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [settingsRes, walletsRes] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).single(),
      supabase.from("wallet_addresses").select("*").order("crypto_name"),
    ]);
    if (settingsRes.data) setSiteEnabled(settingsRes.data.site_enabled);
    if (walletsRes.data) setWallets(walletsRes.data as WalletAddress[]);
    setLoading(false);
  };

  const toggleSite = async () => {
    setToggling(true);
    const newVal = !siteEnabled;
    const { error } = await supabase
      .from("site_settings")
      .update({ site_enabled: newVal, updated_at: new Date().toISOString() })
      .not("id", "is", null);
    setToggling(false);
    if (error) {
      toast.error("Failed to update site status");
      return;
    }
    setSiteEnabled(newVal);
    toast.success(newVal ? "Site is now LIVE" : "Site has been DISABLED");
  };

  const handleWalletChange = (id: string, value: string) => {
    setEditedWallets((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveWallet = async (wallet: WalletAddress) => {
    const newAddress = editedWallets[wallet.id];
    if (newAddress === undefined || newAddress === wallet.wallet_address) return;
    setSavingId(wallet.id);
    const { error } = await supabase
      .from("wallet_addresses")
      .update({ wallet_address: newAddress, updated_at: new Date().toISOString() })
      .eq("id", wallet.id);
    setSavingId(null);
    if (error) {
      toast.error(`Failed to update ${wallet.crypto_symbol} address`);
      return;
    }
    toast.success(`${wallet.crypto_symbol} wallet address updated`);
    setEditedWallets((prev) => {
      const next = { ...prev };
      delete next[wallet.id];
      return next;
    });
    loadAll();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Platform Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage site status and deposit wallet addresses</p>
      </div>

      {/* Site Control */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Site Control</h2>
            <p className="text-xs text-muted-foreground">Enable or disable the entire platform</p>
          </div>
        </div>
        <div className="px-5 py-5">
          <div className="flex items-center justify-between bg-muted/50 rounded-xl px-5 py-4 border border-border">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                siteEnabled ? "bg-green-500" : "bg-destructive"
              )} />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {siteEnabled ? "Site is Live" : "Site is Disabled"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {siteEnabled
                    ? "All pages are accessible to visitors"
                    : "Visitors will see a 404 page. Only admin routes are accessible."}
                </p>
              </div>
            </div>
            <Button
              onClick={toggleSite}
              disabled={toggling}
              variant={siteEnabled ? "destructive" : "default"}
              className="gap-2 font-semibold"
            >
              {toggling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : siteEnabled ? (
                <PowerOff size={16} />
              ) : (
                <Power size={16} />
              )}
              {siteEnabled ? "Disable Site" : "Enable Site"}
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Addresses */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Deposit Wallet Addresses</h2>
            <p className="text-xs text-muted-foreground">Configure wallet addresses users will send deposits to</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {wallets.map((wallet) => {
            const currentVal = editedWallets[wallet.id] ?? wallet.wallet_address;
            const hasChanged = editedWallets[wallet.id] !== undefined && editedWallets[wallet.id] !== wallet.wallet_address;

            return (
              <div key={wallet.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 min-w-[160px]">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg font-bold text-foreground">
                    {cryptoIcons[wallet.crypto_symbol] || wallet.crypto_symbol[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{wallet.crypto_name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {wallet.crypto_symbol} · {wallet.network}
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={currentVal}
                    onChange={(e) => handleWalletChange(wallet.id, e.target.value)}
                    placeholder={`Enter ${wallet.crypto_symbol} wallet address...`}
                    className="bg-muted border-border text-xs font-mono h-10"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveWallet(wallet)}
                    disabled={!hasChanged || savingId === wallet.id}
                    className={cn(
                      "h-10 px-4 gap-1.5 shrink-0 transition-all",
                      hasChanged ? "bg-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {savingId === wallet.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {wallets.every((w) => !w.wallet_address) && (
          <div className="px-5 py-4 bg-yellow-500/5 border-t border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-600">
              <Shield size={14} />
              <p className="text-xs font-medium">
                No wallet addresses configured yet. Users won't be able to see deposit addresses until you add them.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
