/**
 * Auth Zustand store.
 *
 * Holds the authenticated user, loading state, and auth actions.
 * The real session cookie (mp_session) is managed by the backend.
 *
 * mp_authenticated is ONLY a frontend route-protection hint for
 * Next.js middleware. It contains no authentication token or user data.
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

  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AUTH_HINT_COOKIE = "mp_authenticated";

function setAuthHint() {
  document.cookie = `${AUTH_HINT_COOKIE}=true; Path=/; SameSite=Lax`;
}

function clearAuthHint() {
  document.cookie = `${AUTH_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
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
        clearAuthHint();

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        return;
      }

      const json = await res.json();
      const user: AuthUser | null = json?.data ?? null;

      const authenticated =
        user !== null && user.status === "ACTIVE";

      if (authenticated) {
        setAuthHint();
      } else {
        clearAuthHint();
      }

      set({
        user,
        isAuthenticated: authenticated,
        isLoading: false,
      });
    } catch {
      clearAuthHint();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await fetch(ENDPOINTS.AUTH_LOGOUT, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Session cleanup continues locally even if backend request fails.
    }

    clearAuthHint();

    useSubscriptionStore.getState().reset();

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user) => {
    const authenticated =
      user !== null && user.status === "ACTIVE";

    if (authenticated) {
      setAuthHint();
    } else {
      clearAuthHint();
    }

    set({
      user,
      isAuthenticated: authenticated,
      isLoading: false,
    });
  },
}));