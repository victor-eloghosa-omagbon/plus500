import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CATEGORIES = ["Forex", "Crypto", "Stocks", "Commodities", "Indices"];

interface Instrument {
  id: string;
  symbol: string;
  name: string;
  category: string;
  spread: string;
  is_active: boolean;
}

const AdminMarkets = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ symbol: "", name: "", category: "Crypto", spread: "0" });
  const [editForm, setEditForm] = useState({ symbol: "", name: "", category: "", spread: "" });
  const [filterCategory, setFilterCategory] = useState("All");

  const { data: instruments = [], isLoading } = useQuery({
    queryKey: ["admin-market-instruments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_instruments")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return data as Instrument[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (instrument: typeof form) => {
      const { error } = await supabase.from("market_instruments").insert(instrument);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-market-instruments"] });
      toast.success("Instrument added");
      setForm({ symbol: "", name: "", category: "Crypto", spread: "0" });
      setShowAdd(false);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Instrument> & { id: string }) => {
      const { error } = await supabase.from("market_instruments").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-market-instruments"] });
      toast.success("Instrument updated");
      setEditingId(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("market_instruments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-market-instruments"] });
      toast.success("Instrument deleted");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleActive = (inst: Instrument) => {
    updateMutation.mutate({ id: inst.id, is_active: !inst.is_active });
  };

  const startEdit = (inst: Instrument) => {
    setEditingId(inst.id);
    setEditForm({ symbol: inst.symbol, name: inst.name, category: inst.category, spread: inst.spread });
  };

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const filtered = filterCategory === "All"
    ? instruments
    : instruments.filter((i) => i.category === filterCategory);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filter changes
  const handleFilterChange = (cat: string) => {
    setFilterCategory(cat);
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Instruments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage {instruments.length} instruments across {CATEGORIES.length} categories
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-[#0b216d] hover:bg-[#0b216d]/90 text-white gap-2"
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? "Cancel" : "Add Instrument"}
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">New Instrument</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Symbol (e.g. DOGE/USD)"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            />
            <Input
              placeholder="Name (e.g. Dogecoin)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Input
              placeholder="Spread"
              value={form.spread}
              onChange={(e) => setForm({ ...form, spread: e.target.value })}
            />
          </div>
          <Button
            onClick={() => addMutation.mutate(form)}
            disabled={!form.symbol || !form.name || addMutation.isPending}
            className="bg-[#0b216d] hover:bg-[#0b216d]/90 text-white"
          >
            {addMutation.isPending ? "Adding..." : "Add Instrument"}
          </Button>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? "bg-[#0b216d] text-white shadow-md"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1 opacity-70">
                ({instruments.filter((i) => i.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Symbol</span>
          <span>Name</span>
          <span>Category</span>
          <span>Spread</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {isLoading ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">No instruments found</div>
        ) : (
          paginated.map((inst) => (
            <div
              key={inst.id}
              className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors items-center"
            >
              {editingId === inst.id ? (
                <>
                  <Input
                    value={editForm.symbol}
                    onChange={(e) => setEditForm({ ...editForm, symbol: e.target.value })}
                    className="h-8 text-sm"
                  />
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="h-8 text-sm"
                  />
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Input
                    value={editForm.spread}
                    onChange={(e) => setEditForm({ ...editForm, spread: e.target.value })}
                    className="h-8 text-sm w-20"
                  />
                  <span />
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateMutation.mutate({ id: inst.id, ...editForm })}
                      className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">{inst.symbol}</p>
                  <p className="text-sm text-muted-foreground">{inst.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {inst.category}
                  </span>
                  <p className="text-sm text-muted-foreground">{inst.spread}</p>
                  <button onClick={() => toggleActive(inst)} className="flex items-center">
                    {inst.is_active ? (
                      <ToggleRight size={22} className="text-emerald-500" />
                    ) : (
                      <ToggleLeft size={22} className="text-muted-foreground" />
                    )}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(inst)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${inst.symbol}?`)) deleteMutation.mutate(inst.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${
                  p === page ? "bg-[#0b216d] text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMarkets;
