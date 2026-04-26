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

  const refreshAuth = () => {
    return new Promise<void>((resolve) => {
      request(
        "/auth/me",
        "GET",
        {},
        () => resolve(),
        () => {
          setUserAndStore(null);
          resolve();
        },
      );
      setTimeout(() => resolve(), 100); // fallback
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
          console.error(err);
          setUserAndStore(null);
          window.location.href = "/login";
          resolve();
        },
      );
    });
  };

  useEffect(() => {
    refreshAuth().then(() => setLoading(false));
  }, []);

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
