import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Send, Search, Users, User, Loader2 } from "lucide-react";

interface UserProfile {
  user_id: string;
  display_name: string | null;
}

const AdminEmail = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserProfile[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"individual" | "all">("individual");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .order("created_at", { ascending: false });
      setUsers(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  // We need the email from auth - fetch it via user_id
  // Since we can't query auth.users, we'll use mailto with display_name hint
  // The admin will need to know emails - let's fetch from auth admin or use the profile

  const filtered = users.filter(
    (u) =>
      (u.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (user: UserProfile) => {
    setSelected((prev) =>
      prev.some((s) => s.user_id === user.user_id)
        ? prev.filter((s) => s.user_id !== user.user_id)
        : [...prev, user]
    );
  };

  const selectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
    } else {
      setSelected([...users]);
    }
  };

  const handleSend = () => {
    if (!subject && !body) {
      toast.error("Please enter a subject or message");
      return;
    }

    const recipients = mode === "all" ? users : selected;
    if (recipients.length === 0) {
      toast.error("No users selected");
      return;
    }

    // Build mailto link - use display_name as the email (since display_name is set to email on signup)
    const emails = recipients
      .map((u) => u.display_name ?? "")
      .filter((e) => e.includes("@"));

    if (emails.length === 0) {
      toast.error("No valid email addresses found for selected users");
      return;
    }

    const mailto = `mailto:${emails.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    toast.success(`Opening email client for ${emails.length} recipient(s)`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Email Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compose and send emails to your users via your email client
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "individual" ? "default" : "outline"}
          size="sm"
          className={`gap-2 text-xs ${mode === "individual" ? "bg-[#0b216d] hover:bg-[#0b216d]/90 text-white" : ""}`}
          onClick={() => setMode("individual")}
        >
          <User size={14} />
          Select Users
        </Button>
        <Button
          variant={mode === "all" ? "default" : "outline"}
          size="sm"
          className={`gap-2 text-xs ${mode === "all" ? "bg-[#0b216d] hover:bg-[#0b216d]/90 text-white" : ""}`}
          onClick={() => setMode("all")}
        >
          <Users size={14} />
          All Users ({users.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User selection */}
        {mode === "individual" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Recipients ({selected.length} selected)
              </h3>
              <button
                onClick={selectAll}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {selected.length === users.length ? "Deselect all" : "Select all"}
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden max-h-[400px] overflow-y-auto premium-scrollbar">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No users found</p>
              ) : (
                filtered.map((user) => {
                  const isSelected = selected.some((s) => s.user_id === user.user_id);
                  return (
                    <button
                      key={user.user_id}
                      onClick={() => toggleSelect(user)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-0 transition-colors ${
                        isSelected ? "bg-[#0b216d]/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#0b216d] border-[#0b216d]"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.display_name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {user.user_id.slice(0, 12)}...
                        </p>
                      </div>
                      {(user.display_name ?? "").includes("@") && (
                        <Mail size={12} className="ml-auto text-muted-foreground shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Compose */}
        <div className={`space-y-4 ${mode === "all" ? "lg:col-span-2 max-w-2xl" : ""}`}>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Mail size={14} />
            Compose Email
          </h3>

          <div className="space-y-3">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-background"
            />
            <Textarea
              placeholder="Write your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="bg-background resize-none"
            />
          </div>

          <Button
            onClick={handleSend}
            className="gap-2 bg-[#0b216d] hover:bg-[#0b216d]/90 text-white"
          >
            <Send size={16} />
            Open in Email Client
            {mode === "individual" && selected.length > 0 && (
              <span className="ml-1 opacity-80">({selected.length})</span>
            )}
            {mode === "all" && (
              <span className="ml-1 opacity-80">({users.length})</span>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            This will open your default email client with the selected recipients pre-filled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminEmail;
