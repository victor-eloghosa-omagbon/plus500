import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Plus500Logo from "@/components/Plus500Logo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check if user is suspended
        const { data: profile } = await supabase
          .from("profiles")
          .select("suspended")
          .eq("user_id", signInData.user.id)
          .single();

        if (profile?.suspended) {
          await supabase.auth.signOut();
          toast.error("Your account has been suspended. Please contact support.");
          setLoading(false);
          return;
        }

        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(error.message);
  };

  const handleAppleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Logo */}
      <div className="pt-8 pb-6 flex flex-col items-center">
        <Plus500Logo className="h-10 w-auto text-primary" />
        <span className="mt-1 text-xs font-bold tracking-widest text-primary-foreground bg-primary px-2.5 py-0.5 rounded">
          FUTURES
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-0 top-3 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-8 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-primary shadow-none bg-transparent"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-0 top-3 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-8 pr-10 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-primary shadow-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg text-base"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Log In"
                : "Create Account"}
            </Button>

            {/* Toggle */}
            <p
              className="text-right text-sm text-primary cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>

            {/* Divider */}
            <p className="text-center text-sm text-gray-400">
              or {isLogin ? "log in" : "create an account"} with
            </p>

            {/* Social buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-11 h-11 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleAppleSignIn}
                className="w-11 h-11 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Live Support bar */}
          <div
            className="bg-gray-100 py-3 flex items-center justify-center gap-2 text-sm text-primary font-medium cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => { setShowSupport(true); setSupportSubmitted(false); setSupportEmail(""); }}
          >
            <MessageSquare size={16} />
            Live Support
          </div>

          {/* Support Modal */}
          {showSupport && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowSupport(false)}>
              <div
                className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-xl relative animate-in slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowSupport(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare size={20} className="text-primary" />
                  <h3 className="text-base font-semibold text-foreground">Live Support</h3>
                </div>

                {supportSubmitted ? (
                  <div className="mt-4 space-y-2 text-center">
                    <p className="text-sm text-foreground font-medium">Thank you!</p>
                    <p className="text-sm text-muted-foreground">Our support team will get back to you at <span className="font-medium text-foreground">{supportEmail}</span> shortly.</p>
                    <Button className="mt-4 w-full" onClick={() => setShowSupport(false)}>Close</Button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSupportSubmitted(true);
                    }}
                    className="mt-4 space-y-4"
                  >
                    <p className="text-sm text-muted-foreground">Enter your email and our support team will get back to you as soon as possible.</p>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        required
                        className="pl-9"
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit</Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-6 pt-10 text-center text-xs text-gray-400 px-4 space-y-1">
        <p>
          This site is protected by reCAPTCHA and by Google's{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a> and{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
        </p>
        <p>Plus500 is a trademark of Plus500 Ltd.</p>
      </div>
    </div>
  );
};

export default Auth;
