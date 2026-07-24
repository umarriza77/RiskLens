import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("risklens_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("risklens_token"))
      .finally(() => setLoading(false));
  }, []);

  function persist(data) {
    localStorage.setItem("risklens_token", data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    persist(res.data);
  }

  async function register(email, password, businessName) {
    const res = await api.post("/auth/register", { email, password, businessName });
    persist(res.data);
  }

  function logout() {
    localStorage.removeItem("risklens_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
