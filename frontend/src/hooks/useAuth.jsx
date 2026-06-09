import { createContext, useContext, useCallback, useEffect, useState } from "react";

import { api, tokenStore } from "../services/api";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setUser(await authService.me());
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = () => {
    // Redirección de página completa al flujo de Google (backend).
    window.location.href = api.loginUrl();
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAdmin: Boolean(user?.is_admin),
    isAuthenticated: Boolean(user),
    login,
    logout,
    setToken: (token) => tokenStore.set(token),
    refresh: hydrate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
