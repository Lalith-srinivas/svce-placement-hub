import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { fetchCompleteStudentProfile, getLocalProfile } from "@/lib/profileApi";
import type { CompleteStudentProfile } from "@/types/studentProfile";

interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: CompleteStudentProfile | null;
  hasProfile: boolean;
  isLoading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginDemoStudent: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_ID = "demo-student-svce-2026";
const DEMO_EMAIL = "lalith.student@svce.ac.in";
const DEMO_USER: AuthUser = {
  id: DEMO_USER_ID,
  email: DEMO_EMAIL,
  full_name: "Lalith Srinivas",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<CompleteStudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const p = await fetchCompleteStudentProfile(userId);
      setProfile(p);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. Check if demo session is active
      const demoFlag = localStorage.getItem("svce_demo_session");
      if (demoFlag === "true") {
        if (mounted) {
          setUser(DEMO_USER);
          setIsDemo(true);
          await loadProfile(DEMO_USER_ID);
          setIsLoading(false);
        }
        return;
      }

      // 2. Check local session
      const localActiveUser = localStorage.getItem("svce_active_user");
      if (localActiveUser) {
        try {
          const parsed = JSON.parse(localActiveUser);
          if (parsed && parsed.id && mounted) {
            setUser(parsed);
            setIsDemo(parsed.id === DEMO_USER_ID);
            await loadProfile(parsed.id);
            setIsLoading(false);
            return;
          }
        } catch {
          // ignore corrupted json
        }
      }

      // 3. Check Supabase Auth
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name || "",
            };
            setUser(authUser);
            setIsDemo(false);
            await loadProfile(session.user.id);
          }
        } catch (err) {
          console.warn("Supabase auth session fetch error:", err);
        }
      }

      if (mounted) {
        setIsLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth changes
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || "",
          };
          setUser(authUser);
          setIsDemo(false);
          await loadProfile(session.user.id);
        } else {
          // Only clear if not in demo session or local user
          if (
            localStorage.getItem("svce_demo_session") !== "true" &&
            !localStorage.getItem("svce_active_user")
          ) {
            setUser(null);
            setProfile(null);
          }
        }
        setIsLoading(false);
      });
      authListener = data;
    }

    return () => {
      mounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [loadProfile]);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user is logging in with the Demo student email
    if (
      normalizedEmail === DEMO_EMAIL.toLowerCase() ||
      normalizedEmail === "demo@svce.ac.in" ||
      normalizedEmail === "demo"
    ) {
      localStorage.setItem("svce_demo_session", "true");
      localStorage.setItem("svce_active_user", JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      setIsDemo(true);
      await loadProfile(DEMO_USER_ID);
      setIsLoading(false);
      return {};
    }

    // 2. Check locally saved registered users map
    const localUsersRaw = localStorage.getItem("svce_local_users");
    const localUsers: Record<string, { id: string; email: string; password?: string; full_name?: string }> = localUsersRaw
      ? JSON.parse(localUsersRaw)
      : {};
    const localUser = localUsers[normalizedEmail];

    // 3. Try Supabase Auth first
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          localStorage.removeItem("svce_demo_session");
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || "",
          };
          localStorage.setItem("svce_active_user", JSON.stringify(authUser));
          setUser(authUser);
          setIsDemo(false);
          await loadProfile(data.user.id);
          setIsLoading(false);
          return {};
        }
      } catch (e) {
        console.warn("Supabase signIn exception:", e);
      }
    }

    // 4. If local registered user exists and password matches
    if (localUser && (!localUser.password || localUser.password === password)) {
      localStorage.removeItem("svce_demo_session");
      const authUser: AuthUser = {
        id: localUser.id,
        email: localUser.email,
        full_name: localUser.full_name || "",
      };
      localStorage.setItem("svce_active_user", JSON.stringify(authUser));
      setUser(authUser);
      setIsDemo(false);
      await loadProfile(localUser.id);
      setIsLoading(false);
      return {};
    }

    // 5. Check if this email matches the existing Demo profile's college/personal email
    const demoProfile = getLocalProfile(DEMO_USER_ID);
    if (
      demoProfile &&
      (demoProfile.personal.college_email.toLowerCase() === normalizedEmail ||
        demoProfile.personal.personal_email.toLowerCase() === normalizedEmail)
    ) {
      localStorage.setItem("svce_demo_session", "true");
      localStorage.setItem("svce_active_user", JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
      setIsDemo(true);
      await loadProfile(DEMO_USER_ID);
      setIsLoading(false);
      return {};
    }

    setIsLoading(false);
    return {
      error:
        "Invalid login credentials. Tip: For demo mode, sign in with lalith.student@svce.ac.in or click Quick Demo.",
    };
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();
    const localId = `student-${Date.now()}`;

    // Always store credentials in local storage map
    const localUsersRaw = localStorage.getItem("svce_local_users");
    const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : {};
    localUsers[normalizedEmail] = {
      id: localId,
      email: normalizedEmail,
      password,
      full_name: fullName,
    };
    localStorage.setItem("svce_local_users", JSON.stringify(localUsers));

    // Try Supabase Auth
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (!error && data.user) {
          localStorage.removeItem("svce_demo_session");
          localUsers[normalizedEmail].id = data.user.id;
          localStorage.setItem("svce_local_users", JSON.stringify(localUsers));

          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
          };
          localStorage.setItem("svce_active_user", JSON.stringify(authUser));
          setUser(authUser);
          setIsDemo(false);
          await loadProfile(data.user.id);
          setIsLoading(false);
          return {};
        }
      } catch (err: any) {
        console.warn("Supabase signUp warning:", err);
      }
    }

    // Fallback to local session
    localStorage.removeItem("svce_demo_session");
    const authUser: AuthUser = {
      id: localId,
      email: normalizedEmail,
      full_name: fullName,
    };
    localStorage.setItem("svce_active_user", JSON.stringify(authUser));
    setUser(authUser);
    setIsDemo(false);
    await loadProfile(localId);
    setIsLoading(false);
    return {};
  };

  const signOut = async () => {
    setIsLoading(true);
    localStorage.removeItem("svce_demo_session");
    localStorage.removeItem("svce_active_user");
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("SignOut warning:", e);
      }
    }
    setUser(null);
    setProfile(null);
    setIsDemo(false);
    setIsLoading(false);
  };

  const loginDemoStudent = () => {
    localStorage.setItem("svce_demo_session", "true");
    localStorage.setItem("svce_active_user", JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    setIsDemo(true);
    const existing = getLocalProfile(DEMO_USER_ID);
    setProfile(existing);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const hasProfile = Boolean(profile && profile.personal?.full_name && profile.personal?.register_number);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        hasProfile,
        isLoading,
        isDemo,
        signIn,
        signUp,
        signOut,
        loginDemoStudent,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
