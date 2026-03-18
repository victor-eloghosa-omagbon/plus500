import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  user_id: string;
  name: string;
  symbol: string;
  order_type: string;
  order_mode: string;
  amount: number;
  leverage: string;
  status: string;
  created_at: string;
  entry_price: number | null;
  take_profit: number | null;
  stop_loss: number | null;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "filled" | "cancelled" | "closed" | "all">("all");
  const [actionId, setActionId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const handleStatusChange = async (order: Order, newStatus: string) => {
    setActionId(order.id);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);
    setActionId(null);
    if (error) { toast.error("Failed to update order"); return; }
    toast.success(`Order ${newStatus}`);
    loadOrders();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Order Management</h1>

      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "filled", "closed", "cancelled"] as const).map((f) => (
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
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-10">No orders found</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden sm:block bg-background rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Leverage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{order.symbol}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold capitalize px-1.5 py-0.5 rounded ${
                        order.order_type === "buy" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                      }`}>
                        {order.order_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize text-xs">{order.order_mode}</td>
                    <td className="px-4 py-3 text-foreground">${order.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{order.leverage}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{order.user_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {order.status === "pending" && (
                          <>
                            <Button size="sm" className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleStatusChange(order, "filled")} disabled={actionId === order.id}>
                              Fill
                            </Button>
                            <Button size="sm" variant="destructive" className="h-7 px-2 text-xs"
                              onClick={() => handleStatusChange(order, "cancelled")} disabled={actionId === order.id}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === "filled" && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
                            onClick={() => handleStatusChange(order, "closed")} disabled={actionId === order.id}>
                            Close
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-background rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{order.symbol}</span>
                    <span className={`text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded ${
                      order.order_type === "buy" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}>
                      {order.order_type}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">${order.amount.toLocaleString()} · {order.leverage}</span>
                  <span className="text-muted-foreground capitalize">{order.order_mode}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">{order.user_id.slice(0, 16)}...</div>
                <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                {order.status === "pending" && (
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStatusChange(order, "filled")} disabled={actionId === order.id}>Fill</Button>
                    <Button size="sm" variant="destructive" className="flex-1 h-8 text-xs"
                      onClick={() => handleStatusChange(order, "cancelled")} disabled={actionId === order.id}>Cancel</Button>
                  </div>
                )}
                {order.status === "filled" && (
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs"
                    onClick={() => handleStatusChange(order, "closed")} disabled={actionId === order.id}>Close Position</Button>
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
    filled: "bg-green-500/10 text-green-600",
    closed: "bg-muted text-muted-foreground",
    cancelled: "bg-red-500/10 text-red-600",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${config[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
};

export default AdminOrders;
