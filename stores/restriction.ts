/**
 * Route Restriction Store
 *
 * Manages the "admin locked" state for restricted routes.
 *
 * FLOW:
 *  1. On app mount, `checkToken()` reads localStorage.
 *     If a valid session token exists → isUnlocked = true.
 *  2. Admin enters password → `unlock(password)` hashes it via PBKDF2,
 *     compares against the stored expected hash. On match, writes a
 *     session token to localStorage and sets isUnlocked = true.
 *  3. Admin clicks "Lock Routes" → `lock()` deletes the token from
 *     localStorage and sets isUnlocked = false.
 *
 * The plain-text password NEVER appears in this file.
 */

import { create } from "zustand";
import { verifyAdminPassword } from "@/utils/crypto";

const SESSION_TOKEN_KEY = "mp_restriction_token";
// A deterministic token value — not a secret, just a presence flag.
// The PBKDF2 check is the actual security gate.
const VALID_TOKEN = "mprt_session_unlocked_v1";

interface RestrictionState {
  /** Routes are currently locked (admin-controlled) */
  isRestricted: boolean;
  /** Current browser session has been unlocked via password */
  isUnlocked: boolean;
  /** True while the PBKDF2 hash is being computed */
  isVerifying: boolean;
  /** Non-null when the last password attempt failed */
  unlockError: string | null;

  /** Call once on app mount to hydrate unlock state from localStorage */
  checkToken: () => void;
  /**
   * Attempt to unlock restricted routes with the given password.
   * Returns true on success, false on failure.
   */
  unlock: (password: string) => Promise<boolean>;
  /** Re-enable route restrictions and clear the session token */
  lock: () => void;
  /** Clear any error message */
  clearError: () => void;
}

export const useRestrictionStore = create<RestrictionState>((set) => ({
  isRestricted: true,
  isUnlocked: false,
  isVerifying: false,
  unlockError: null,

  checkToken: () => {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);
      if (token === VALID_TOKEN) {
        set({ isUnlocked: true });
      }
    } catch {
      // localStorage may be unavailable (SSR, private browsing edge cases)
    }
  },

  unlock: async (password: string) => {
    set({ isVerifying: true, unlockError: null });
    try {
      const ok = await verifyAdminPassword(password);
      if (ok) {
        try {
          localStorage.setItem(SESSION_TOKEN_KEY, VALID_TOKEN);
        } catch {
          // ignore storage errors
        }
        set({ isUnlocked: true, isVerifying: false, unlockError: null });
        return true;
      } else {
        set({ isVerifying: false, unlockError: "Incorrect password. Access denied." });
        return false;
      }
    } catch {
      set({ isVerifying: false, unlockError: "Verification error. Please try again." });
      return false;
    }
  },

  lock: () => {
    try {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    } catch {
      // ignore
    }
    set({ isUnlocked: false, unlockError: null });
  },

  clearError: () => set({ unlockError: null }),
}));
