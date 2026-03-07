import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

async function fetchProfiles(user) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Exception in fetchProfiles:", err);
    return [];
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthChange = useCallback(async (session) => {
    if (session?.user) {
      const fetchedProfiles = await fetchProfiles(session.user);
      setUser(session.user);
      setProfiles(fetchedProfiles);

      // Intentamos recuperar el perfil activo del localStorage o usamos el primero
      const savedProfileId = localStorage.getItem("activeProfileId");
      const foundProfile = fetchedProfiles.find((p) => p.id === savedProfileId);

      if (foundProfile) {
        setActiveProfile(foundProfile);
      } else if (fetchedProfiles.length > 0) {
        setActiveProfile(fetchedProfiles[0]);
      } else {
        setActiveProfile(null);
      }
    } else {
      setUser(null);
      setProfiles([]);
      setActiveProfile(null);
      localStorage.removeItem("activeProfileId");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleAuthChange(session);
      },
    );

    return () => {
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, [handleAuthChange]);

  const refresh = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      await handleAuthChange(session);
    }
  }, [handleAuthChange]);

  const switchProfile = useCallback(
    (profileId) => {
      const profileToActivate = profiles.find((p) => p.id === profileId);
      if (profileToActivate) {
        setActiveProfile(profileToActivate);
        localStorage.setItem("activeProfileId", profileId);
      }
    },
    [profiles],
  );

  return {
    user,
    profiles,
    activeProfile,
    loading,
    isAuthenticated: !!user,
    switchProfile,
    refresh,
  };
}
