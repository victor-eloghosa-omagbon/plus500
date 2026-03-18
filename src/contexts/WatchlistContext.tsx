import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface WatchlistItem {
  symbol: string;
  name: string;
  category: string;
  spread: string;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  toggleWatchlist: (item: WatchlistItem) => void;
  loading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }

    const { data, error } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch watchlist:", error);
      setLoading(false);
      return;
    }

    const items: WatchlistItem[] = (data || []).map((row: any) => ({
      symbol: row.symbol,
      name: row.name,
      category: row.category,
      spread: row.spread,
    }));

    setWatchlist(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = async (item: WatchlistItem) => {
    if (watchlist.some((w) => w.symbol === item.symbol)) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { toast.error("Please log in"); return; }

    const { error } = await supabase.from("watchlist").insert({
      user_id: session.user.id,
      symbol: item.symbol,
      name: item.name,
      category: item.category,
      spread: item.spread,
    });

    if (error) {
      console.error("Failed to add to watchlist:", error);
      toast.error("Failed to add to watchlist");
      return;
    }

    setWatchlist((prev) => [...prev, item]);
    toast.success(`${item.symbol} added to watchlist`);
  };

  const removeFromWatchlist = async (symbol: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", session.user.id)
      .eq("symbol", symbol);

    if (error) {
      console.error("Failed to remove from watchlist:", error);
      toast.error("Failed to remove from watchlist");
      return;
    }

    setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol));
    toast.info(`${symbol} removed from watchlist`);
  };

  const isInWatchlist = (symbol: string) => watchlist.some((w) => w.symbol === symbol);

  const toggleWatchlist = (item: WatchlistItem) => {
    if (isInWatchlist(item.symbol)) {
      removeFromWatchlist(item.symbol);
    } else {
      addToWatchlist(item);
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist, loading }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
};
