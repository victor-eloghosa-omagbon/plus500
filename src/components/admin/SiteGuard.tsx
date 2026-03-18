import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const SiteGuard = ({ children }: { children: ReactNode }) => {
  const { siteEnabled, loading } = useSiteSettings();
  const location = useLocation();

  // Allow admin routes always
  if (location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  if (loading) return null;

  if (siteEnabled === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Page not found</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SiteGuard;
