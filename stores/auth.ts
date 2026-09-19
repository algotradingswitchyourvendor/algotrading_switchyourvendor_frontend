/**
 * Auth Zustand store.
 *
 * Holds the authenticated user, loading state, and auth actions.
 * The session cookie (mp_session) is managed by the backend — this store
 * is purely for UI state and does NOT control security.
 *
 * Usage:
 *   const { user, isAuthenticated, isLoading } = useAuthStore();
 */

import { create } from "zustand";
import { ENDPOINTS } from "@/constants/api";
import { useSubscriptionStore } from "./subscription";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  created_at: string | null;
  last_login_at: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** Fetch current user from /auth/me — call on app mount */
  fetchUser: () => Promise<void>;

  /** Log out — clears session cookie via backend, then resets state */
  logout: () => Promise<void>;

  /** Set user directly (after OAuth callback) */
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(ENDPOINTS.AUTH_ME, {
        credentials: "include",
      });
      if (!res.ok) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const json = await res.json();
      const user: AuthUser | null = json?.data ?? null;
      set({
        user,
        isAuthenticated: user !== null && user.status === "ACTIVE",
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch(ENDPOINTS.AUTH_LOGOUT, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // If request fails, still clear local state
    }
    useSubscriptionStore.getState().reset();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    set({
      user,
      isAuthenticated: user !== null && user.status === "ACTIVE",
      isLoading: false,
    });
  },
}));
