import { Pencil, Trash2, ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  wallet_address: string | null;
}

const OrdersPage = () => {
  const { orders, loading, cancelOrder } = useOrders();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      setTransactions((data as Transaction[]) || []);
      setTxLoading(false);
    };
    fetchTransactions();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const isLoading = loading || txLoading;

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Pending Orders</h1>

      {/* Pending Trade Orders */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trade Orders</h2>
        {pendingOrders.length === 0 ? (
          <div className="bg-background rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground text-sm">No pending trade orders</p>
          </div>
        ) : (
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            {/* Desktop table */}
            <table className="hidden sm:table w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Instrument</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Order Type</th>
                  <th className="text-right px-4 py-3">Trigger Price</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Leverage</th>
                  <th className="text-left px-4 py-3">Created</th>
                  <th className="text-center px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{order.symbol}</p>
                      <p className="text-xs text-muted-foreground">{order.name}</p>
                    </td>
                    <td className={cn("px-4 py-3 font-semibold capitalize", order.order_type === "buy" ? "text-profit-green" : "text-loss-red")}>
                      {order.order_type}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{order.order_mode}</td>
                    <td className="px-4 py-3 text-right text-foreground font-mono">
                      {order.trigger_price
                        ? order.trigger_price < 10
                          ? order.trigger_price.toFixed(4)
                          : Number(order.trigger_price).toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">
                      ${Number(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{order.leverage}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.info("Edit coming soon")} className="text-xs">
                          <Pencil size={12} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => cancelOrder(order.id)} className="text-xs text-loss-red hover:text-loss-red">
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border">
              {pendingOrders.map((order) => (
                <div key={order.id} className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-foreground text-sm">{order.symbol}</span>
                      <span className={cn("ml-2 text-xs font-semibold capitalize px-1.5 py-0.5 rounded", order.order_type === "buy" ? "bg-profit-green/10 text-profit-green" : "bg-loss-red/10 text-loss-red")}>
                        {order.order_type}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ${Number(order.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{order.order_mode} · {order.leverage}</span>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => cancelOrder(order.id)} className="h-6 px-2 text-xs text-loss-red hover:text-loss-red">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pending Transactions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Transactions</h2>
        {transactions.length === 0 ? (
          <div className="bg-background rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground text-sm">No pending transactions</p>
          </div>
        ) : (
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            {/* Desktop table */}
            <table className="hidden sm:table w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {tx.type === "deposit" ? (
                          <ArrowDownCircle size={16} className="text-profit-green" />
                        ) : (
                          <ArrowUpCircle size={16} className="text-loss-red" />
                        )}
                        <span className="font-semibold capitalize text-foreground">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600">
                        <Clock size={10} /> Pending
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tx.type === "deposit" ? (
                        <ArrowDownCircle size={14} className="text-profit-green" />
                      ) : (
                        <ArrowUpCircle size={14} className="text-loss-red" />
                      )}
                      <span className="font-semibold capitalize text-foreground text-sm">{tx.type}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600">
                      <Clock size={10} /> Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
