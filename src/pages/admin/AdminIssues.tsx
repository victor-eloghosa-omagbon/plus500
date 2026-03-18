import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  user_email?: string;
}

const AdminIssues = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load tickets");
      setLoading(false);
      return;
    }

    // Fetch user emails from profiles
    const userIds = [...new Set((data || []).map((t: any) => t.user_id))] as string[];
    let profileMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);
      profiles?.forEach((p) => {
        profileMap[p.user_id] = p.display_name || "Unknown";
      });
    }

    setTickets(
      (data || []).map((t: any) => ({
        ...t,
        user_email: profileMap[t.user_id] || t.user_id,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await (supabase as any)
      .from("support_tickets")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update");
      return;
    }
    toast.success(`Ticket marked as ${status}`);
    fetchTickets();
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive" className="gap-1"><AlertCircle size={12} />Open</Badge>;
      case "in_progress":
        return <Badge className="gap-1 bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><Clock size={12} />In Progress</Badge>;
      case "resolved":
        return <Badge className="gap-1 bg-green-500/20 text-green-600 border-green-500/30"><CheckCircle2 size={12} />Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Support Issues</h1>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTickets} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
          <p>No support tickets yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-background rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                    {statusBadge(ticket.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From: {ticket.user_email} · {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 bg-muted rounded-lg p-3">{ticket.message}</p>
              <div className="flex gap-2">
                {ticket.status !== "in_progress" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(ticket.id, "in_progress")}>
                    Mark In Progress
                  </Button>
                )}
                {ticket.status !== "resolved" && (
                  <Button size="sm" variant="outline" className="text-green-600" onClick={() => updateStatus(ticket.id, "resolved")}>
                    Mark Resolved
                  </Button>
                )}
                {ticket.status !== "open" && (
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(ticket.id, "open")}>
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminIssues;
