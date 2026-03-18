import { useState } from "react";
import { MessageCircle, Send, HelpCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SupportPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitTicket = async () => {
    if (!subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in first");
        return;
      }
      const { error } = await supabase.from("support_tickets" as any).insert({
        user_id: session.user.id,
        subject,
        message,
      } as any);
      if (error) throw error;
      toast.success("Support ticket submitted successfully");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Support</h1>

      {/* Live Chat */}
      <div className="bg-background rounded-xl border border-border p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#0a1f66' }}>
          <MessageCircle size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground">Live Chat</h2>
          <p className="text-sm text-muted-foreground">Chat with our support team in real-time</p>
        </div>
        <Button className="text-white" style={{ backgroundColor: '#0a1f66' }} onClick={() => toast.info("Live chat is currently unavailable. Please submit a ticket below and our team will get back to you shortly.")}>
          Start Chat
        </Button>
      </div>

      {/* Submit Ticket */}
      <div className="bg-background rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Send size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Submit a Ticket</h2>
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue" className="bg-muted border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={5}
              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button onClick={submitTicket} disabled={submitting} className="text-white" style={{ backgroundColor: '#0a1f66' }}>
            {submitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default SupportPage;
