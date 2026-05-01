import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ensureUserProfile } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        const sessionUser = data.session?.user ?? null;

        setUser(sessionUser);
        setIsAuthLoading(false);

        if (sessionUser) {
          void ensureUserProfile(sessionUser).catch(console.error);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setUser(null);
          setIsAuthLoading(false);
        }
      }
    }

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;

      setUser(sessionUser);
      setIsAuthLoading(false);

      if (sessionUser) {
        void ensureUserProfile(sessionUser).catch(console.error);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthLoading,
    isAuthenticated: Boolean(user),
  };
}
