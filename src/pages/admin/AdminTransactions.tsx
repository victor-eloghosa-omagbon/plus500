import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Loader2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  wallet_address: string | null;
  withdrawal_details: any;
}

const AdminTransactions = () => {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const loadTxs = async () => {
    setLoading(true);
    let query = supabase.from("transactions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setTxs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadTxs(); }, [filter]);

  const handleAction = async (tx: Transaction, action: "approved" | "rejected") => {
    setActionId(tx.id);

    // Update transaction status
    const { error } = await supabase
      .from("transactions")
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq("id", tx.id);

    if (error) {
      toast.error("Failed to update transaction");
      setActionId(null);
      return;
    }

    // If approving a deposit, add to user balance
    if (action === "approved" && tx.type === "deposit") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", tx.user_id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ balance: profile.balance + tx.amount })
          .eq("user_id", tx.user_id);
      }
    }

    // If approving a withdrawal, deduct from user balance
    if (action === "approved" && tx.type === "withdrawal") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", tx.user_id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ balance: Math.max(0, profile.balance - tx.amount) })
          .eq("user_id", tx.user_id);
      }
    }

    setActionId(null);
    toast.success(`Transaction ${action}`);
    loadTxs();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Transaction Management</h1>

      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize text-xs"
          >
            {f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : txs.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-10">No transactions found</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden sm:block bg-background rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tx.type === "deposit" ? (
                          <ArrowDownCircle size={14} className="text-green-500" />
                        ) : (
                          <ArrowUpCircle size={14} className="text-red-500" />
                        )}
                        <span className="capitalize text-foreground">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{tx.user_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 font-bold text-foreground">${tx.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                      {tx.wallet_address || (tx.withdrawal_details ? JSON.stringify(tx.withdrawal_details) : "—")}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {tx.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 px-2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAction(tx, "approved")}
                            disabled={actionId === tx.id}
                          >
                            {actionId === tx.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 px-2"
                            onClick={() => handleAction(tx, "rejected")}
                            disabled={actionId === tx.id}
                          >
                            <X size={12} />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {txs.map((tx) => (
              <div key={tx.id} className="bg-background rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tx.type === "deposit" ? <ArrowDownCircle size={14} className="text-green-500" /> : <ArrowUpCircle size={14} className="text-red-500" />}
                    <span className="capitalize font-medium text-foreground">{tx.type}</span>
                  </div>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-foreground">${tx.amount.toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">{tx.user_id.slice(0, 16)}...</div>
                {(tx.wallet_address || tx.withdrawal_details) && (
                  <div className="text-xs text-muted-foreground truncate">
                    {tx.wallet_address || JSON.stringify(tx.withdrawal_details)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</div>
                {tx.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-white text-xs"
                      onClick={() => handleAction(tx, "approved")}
                      disabled={actionId === tx.id}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleAction(tx, "rejected")}
                      disabled={actionId === tx.id}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    approved: "bg-green-500/10 text-green-600",
    rejected: "bg-red-500/10 text-red-600",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${config[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
};

export default AdminTransactions;
