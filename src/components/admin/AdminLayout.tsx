import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Users, ArrowLeftRight, ShieldCheck, FileText,
  LayoutDashboard, ArrowLeft, Loader2, PanelLeftClose, PanelLeft,
  Settings, LogOut, BarChart3, Mail, MessageSquare,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Plus500Logo from "@/components/Plus500Logo";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Markets", icon: BarChart3, path: "/admin/markets" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/admin/transactions" },
  { label: "KYC Review", icon: ShieldCheck, path: "/admin/kyc" },
  { label: "Orders", icon: FileText, path: "/admin/orders" },
  { label: "Email Users", icon: Mail, path: "/admin/email" },
  { label: "Issues", icon: MessageSquare, path: "/admin/issues" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

const AdminLayout = () => {
  const { isAdmin, loading } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/10 bg-[#0b216d] p-3 gap-2 transition-all duration-200 ${
          collapsed ? "w-[60px]" : "w-64"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center mb-4 ${collapsed ? "justify-center" : "justify-between px-1"}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Plus500Logo className="h-6 w-auto text-primary-foreground" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-primary-foreground/10 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const linkContent = (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                 } ${
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground shadow-md"
                    : "text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && item.label}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return linkContent;
          })}
        </nav>

        {/* Back link */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard"
                className="flex items-center justify-center p-2 text-primary-foreground/60 hover:text-primary-foreground"
              >
                <ArrowLeft size={16} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">Back to Dashboard</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm text-primary-foreground/60 hover:text-primary-foreground rounded-xl hover:bg-primary-foreground/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        )}

        {/* Logout */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 text-red-400/80 hover:text-red-300 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400/80 hover:text-red-300 rounded-xl hover:bg-primary-foreground/10 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex justify-around py-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0 premium-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
