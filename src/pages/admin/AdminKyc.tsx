import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Loader2, Eye } from "lucide-react";

interface KycUser {
  id: string;
  user_id: string;
  display_name: string | null;
  kyc_status: string;
  kyc_document_url: string | null;
  created_at: string;
}

const AdminKyc = () => {
  const [users, setUsers] = useState<KycUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "not_submitted" | "all">("pending");

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const allUsers = (data as any[]) ?? [];
    const filtered = filter === "all" ? allUsers : allUsers.filter(u => u.kyc_status === filter);
    setUsers(filtered);
    setLoading(false);
    setUsers((data as any[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, [filter]);

  const handleAction = async (user: KycUser, status: "approved" | "not_submitted") => {
    setActionId(user.user_id);
    const { error } = await supabase
      .from("profiles")
      .update({ kyc_status: status } as any)
      .eq("user_id", user.user_id);
    setActionId(null);
    if (error) { toast.error("Failed to update KYC status"); return; }
    toast.success(`KYC ${status === "approved" ? "approved" : "rejected"}`);
    loadUsers();
  };

  const handleViewDoc = async (docPath: string) => {
    const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(docPath, 300);
    if (data?.signedUrl) {
      setPreviewUrl(data.signedUrl);
    } else {
      toast.error("Could not load document");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">KYC Verification Review</h1>

      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "not_submitted", "all"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="text-xs"
          >
            {f === "not_submitted" ? "Rejected/Not Submitted" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Document preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-background rounded-xl p-2 max-w-lg w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-sm font-medium text-foreground">Driver's License</span>
              <Button variant="ghost" size="sm" onClick={() => setPreviewUrl(null)}>
                <X size={16} />
              </Button>
            </div>
            <img src={previewUrl} alt="KYC Document" className="w-full rounded-lg" />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-10">No KYC submissions found</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="bg-background rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{user.display_name || "—"}</p>
                  <p className="text-xs text-muted-foreground font-mono">{user.user_id.slice(0, 16)}...</p>
                </div>
                <KycBadge status={user.kyc_status} />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {user.kyc_document_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleViewDoc(user.kyc_document_url!)}
                  >
                    <Eye size={14} className="mr-1" /> View Document
                  </Button>
                )}

                {user.kyc_status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleAction(user, "approved")}
                      disabled={actionId === user.user_id}
                    >
                      {actionId === user.user_id ? <Loader2 size={12} className="animate-spin" /> : <><Check size={12} className="mr-1" /> Approve</>}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 text-xs"
                      onClick={() => handleAction(user, "not_submitted")}
                      disabled={actionId === user.user_id}
                    >
                      <X size={12} className="mr-1" /> Reject
                    </Button>
                  </>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
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

export default AdminKyc;
