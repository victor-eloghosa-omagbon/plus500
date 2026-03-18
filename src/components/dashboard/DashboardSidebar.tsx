import {
  LayoutDashboard,
  BarChart3,
  Star,
  ShoppingCart,
  LineChart,
  Briefcase,
  ClipboardList,
  History,
  Wallet,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X,
  Shield,
} from "lucide-react";
  Star,
  ShoppingCart,
  LineChart,
  Briefcase,
  ClipboardList,
  History,
  Wallet,
  Bell,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import Plus500Logo from "@/components/Plus500Logo";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePrices } from "@/contexts/PriceContext";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Markets", path: "/dashboard/markets", icon: BarChart3 },
  { title: "Watchlist", path: "/dashboard/watchlist", icon: Star },
  { title: "Trade", path: "/dashboard/trade", icon: ShoppingCart },
  { title: "Charts", path: "/dashboard/charts", icon: LineChart },
  { title: "Open Positions", path: "/dashboard/positions", icon: Briefcase },
  { title: "Orders", path: "/dashboard/orders", icon: ClipboardList },
  { title: "Portfolio History", path: "/dashboard/history", icon: History },
  { title: "Deposit / Withdraw", path: "/dashboard/funds", icon: Wallet },
  { title: "Alerts", path: "/dashboard/alerts", icon: Bell },
  { title: "Settings", path: "/dashboard/settings", icon: Settings },
  { title: "Support", path: "/dashboard/support", icon: HelpCircle },
];

interface DashboardSidebarProps {
  displayName: string | null;
}


const DashboardSidebar = ({ displayName }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getPrice } = usePrices();

  const [accountData, setAccountData] = useState({
    balance: "$0.00",
    equity: "$0.00",
    marginUsed: "$0.00",
    freeMargin: "$0.00",
    openPL: "$0.00",
    plPositive: true,
  });

  const fmt = (v: number) => `${v < 0 ? "-" : ""}$${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const fetchAccount = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const [profileRes, ordersRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", session.user.id)
        .single(),
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id),
    ]);

    const balance = Number((profileRes.data as any)?.balance ?? 0);
    const orders = ordersRes.data || [];
    const filled = orders.filter((o) => o.status === "filled");

    let totalPL = 0;
    let totalMargin = 0;

    filled.forEach((o: any) => {
      const current = getPrice(o.symbol) || 0;
      const entry = Number(o.entry_price ?? current);
      if (!entry) return;

      const lev = parseInt(o.leverage.split(":")[1] || "1");
      const notional = Number(o.amount) * lev;
      const pl = o.order_type === "buy"
        ? ((current - entry) / entry) * notional
        : ((entry - current) / entry) * notional;

      totalPL += Number.isFinite(pl) ? pl : 0;
      totalMargin += Number(o.amount) || 0;
    });

    totalPL = Math.round(totalPL * 100) / 100;
    totalMargin = Math.round(totalMargin * 100) / 100;
    const equity = Math.round((balance + totalPL) * 100) / 100;
    const freeMargin = Math.round((equity - totalMargin) * 100) / 100;

    setAccountData({
      balance: fmt(balance),
      equity: fmt(equity),
      marginUsed: fmt(totalMargin),
      freeMargin: fmt(freeMargin),
      openPL: `${totalPL >= 0 ? "+" : "-"}$${Math.abs(totalPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      plPositive: totalPL >= 0,
    });
  }, [getPrice]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount, location.pathname]);

  useEffect(() => {
    const interval = setInterval(fetchAccount, 10000);
    return () => clearInterval(interval);
  }, [fetchAccount]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-white/10 shrink-0">
        {(isMobile || !collapsed) && (
          <>
            <Plus500Logo className="h-6 w-auto [&_*]:fill-white shrink-0" />
            <span className="text-[9px] font-bold tracking-widest bg-white/20 text-white px-2 py-0.5 rounded">
              FUTURES
            </span>
          </>
        )}
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto p-1 rounded hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Account Summary */}
      {(isMobile || !collapsed) && (
        <div className="px-4 py-3 border-b border-white/10 space-y-1.5 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Account</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <span className="text-white/60">Balance</span>
            <span className="text-right font-semibold">{accountData.balance}</span>
            <span className="text-white/60">Equity</span>
            <span className="text-right font-semibold">{accountData.equity}</span>
            <span className="text-white/60">Margin</span>
            <span className="text-right font-semibold">{accountData.marginUsed}</span>
            <span className="text-white/60">Free Margin</span>
            <span className="text-right font-semibold">{accountData.freeMargin}</span>
            <span className="text-white/60">Open P/L</span>
            <span className={cn("text-right font-semibold", accountData.plPositive ? "text-emerald-400" : "text-red-400")}>{accountData.openPL}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              )}
              title={!isMobile && collapsed ? item.title : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {(isMobile || !collapsed) && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-white/10 p-2 space-y-1 shrink-0">
        {(isMobile || !collapsed) && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <User size={13} />
            </div>
            <span className="text-xs font-medium truncate">{displayName || "Trader"}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors w-full"
          title="Log out"
        >
          <LogOut size={18} className="shrink-0" />
          {(isMobile || !collapsed) && <span>Log out</span>}
        </button>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors w-full"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a1f66] flex items-center px-4 gap-3 z-50 border-b border-white/10">
        <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white">
          <Menu size={22} />
        </button>
        <Plus500Logo className="h-5 w-auto [&_*]:fill-white" />
        <span className="text-[9px] font-bold tracking-widest bg-white/20 text-white px-2 py-0.5 rounded">
          FUTURES
        </span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0a1f66] text-white flex flex-col animate-fade-in">
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen sticky top-0 flex-col border-r border-border bg-[#0a1f66] text-white transition-all duration-300 z-40",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
};

export default DashboardSidebar;
