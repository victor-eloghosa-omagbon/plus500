import { useState, useEffect, useCallback, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// We can't use usePrices hook here since this isn't a component,
// but we import the context to use it when called from within PriceProvider
import { usePrices } from "@/contexts/PriceContext";

export interface Order {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  order_type: string;
  order_mode: string;
  amount: number;
  leverage: string;
  take_profit: number | null;
  stop_loss: number | null;
  trigger_price: number | null;
  entry_price: number | null;
  status: string;
  created_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPrice } = usePrices();

  const fetchOrders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch orders:", error);
    } else {
      setOrders((data as Order[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (order: {
    symbol: string;
    name: string;
    order_type: "buy" | "sell";
    order_mode: string;
    amount: number;
    leverage: string;
    take_profit?: number | null;
    stop_loss?: number | null;
    trigger_price?: number | null;
  }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please log in to place orders");
      return false;
    }

    // Check balance
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("user_id", session.user.id)
      .single();

    const currentBalance = (profile as any)?.balance || 0;
    if (order.amount > currentBalance) {
      toast.error("Insufficient balance");
      return false;
    }

    const status = order.order_mode === "Market" ? "filled" : "pending";
    const entryPrice = getPrice(order.symbol) || order.amount;

    const { error } = await supabase.from("orders").insert({
      user_id: session.user.id,
      symbol: order.symbol,
      name: order.name,
      order_type: order.order_type,
      order_mode: order.order_mode,
      amount: order.amount,
      leverage: order.leverage,
      take_profit: order.take_profit || null,
      stop_loss: order.stop_loss || null,
      trigger_price: order.trigger_price || null,
      entry_price: entryPrice,
      status,
    } as any);

    if (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order");
      return false;
    }

    // Deduct amount from balance
    const newBalance = Math.round((currentBalance - order.amount) * 100) / 100;
    await supabase
      .from("profiles")
      .update({ balance: newBalance } as any)
      .eq("user_id", session.user.id);

    toast.success(
      `${order.order_mode} ${order.order_type} order placed for ${order.symbol} — $${order.amount.toLocaleString()} @ ${order.leverage}`
    );
    await fetchOrders();
    return true;
  };

  const closePosition = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const order = orders.find((o) => o.id === id);
    if (!order) return;

    const currentPrice = getPrice(order.symbol) || 0;
    const entryPrice = order.entry_price || currentPrice;
    const lev = parseInt(order.leverage.split(":")[1] || "1");
    const notional = order.amount * lev;
    const pl = order.order_type === "buy"
      ? ((currentPrice - entryPrice) / entryPrice) * notional
      : ((entryPrice - currentPrice) / entryPrice) * notional;
    const roundedPL = Math.round(pl * 100) / 100;

    const { error: orderError } = await supabase
      .from("orders")
      .update({ status: "closed" })
      .eq("id", id);

    if (orderError) {
      toast.error("Failed to close position");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("user_id", session.user.id)
      .single();

    const currentBalance = (profile as any)?.balance || 0;
    const newBalance = Math.round((currentBalance + order.amount + roundedPL) * 100) / 100;

    await supabase
      .from("profiles")
      .update({ balance: newBalance } as any)
      .eq("user_id", session.user.id);

    toast.success(`Closed ${order.symbol} — P/L: ${roundedPL >= 0 ? "+" : ""}$${roundedPL.toFixed(2)}`);
    await fetchOrders();
    return roundedPL;
  };

  const cancelOrder = async (id: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to cancel order");
      return;
    }
    toast.success("Order cancelled");
    await fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete order");
      return;
    }
    await fetchOrders();
  };

  return { orders, loading, placeOrder, cancelOrder, deleteOrder, closePosition, refetch: fetchOrders };
}
