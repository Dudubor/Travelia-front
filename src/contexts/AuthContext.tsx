// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

interface User {
  email: string;
  name: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  forgotPassword: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Axios base (usa cookie httpOnly se existir; e aceita token se você quiser) ---
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // ex: http://localhost:3333
  withCredentials: true, // envia/recebe cookies (se o backend usar)
  headers: { "Content-Type": "application/json" },
});

// Se o backend devolver token (Bearer), podemos salvar num header em memória/localStorage:
function applyToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("travelai_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("travelai_token");
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Interceptor 401: se o token/cookie expirar, limpar estado
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (err: AxiosError) => {
        if (err.response?.status === 401) {
          setUser(null);
          applyToken(null);
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  // Restaura token em memória (se estiver usando Bearer) e tenta buscar o /auth/me
  useEffect(() => {
    const existingToken = localStorage.getItem("travelai_token");
    if (existingToken) applyToken(existingToken);
    refreshMe().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      // Suporte a formatos comuns: {user}, {data:{user}}, ou o próprio user
      const foundUser: User | null =
        data?.user ?? data?.data?.user ?? (data?.email && data?.name ? data : null);
      setUser(foundUser ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      // Se voltar token, aplica:
      applyToken(data?.token);
      // Busca o usuário atual
      await refreshMe();
      return { success: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Erro ao criar conta";
      return { success: false, error: msg };
    }
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      applyToken(data?.token);
      await refreshMe();
      return { success: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Email ou senha incorretos";
      return { success: false, error: msg };
    }
  }, [refreshMe]);

   const forgotPassword = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      await api.post("/auth/forgot-password", { email, password });
      return { success: true };
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Não foi possível iniciar a recuperação de senha";
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // se não existir, tudo bem: só limpa estado
    } catch (_) {
      // ignorar
    } finally {
      setUser(null);
      applyToken(null);
    }
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    refreshMe,
  }), [user, loading, login, register, logout, forgotPassword, refreshMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
