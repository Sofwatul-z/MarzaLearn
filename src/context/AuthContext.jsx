import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserProfile, logout as logoutService } from "../services/auth";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  async function syncSession(session) {
    setLoading(true);
    setAuthError(null);

    if (!session?.user) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    setUser(session.user);

    try {
      const profileData = await getUserProfile(session.user.id);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to load MarzaLearn profile:", error);
      setProfile(null);
      setAuthError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error("Failed to restore Supabase session:", error);
        setAuthError(error);
        setLoading(false);
        return;
      }

      await syncSession(session);
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) syncSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    setLoading(true);

    try {
      await logoutService();
      setUser(null);
      setProfile(null);
      setAuthError(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshProfile() {
    if (!user?.id) return null;

    const profileData = await getUserProfile(user.id);
    setProfile(profileData);
    return profileData;
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      authError,
      signOut,
      refreshProfile,
      isAuthenticated: Boolean(user),
    }),
    [user, profile, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
