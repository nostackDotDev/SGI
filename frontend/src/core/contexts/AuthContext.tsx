import React, { createContext, useContext, useEffect, useState } from "react";
import { request } from "@/lib/request";
import {
  checkPermission,
  getPermissionLabel,
  mapPermissionLabels,
} from "@/lib/authContext";

type Institution = {
  nome: string;
  endereco: string;
  descricao: string | null;
};

type User = {
  nome: string;
  email: string;
  cargo: string;
  instituicao?: Institution | null;
  // Add other fields if available in full response
  id?: string;
  descricao?: string;
  permissoes?: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  hasPermission: (permission: string) => boolean;
  getPermissionLabel: (permission: string) => string;
  mapPermissionLabels: (
    permissions: string[],
  ) => Array<{ key: string; label: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(!user); // If no user in storage, start loading

  const setUserAndStore = (user: User | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  /**
   * Validate current auth state by calling /auth/me
   * Does NOT cause logout on failure - just clears user state
   */
  const refreshAuth = () => {
    return new Promise<void>((resolve) => {
      let completed = false;

      const handleSuccess = () => {
        if (!completed) {
          completed = true;
          resolve();
        }
      };

      const handleError = () => {
        if (!completed) {
          completed = true;
          setUserAndStore(null);
          resolve();
        }
      };

      // Set a timeout for auth validation (5 seconds)
      const timeout = setTimeout(() => {
        handleError();
      }, 5000);

      request(
        "/auth/me",
        "GET",
        {},
        () => {
          clearTimeout(timeout);
          handleSuccess();
        },
        () => {
          clearTimeout(timeout);
          handleError();
        },
      );
    });
  };

  const logout = () => {
    return new Promise<void>((resolve) => {
      request(
        "/auth/logout",
        "POST",
        {},
        () => {
          setUserAndStore(null);
          window.location.href = "/login";
          resolve();
        },
        (err) => {
          console.error("Logout error:", err);
          setUserAndStore(null);
          window.location.href = "/login";
          resolve();
        },
      );
    });
  };

  // =========================================================================
  // INITIAL AUTH CHECK on component mount
  // =========================================================================
  useEffect(() => {
    refreshAuth().then(() => setLoading(false));
  }, []);

  // =========================================================================
  // PROACTIVE TOKEN REFRESH - Every 5 minutes, silently refresh token
  // Prevents sudden 401s for users who remain idle but session is valid
  // =========================================================================
  useEffect(() => {
    if (!user) return; // Skip if not authenticated

    const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    let proactiveRefreshTimer: NodeJS.Timeout | null = null;

    const scheduleProactiveRefresh = () => {
      if (proactiveRefreshTimer) clearTimeout(proactiveRefreshTimer);

      proactiveRefreshTimer = setTimeout(() => {
        // Skip if app is hidden (Visibility API)
        if (document.hidden) {
          scheduleProactiveRefresh(); // Reschedule when page becomes visible
          return;
        }

        console.debug("[Auth] Proactive token refresh");

        // Attempt refresh silently (non-fatal if fails)
        request(
          "/auth/refresh",
          "POST",
          {},
          () => {
            console.debug("[Auth] Proactive refresh succeeded");
            scheduleProactiveRefresh(); // Schedule next refresh
          },
          (err) => {
            console.warn("[Auth] Proactive refresh failed:", err);
            // Non-fatal: log but don't logout (user will refresh on next request)
            // If reactive refresh also fails, user will be logged out then
            scheduleProactiveRefresh(); // Schedule next attempt
          },
        );
      }, REFRESH_INTERVAL);
    };

    scheduleProactiveRefresh();

    return () => {
      if (proactiveRefreshTimer) clearTimeout(proactiveRefreshTimer);
    };
  }, [user]);

  // =========================================================================
  // SESSION VALIDATION on app focus
  // When app regains focus after being backgrounded, validate session
  // This catches token invalidation while app was in background
  // =========================================================================
  useEffect(() => {
    if (!user) return; // Skip if not authenticated

    const handleVisibilityChange = () => {
      // Only re-validate when becoming visible
      if (document.hidden) return;

      console.debug("[Auth] App regained focus, validating session");
      refreshAuth().catch((err) => {
        console.warn("[Auth] Session validation on focus failed:", err);
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshAuth,
        logout,
        setUser: setUserAndStore,
        hasPermission: (permission: string) =>
          checkPermission(user?.permissoes, permission),
        getPermissionLabel,
        mapPermissionLabels,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
