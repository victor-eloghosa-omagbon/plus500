import { Wallet, LineChart, Bell, Settings, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { title: "Home", path: "/dashboard", icon: Home, exact: true },
  { title: "Funds", path: "/dashboard/funds", icon: Wallet },
  { title: "Charts", path: "/dashboard/charts", icon: LineChart },
  { title: "Alerts", path: "/dashboard/alerts", icon: Bell },
  { title: "Settings", path: "/dashboard/settings", icon: Settings },
];

const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="flex items-center justify-around h-14 rounded-full bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg shadow-foreground/5">
        {items.map((item) => {
          const isActive = (item as any).exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
