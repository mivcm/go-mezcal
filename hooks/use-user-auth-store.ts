import { create } from "zustand";
import axios from "axios";

interface UserAuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  user: { email: string; admin: boolean } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setTokenFromStorage: () => Promise<void>;
}

export const useUserAuthStore = create<UserAuthState>((set) => ({
  token: null,
  loading: false,
  error: null,
  isAdmin: false,
  user: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("http://localhost:3001/api/v1/login", { email, password });
      set({ token: res.data.token, loading: false, error: null });
      localStorage.setItem("user_token", res.data.token);
      // Obtener datos del usuario con el token
      const me = await axios.get("http://localhost:3001/api/v1/me", {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });
      set({ user: me.data.user, isAdmin: !!me.data.user.admin });
      localStorage.setItem("user_is_admin", me.data.user.admin ? "1" : "0");
      localStorage.setItem("user_email", me.data.user.email);
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error de autenticación", loading: false });
    }
  },
  logout: () => {
    set({ token: null, isAdmin: false, user: null });
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_is_admin");
    localStorage.removeItem("user_email");
  },
  setTokenFromStorage: async () => {
    const token = localStorage.getItem("user_token");
    if (token) {
      try {
        const me = await axios.get("http://localhost:3001/api/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ token, user: me.data.user, isAdmin: !!me.data.user.admin });
      } catch {
        set({ token: null, user: null, isAdmin: false });
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_is_admin");
        localStorage.removeItem("user_email");
      }
    }
  },
}));
