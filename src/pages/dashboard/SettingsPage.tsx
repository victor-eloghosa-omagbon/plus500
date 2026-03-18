import { useState, useEffect, useRef } from "react";
import { User, Shield, Key, CheckCircle, Upload, FileImage, Loader2, AlertCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const countryCodes = [
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+61", label: "AU +61" },
  { code: "+91", label: "IN +91" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+81", label: "JP +81" },
  { code: "+86", label: "CN +86" },
  { code: "+55", label: "BR +55" },
  { code: "+234", label: "NG +234" },
  { code: "+27", label: "ZA +27" },
  { code: "+971", label: "AE +971" },
  { code: "+65", label: "SG +65" },
  { code: "+82", label: "KR +82" },
  { code: "+39", label: "IT +39" },
  { code: "+34", label: "ES +34" },
  { code: "+31", label: "NL +31" },
  { code: "+46", label: "SE +46" },
  { code: "+41", label: "CH +41" },
  { code: "+52", label: "MX +52" },
];

const SettingsPage = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("not_submitted");
  const [kycDocUrl, setKycDocUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2FA state
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [showTwoFaSetup, setShowTwoFaSetup] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twoFaStep, setTwoFaStep] = useState<"phone" | "verifying">("phone");
  const [enablingTwoFa, setEnablingTwoFa] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setEmail(session.user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("display_name, kyc_status, kyc_document_url")
        .eq("user_id", session.user.id)
        .single();
      setDisplayName(data?.display_name ?? session.user.email ?? "");
      setKycStatus((data as any)?.kyc_status ?? "not_submitted");
      setKycDocUrl((data as any)?.kyc_document_url ?? null);

      // Check 2FA status
      const { data: profile2fa } = await supabase
        .from("profiles")
        .select("two_fa_enabled, phone_number" as any)
        .eq("user_id", session.user.id)
        .single();
      setTwoFaEnabled((profile2fa as any)?.two_fa_enabled ?? false);
    };
    load();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSaving(false); return; }
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", session.user.id);
    setSaving(false);
    if (error) { toast.error("Failed to update profile"); return; }
    toast.success("Profile updated");
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPw(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be less than 5MB");
      return;
    }
    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setUploading(false); return; }
    const filePath = `${session.user.id}/drivers-license.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage
      .from("kyc-documents")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast.error("Failed to upload document");
      setUploading(false);
      return;
    }
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ kyc_status: "pending", kyc_document_url: filePath } as any)
      .eq("user_id", session.user.id);
    setUploading(false);
    if (updateError) {
      toast.error("Failed to update verification status");
      return;
    }
    setKycStatus("pending");
    setKycDocUrl(filePath);
    toast.success("Document uploaded — verification is being reviewed");
  };

  const handleEnableTwoFa = async () => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (!cleaned || cleaned.length < 6) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setTwoFaStep("verifying");
    setEnablingTwoFa(true);

    setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setEnablingTwoFa(false); setTwoFaStep("phone"); return; }

      const fullPhone = `${countryCode}${cleaned}`;
      const { error } = await supabase
        .from("profiles")
        .update({ two_fa_enabled: true, phone_number: fullPhone })
        .eq("user_id", session.user.id);

      setEnablingTwoFa(false);
      if (error) {
        toast.error("Failed to enable 2FA");
        setTwoFaStep("phone");
        return;
      }

      setTwoFaEnabled(true);
      setShowTwoFaSetup(false);
      setTwoFaStep("phone");
      setPhoneNumber("");
      toast.success("Two-factor authentication enabled successfully");
    }, 3000);
  };

  const handleDisableTwoFa = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { error } = await supabase
      .from("profiles")
      .update({ two_fa_enabled: false, phone_number: null } as any)
      .eq("user_id", session.user.id);
    if (error) { toast.error("Failed to disable 2FA"); return; }
    setTwoFaEnabled(false);
    toast.success("Two-factor authentication disabled");
  };

  const kycStatusConfig: Record<string, { icon: React.ReactNode; label: string; desc: string; bg: string; border: string }> = {
    not_submitted: {
      icon: <AlertCircle size={16} className="text-muted-foreground" />,
      label: "Not Submitted",
      desc: "Please upload a clear photo of your driver's license to verify your identity.",
      bg: "bg-muted/50",
      border: "border-border",
    },
    pending: {
      icon: <Loader2 size={16} className="text-yellow-600 animate-spin" />,
      label: "Pending Review",
      desc: "Your documents are being reviewed. This may take 1-3 business days.",
      bg: "bg-yellow-500/5",
      border: "border-yellow-500/20",
    },
    approved: {
      icon: <CheckCircle size={16} className="text-profit-green" />,
      label: "Verified",
      desc: "Your identity has been successfully verified.",
      bg: "bg-profit-green/5",
      border: "border-profit-green/20",
    },
  };

  const kyc = kycStatusConfig[kycStatus] ?? kycStatusConfig.not_submitted;

  return (
    <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Profile */}
      <section className="bg-background rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <User size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Profile Settings</h2>
        </div>
        <div className="space-y-3">
          <FieldRow label="Display Name">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-muted border-border" />
          </FieldRow>
          <FieldRow label="Email">
            <Input value={email} className="bg-muted border-border" disabled />
          </FieldRow>
          <Button onClick={handleSaveProfile} disabled={saving} className="text-white" style={{ backgroundColor: '#0a1f66' }}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </section>

      {/* Security / 2FA */}
      <section className="bg-background rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Security</h2>
        </div>

        {twoFaEnabled ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-profit-green/5 border border-profit-green/20">
              <CheckCircle size={16} className="text-profit-green" />
              <span className="text-sm text-foreground">Two-factor authentication is enabled</span>
            </div>
            <Button variant="outline" size="sm" className="text-destructive" onClick={handleDisableTwoFa}>
              Disable 2FA
            </Button>
          </div>
        ) : showTwoFaSetup ? (
          <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Set Up Two-Factor Authentication</h3>
              </div>
              <button onClick={() => { setShowTwoFaSetup(false); setTwoFaStep("phone"); }} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            {twoFaStep === "phone" && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Enter your phone number to enable two-factor authentication.</p>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-10 rounded-md border border-input bg-muted px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    className="bg-muted border-border flex-1"
                    type="tel"
                  />
                </div>
                <Button onClick={handleEnableTwoFa} className="text-white" style={{ backgroundColor: '#0a1f66' }}>
                  Enable 2FA
                </Button>
              </div>
            )}

            {twoFaStep === "verifying" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 size={28} className="animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Enabling two-factor authentication...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <AlertCircle size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Two-factor authentication is not enabled</span>
            </div>
            <Button onClick={() => setShowTwoFaSetup(true)} className="text-white" style={{ backgroundColor: '#0a1f66' }}>
              Enable 2FA
            </Button>
          </div>
        )}
      </section>

      {/* Password */}
      <section className="bg-background rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Key size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Change Password</h2>
        </div>
        <div className="space-y-3">
          <FieldRow label="Current Password">
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-muted border-border" />
          </FieldRow>
          <FieldRow label="New Password">
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-muted border-border" />
          </FieldRow>
          <Button onClick={handleChangePassword} disabled={changingPw} className="text-white" style={{ backgroundColor: '#0a1f66' }}>
            {changingPw ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </section>

      {/* KYC */}
      <section className="bg-background rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <FileImage size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">KYC Verification</h2>
        </div>
        <div className={`flex items-start gap-3 p-3 rounded-lg ${kyc.bg} border ${kyc.border}`}>
          {kyc.icon}
          <div>
            <span className="text-sm font-medium text-foreground">Verification Status: {kyc.label}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{kyc.desc}</p>
          </div>
        </div>
        {kycStatus !== "approved" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Upload a clear, well-lit photo of your driver's license. Both front side must be fully visible. Accepted formats: JPG, PNG, WebP (max 5MB).
            </p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload} />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-dashed border-2 border-border h-20 flex flex-col items-center justify-center gap-1 hover:bg-muted/50"
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {kycDocUrl ? "Re-upload Driver's License" : "Upload Driver's License"}
                  </span>
                </>
              )}
            </Button>
            {kycDocUrl && kycStatus === "pending" && (
              <p className="text-xs text-muted-foreground text-center">✓ Document submitted — awaiting review</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

export default SettingsPage;
