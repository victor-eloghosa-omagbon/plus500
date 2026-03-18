import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  const [siteEnabled, setSiteEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("site_enabled")
        .limit(1)
        .single();
      setSiteEnabled(data?.site_enabled ?? true);
      setLoading(false);
    };
    check();
  }, []);

  return { siteEnabled, loading };
};
