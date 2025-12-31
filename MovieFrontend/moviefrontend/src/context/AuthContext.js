import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const TOKEN_KEY = "token";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Optional: basic hydrate user when token exists
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    if (!user) setUser({ isAuthenticated: true });
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });

      const jwt = res?.token;
      if (!jwt) throw new Error("Token not returned from API");

      localStorage.setItem(TOKEN_KEY, jwt);
      setToken(jwt);

      const u = res?.user || { email };
      setUser(u);

      return { success: true, token: jwt, user: u };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      await registerUser(payload);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message:
          err?.response?.data?.message || err?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
