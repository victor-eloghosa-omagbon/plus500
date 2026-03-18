import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, Save, Loader2, Ban, CheckCircle } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  balance: number;
  created_at: string;
  kyc_status?: string;
  suspended?: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data as any[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSaveBalance = async (userId: string) => {
    const newBal = parseFloat(editBalance);
    if (isNaN(newBal) || newBal < 0) {
      toast.error("Invalid balance");
      return;
    }
    setSavingId(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ balance: newBal })
      .eq("user_id", userId);
    setSavingId(null);
    if (error) { toast.error("Failed to update balance"); return; }
    toast.success("Balance updated");
    setEditingId(null);
    loadUsers();
  };

  const handleToggleSuspend = async (userId: string, currentlySuspended: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ suspended: !currentlySuspended })
      .eq("user_id", userId);
    if (error) { toast.error("Failed to update suspension status"); return; }
    toast.success(currentlySuspended ? "User unsuspended" : "User suspended");
    loadUsers();
  };

  const filtered = users.filter((u) =>
    (u.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">User Management</h1>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-background rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">KYC</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{user.display_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{user.user_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      {editingId === user.user_id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editBalance}
                            onChange={(e) => setEditBalance(e.target.value)}
                            className="w-28 h-8 text-xs"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveBalance(user.user_id)}
                            disabled={savingId === user.user_id}
                            className="h-8 px-2"
                          >
                            {savingId === user.user_id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          </Button>
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:text-primary text-foreground"
                          onClick={() => {
                            setEditingId(user.user_id);
                            setEditBalance(String(user.balance));
                          }}
                        >
                          ${user.balance.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <KycBadge status={(user as any).kyc_status ?? "not_submitted"} />
                    </td>
                    <td className="px-4 py-3">
                      {user.suspended ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Suspended</span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => {
                            setEditingId(user.user_id);
                            setEditBalance(String(user.balance));
                          }}
                        >
                          Edit Balance
                        </Button>
                        <Button
                          variant={user.suspended ? "outline" : "destructive"}
                          size="sm"
                          className="text-xs h-7 gap-1"
                          onClick={() => handleToggleSuspend(user.user_id, !!user.suspended)}
                        >
                          {user.suspended ? <CheckCircle size={12} /> : <Ban size={12} />}
                          {user.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((user) => (
              <div key={user.id} className="bg-background rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{user.display_name || "—"}</span>
                  <KycBadge status={(user as any).kyc_status ?? "not_submitted"} />
                </div>
                <div className="text-xs text-muted-foreground font-mono">{user.user_id.slice(0, 16)}...</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Balance</span>
                  {editingId === user.user_id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editBalance}
                        onChange={(e) => setEditBalance(e.target.value)}
                        className="w-24 h-7 text-xs"
                      />
                      <Button size="sm" className="h-7 px-2" onClick={() => handleSaveBalance(user.user_id)} disabled={savingId === user.user_id}>
                        <Save size={12} />
                      </Button>
                    </div>
                  ) : (
                    <span
                      className="text-sm font-bold text-foreground cursor-pointer hover:text-primary"
                      onClick={() => { setEditingId(user.user_id); setEditBalance(String(user.balance)); }}
                    >
                      ${user.balance.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</div>
                  <Button
                    variant={user.suspended ? "outline" : "destructive"}
                    size="sm"
                    className="text-xs h-7 gap-1"
                    onClick={() => handleToggleSuspend(user.user_id, !!user.suspended)}
                  >
                    {user.suspended ? <CheckCircle size={12} /> : <Ban size={12} />}
                    {user.suspended ? "Unsuspend" : "Suspend"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const KycBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    not_submitted: { label: "Not Submitted", className: "bg-muted text-muted-foreground" },
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600" },
    approved: { label: "Verified", className: "bg-green-500/10 text-green-600" },
  };
  const c = config[status] ?? config.not_submitted;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.className}`}>{c.label}</span>;
};

export default AdminUsers;
