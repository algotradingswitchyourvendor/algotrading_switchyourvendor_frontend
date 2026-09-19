/**
 * Subscription Zustand store.
 *
 * Single source of truth for the current user's subscription state and entitlements.
 * Fetches from GET /subscriptions/me — which returns the subscription + entitlements dict.
 *
 * Usage:
 *   const { plan, entitlements, isLoading } = useSubscriptionStore();
 *   const { fetchSubscription, invalidate } = useSubscriptionStore();
 */

import { create } from "zustand";
import { ENDPOINTS } from "@/constants/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Entitlements {
  plan: string;
  dashboard: boolean;
  live_data_limit: number;        // -1 = unlimited
  scanner: boolean;
  scanner_daily_limit: number;    // -1 = unlimited
  scanner_ltd: boolean;
  history: boolean;
  history_days: number;           // -1 = unlimited
  advanced_analytics: boolean;
  fii_analytics: boolean;
  advanced_sentiment: boolean;
  max_columns: number;            // -1 = unlimited
  max_presets: number;            // -1 = unlimited
  csv_export: boolean;
  priority_support: boolean;
}

export interface SubscriptionInfo {
  id: string;
  plan: string;                   // FREE | BASIC | PRO | PREMIUM
  price_inr: number;
  status: string;                 // ACTIVE | TRIALING | PAST_DUE | CANCELLED | EXPIRED
  period_start: string | null;
  period_end: string | null;
  razorpay_subscription_id: string | null;
}

interface SubscriptionState {
  /** The effective plan name from entitlements (always accurate, even for FREE) */
  plan: string;
  /** Subscription status or null if no subscription exists */
  status: string | null;
  /** Full entitlements dict returned by the backend */
  entitlements: Entitlements | null;
  /** Raw subscription info (null if free/no subscription) */
  subscription: SubscriptionInfo | null;
  /** Whether the subscription is being loaded */
  isLoading: boolean;
  /** Whether the subscription has been loaded at least once */
  hasLoaded: boolean;
  /** Whether there is an in-flight fetch (prevents double fetches) */
  _fetching: boolean;

  /** Fetch current subscription + entitlements from backend */
  fetchSubscription: () => Promise<void>;

  /**
   * Invalidate and refetch subscription state.
   * Call after a successful payment or cancellation.
   */
  invalidate: () => Promise<void>;

  /** Reset to initial state (call on logout) */
  reset: () => void;
}

// ── Default/empty entitlements for FREE plan ───────────────────────────────────

const FREE_ENTITLEMENTS: Entitlements = {
  plan: "FREE",
  dashboard: true,
  live_data_limit: 100,
  scanner: true,
  scanner_daily_limit: 10,
  scanner_ltd: false,
  history: true,
  history_days: 30,
  advanced_analytics: false,
  fii_analytics: false,
  advanced_sentiment: false,
  max_columns: 10,
  max_presets: 3,
  csv_export: false,
  priority_support: false,
};

// ── Store ──────────────────────────────────────────────────────────────────────

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plan: "FREE",
  status: null,
  entitlements: null,
  subscription: null,
  isLoading: false,
  hasLoaded: false,
  _fetching: false,

  fetchSubscription: async () => {
    // Prevent duplicate concurrent fetches
    if (get()._fetching) return;

    set({ isLoading: true, _fetching: true });
    try {
      const res = await fetch(ENDPOINTS.MY_SUBSCRIPTION, {
        credentials: "include",
      });

      if (!res.ok) {
        // Unauthenticated or error — default to FREE
        set({
          plan: "FREE",
          status: null,
          entitlements: FREE_ENTITLEMENTS,
          subscription: null,
          isLoading: false,
          hasLoaded: true,
          _fetching: false,
        });
        return;
      }

      const json = await res.json();
      const data = json?.data;

      const entitlements: Entitlements = data?.entitlements ?? FREE_ENTITLEMENTS;
      const subscription: SubscriptionInfo | null = data?.subscription ?? null;

      set({
        plan: entitlements.plan ?? "FREE",
        status: subscription?.status ?? null,
        entitlements,
        subscription,
        isLoading: false,
        hasLoaded: true,
        _fetching: false,
      });
    } catch {
      // Network error — default to FREE, do not block the UI
      set({
        plan: "FREE",
        status: null,
        entitlements: FREE_ENTITLEMENTS,
        subscription: null,
        isLoading: false,
        hasLoaded: true,
        _fetching: false,
      });
    }
  },

  invalidate: async () => {
    // Force re-fetch by resetting hasLoaded and _fetching
    set({ hasLoaded: false, _fetching: false });
    await get().fetchSubscription();
  },

  reset: () => {
    set({
      plan: "FREE",
      status: null,
      entitlements: null,
      subscription: null,
      isLoading: false,
      hasLoaded: false,
      _fetching: false,
    });
  },
}));
