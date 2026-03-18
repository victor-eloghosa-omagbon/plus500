import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, AlertTriangle, TrendingUp, TrendingDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ASSETS } from "@/components/dashboard/assetsData";

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  condition: string;
  target_price: number;
  active: boolean;
  triggered: boolean;
  created_at: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const LIVE_PRICES: Record<string, number> = {};
ASSETS.forEach((a) => { LIVE_PRICES[a.symbol] = a.price; });

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCondition, setNewCondition] = useState("above");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);
      await Promise.all([fetchAlerts(session.user.id), fetchNotifications(session.user.id)]);
      setLoading(false);
    };
    init();
  }, []);

  // Realtime subscription for notifications
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("alerts-notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => fetchNotifications(userId))
      .on("postgres_changes", { event: "*", schema: "public", table: "price_alerts", filter: `user_id=eq.${userId}` },
        () => fetchAlerts(userId))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Check alerts against live prices periodically
  useEffect(() => {
    if (!userId || alerts.length === 0) return;
    const interval = setInterval(() => {
      checkAlerts();
    }, 5000);
    return () => clearInterval(interval);
  }, [userId, alerts]);

  const fetchAlerts = async (uid: string) => {
    const { data } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (data) setAlerts(data as PriceAlert[]);
  };

  const fetchNotifications = async (uid: string) => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setNotifications(data as Notification[]);
  };

  const checkAlerts = async () => {
    for (const alert of alerts) {
      if (!alert.active || alert.triggered) continue;
      const livePrice = LIVE_PRICES[alert.symbol];
      if (!livePrice) continue;

      const triggered =
        (alert.condition === "above" && livePrice >= alert.target_price) ||
        (alert.condition === "below" && livePrice <= alert.target_price);

      if (triggered && userId) {
        // Mark alert as triggered
        await supabase.from("price_alerts").update({ triggered: true, active: false }).eq("id", alert.id);
        // Create notification
        await supabase.from("notifications").insert({
          user_id: userId,
          type: "price",
          title: `${alert.symbol} Alert Triggered`,
          message: `${alert.symbol} (${alert.name}) is now ${alert.condition === "above" ? "above" : "below"} $${alert.target_price.toLocaleString()} — current price: $${livePrice.toLocaleString()}`,
        });
        toast.success(`Alert triggered: ${alert.symbol} ${alert.condition} $${alert.target_price.toLocaleString()}`);
      }
    }
  };

  const addAlert = async () => {
    if (!newSymbol || !newPrice || !userId) {
      toast.error("Please fill in all fields");
      return;
    }
    const asset = ASSETS.find((a) => a.symbol.toLowerCase() === newSymbol.toLowerCase());
    const { error } = await supabase.from("price_alerts").insert({
      user_id: userId,
      symbol: newSymbol.toUpperCase(),
      name: asset?.name || newSymbol.toUpperCase(),
      condition: newCondition,
      target_price: parseFloat(newPrice),
    });
    if (error) { toast.error("Failed to create alert"); return; }
    toast.success(`Alert created for ${newSymbol.toUpperCase()}`);
    setNewSymbol("");
    setNewPrice("");

    // Also create a notification for the new alert
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "account",
      title: "New Price Alert",
      message: `Alert set: ${newSymbol.toUpperCase()} price ${newCondition} $${parseFloat(newPrice).toLocaleString()}`,
    });
  };

  const removeAlert = async (id: string) => {
    await supabase.from("price_alerts").delete().eq("id", id);
    toast.info("Alert removed");
  };

  const toggleAlert = async (id: string, active: boolean) => {
    await supabase.from("price_alerts").update({ active: !active }).eq("id", id);
  };

  const clearNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-5 max-w-4xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Price Alerts */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Price Alerts</h2>

          {/* Create Alert */}
          <div className="bg-background rounded-xl border border-border p-4 space-y-3">
            <div className="flex gap-2">
              <select
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground"
              >
                <option value="">Select Asset</option>
                {ASSETS.map((a) => (
                  <option key={a.symbol} value={a.symbol}>{a.icon} {a.name} ({a.symbol})</option>
                ))}
              </select>
              <Input type="number" placeholder="Target Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="bg-muted border-border w-32" />
            </div>
            <div className="flex gap-2">
              <select
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground"
              >
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
              <Button onClick={addAlert} className="text-white" style={{ backgroundColor: '#0a1f66' }}>
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>
            {newSymbol && LIVE_PRICES[newSymbol] && (
              <p className="text-xs text-muted-foreground">Current price: <span className="text-foreground font-medium">${LIVE_PRICES[newSymbol].toLocaleString()}</span></p>
            )}
          </div>

          {/* Alert List */}
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No price alerts set. Create one above to get notified.
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 bg-background rounded-xl border border-border px-4 py-3">
                {alert.condition === "above" ? (
                  <TrendingUp size={16} className="text-profit-green shrink-0" />
                ) : (
                  <TrendingDown size={16} className="text-loss-red shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{alert.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.condition === "above" ? "Above" : "Below"} ${alert.target_price.toLocaleString()}
                    {LIVE_PRICES[alert.symbol] && (
                      <span className="ml-1">• Now: ${LIVE_PRICES[alert.symbol].toLocaleString()}</span>
                    )}
                  </p>
                </div>
                {alert.triggered ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent">Triggered</span>
                ) : (
                  <button onClick={() => toggleAlert(alert.id, alert.active)}>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer",
                      alert.active ? "bg-profit-green/10 text-profit-green" : "bg-muted text-muted-foreground"
                    )}>
                      {alert.active ? "Active" : "Paused"}
                    </span>
                  </button>
                )}
                <button onClick={() => removeAlert(alert.id)} className="p-1 rounded hover:bg-muted transition-colors">
                  <Trash2 size={14} className="text-muted-foreground hover:text-loss-red" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Notification Center</h2>
          {notifications.length === 0 ? (
            <div className="bg-background rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
              No notifications yet. Set a price alert to start receiving updates.
            </div>
          ) : (
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 group">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    n.type === "margin" ? "bg-yellow-500/10" :
                    n.type === "price" ? "bg-brand-accent/10" :
                    n.type === "order" ? "bg-profit-green/10" : "bg-muted"
                  )}>
                    {n.type === "margin" ? <AlertTriangle size={14} className="text-yellow-600" /> :
                     n.type === "price" ? <TrendingUp size={14} className="text-brand-accent" /> :
                     n.type === "order" ? <Check size={14} className="text-profit-green" /> :
                     <Bell size={14} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatTime(n.created_at)}</p>
                  </div>
                  <button onClick={() => clearNotification(n.id)} className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                    <X size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
