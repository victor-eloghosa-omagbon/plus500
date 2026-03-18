import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Users, ArrowLeftRight, ShieldCheck, FileText,
  TrendingUp, DollarSign, Activity, Globe,
  ChevronRight, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: 0,
    pendingTx: 0,
    pendingKyc: 0,
    pendingOrders: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    siteEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [recentTxs, setRecentTxs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [profiles, transactions, orders, settingsRes, recentTxRes, allTxRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("site_settings").select("site_enabled").limit(1).single(),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("transactions").select("type, amount, status"),
      ]);

      const { data: allProfiles } = await supabase.from("profiles").select("kyc_status");
      const pendingKycCount = allProfiles?.filter((p: any) => p.kyc_status === "pending").length ?? 0;

      const approvedTxs = (allTxRes.data ?? []).filter((t: any) => t.status === "approved");
      const totalDep = approvedTxs.filter((t: any) => t.type === "deposit").reduce((s: number, t: any) => s + Number(t.amount), 0);
      const totalWith = approvedTxs.filter((t: any) => t.type === "withdrawal").reduce((s: number, t: any) => s + Number(t.amount), 0);

      setStats({
        users: profiles.count ?? 0,
        pendingTx: transactions.count ?? 0,
        pendingKyc: pendingKycCount,
        pendingOrders: orders.count ?? 0,
        totalDeposits: totalDep,
        totalWithdrawals: totalWith,
        siteEnabled: settingsRes.data?.site_enabled ?? true,
      });
      setRecentTxs(recentTxRes.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "bg-primary/10 text-primary", link: "/admin/users" },
    { label: "Pending Transactions", value: stats.pendingTx, icon: ArrowLeftRight, color: "bg-yellow-500/10 text-yellow-600", link: "/admin/transactions" },
    { label: "Pending KYC", value: stats.pendingKyc, icon: ShieldCheck, color: "bg-orange-500/10 text-orange-600", link: "/admin/kyc" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: FileText, color: "bg-blue-500/10 text-blue-600", link: "/admin/orders" },
  ];

  const financialCards = [
    { label: "Total Deposits", value: `$${stats.totalDeposits.toLocaleString()}`, icon: TrendingUp, color: "bg-green-500/10 text-green-600" },
    { label: "Total Withdrawals", value: `$${stats.totalWithdrawals.toLocaleString()}`, icon: DollarSign, color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", stats.siteEnabled ? "bg-green-500 animate-pulse" : "bg-destructive")} />
          <span className="text-xs font-medium text-muted-foreground">
            {stats.siteEnabled ? "Site Live" : "Site Disabled"}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="group bg-background rounded-2xl border border-border p-4 sm:p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.color)}>
                <card.icon size={18} />
              </div>
              <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Financial + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Financial Summary */}
        <div className="lg:col-span-1 space-y-4">
          {financialCards.map((card) => (
            <div key={card.label} className="bg-background rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.color)}>
                  <card.icon size={18} />
                </div>
                <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-background rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
            </div>
            <Link to="/admin/transactions" className="text-xs text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          {recentTxs.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">No recent activity</div>
          ) : (
            <div className="divide-y divide-border">
              {recentTxs.map((tx: any) => (
                <div key={tx.id} className="px-5 py-3 flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    tx.type === "deposit" ? "bg-green-500/10" : "bg-destructive/10"
                  )}>
                    {tx.type === "deposit" ? (
                      <TrendingUp size={14} className="text-green-500" />
                    ) : (
                      <DollarSign size={14} className="text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{tx.user_id?.slice(0, 12)}...</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", tx.type === "deposit" ? "text-green-500" : "text-destructive")}>
                      {tx.type === "deposit" ? "+" : "-"}${Number(tx.amount).toLocaleString()}
                    </p>
                    <StatusDot status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusDot = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    approved: "bg-green-500/10 text-green-600",
    rejected: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
};

export default AdminOverview;
