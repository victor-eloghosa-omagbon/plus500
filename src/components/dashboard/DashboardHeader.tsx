import { LogOut, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Plus500Logo from "@/components/Plus500Logo";
import { toast } from "sonner";

interface DashboardHeaderProps {
  displayName: string | null;
}

const DashboardHeader = ({ displayName }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <header className="bg-background border-b border-border px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Plus500Logo className="h-7 w-auto [&_*]:fill-[#0a1f66] text-[#0a1f66]" />
          <span className="text-[10px] font-bold tracking-widest text-white px-2 py-0.5 rounded" style={{ backgroundColor: '#0a1f66' }}>
            FUTURES
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full" />
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
              <User size={14} className="text-brand-accent" />
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
              {displayName || "Trader"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-loss-red/10 transition-colors text-muted-foreground hover:text-loss-red"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
