import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePrices } from "@/contexts/PriceContext";
import { toast } from "sonner";

export interface HeldAsset {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  icon: string;
  quantity: number;
  purchase_price: number;
  amount_usd: number;
  created_at: string;
}

export function useHeldAssets() {
  const [assets, setAssets] = useState<HeldAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPrice } = usePrices();

  const fetchAssets = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }

    const { data, error } = await supabase
      .from("held_assets")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error) setAssets((data as HeldAsset[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const buyAsset = async (asset: { symbol: string; name: string; icon: string; amountUsd: number }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { toast.error("Please log in"); return false; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("user_id", session.user.id)
      .single();

    const balance = (profile as any)?.balance || 0;
    if (asset.amountUsd > balance) { toast.error("Insufficient balance"); return false; }

    const currentPrice = getPrice(asset.symbol) || 1;
    const quantity = asset.amountUsd / currentPrice;

    const { error } = await supabase.from("held_assets").insert({
      user_id: session.user.id,
      symbol: asset.symbol,
      name: asset.name,
      icon: asset.icon,
      quantity,
      purchase_price: currentPrice,
      amount_usd: asset.amountUsd,
    } as any);

    if (error) { toast.error("Failed to buy asset"); return false; }

    const newBalance = Math.round((balance - asset.amountUsd) * 100) / 100;
    await supabase.from("profiles").update({ balance: newBalance } as any).eq("user_id", session.user.id);

    toast.success(`Bought $${asset.amountUsd.toLocaleString()} of ${asset.name}`);
    await fetchAssets();
    return true;
  };

  const sellAsset = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const asset = assets.find((a) => a.id === id);
    if (!asset) return false;

    const currentPrice = getPrice(asset.symbol) || asset.purchase_price;
    const currentValue = Math.round(asset.quantity * currentPrice * 100) / 100;

    const { error } = await supabase.from("held_assets").delete().eq("id", id);
    if (error) { toast.error("Failed to sell asset"); return false; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("user_id", session.user.id)
      .single();

    const balance = (profile as any)?.balance || 0;
    const newBalance = Math.round((balance + currentValue) * 100) / 100;
    await supabase.from("profiles").update({ balance: newBalance } as any).eq("user_id", session.user.id);

    const pl = currentValue - asset.amount_usd;
    toast.success(`Sold ${asset.name} for $${currentValue.toLocaleString()} (${pl >= 0 ? "+" : ""}$${pl.toFixed(2)})`);
    await fetchAssets();
    return true;
  };

  const getTotalValue = useCallback(() => {
    return assets.reduce((sum, a) => {
      const currentPrice = getPrice(a.symbol) || a.purchase_price;
      return sum + a.quantity * currentPrice;
    }, 0);
  }, [assets, getPrice]);

  return { assets, loading, buyAsset, sellAsset, getTotalValue, refetch: fetchAssets };
}
