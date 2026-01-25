import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error || !session?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Error cargando perfil:", profileError);
        setProfile(null);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data ?? null);
          setLoading(false);
        });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  };
}
