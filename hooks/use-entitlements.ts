/**
 * useEntitlements — Centralized feature access hook.
 *
 * All feature gating in UI must go through this hook.
 * Do NOT compare plan names directly in pages/components.
 *
 * Source of truth: entitlements returned by GET /subscriptions/me (via subscription store).
 *
 * Usage:
 *   const { canAccess, getLimit, plan, isLoading } = useEntitlements();
 *   canAccess("scanner_ltd")          // → boolean
 *   getLimit("history_days")          // → number (-1 = unlimited)
 *   getLimit("scanner_daily_limit")   // → number (-1 = unlimited)
 */

"use client";

import { useSubscriptionStore, type Entitlements } from "@/stores/subscription";

// ── Feature key type ─────────────────────────────────────────────────────────

export type FeatureKey =
  | "dashboard"
  | "scanner"
  | "scanner_ltd"
  | "history"
  | "advanced_analytics"
  | "fii_analytics"
  | "advanced_sentiment"
  | "csv_export"
  | "priority_support";

// ── Limit key type ───────────────────────────────────────────────────────────

export type LimitKey =
  | "live_data_limit"
  | "scanner_daily_limit"
  | "history_days"
  | "max_columns"
  | "max_presets";

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface EntitlementsHook {
  /** Check if a feature is available on the current plan */
  canAccess: (feature: FeatureKey) => boolean;

  /**
   * Get a numeric limit for a feature.
   * Returns -1 if unlimited, the limit value otherwise.
   * Returns a safe default if entitlements are not yet loaded.
   */
  getLimit: (limit: LimitKey) => number;

  /** Is the limit unlimited? (limit === -1) */
  isUnlimited: (limit: LimitKey) => boolean;

  /** Current plan name: FREE | BASIC | PRO | PREMIUM */
  plan: string;

  /** Subscription status: ACTIVE | TRIALING | PAST_DUE | CANCELLED | EXPIRED | null */
  status: string | null;

  /** Full entitlements object (null while loading) */
  entitlements: Entitlements | null;

  /** True while subscription is being fetched */
  isLoading: boolean;

  /** True once subscription has been fetched at least once */
  hasLoaded: boolean;
}

// Safe defaults for each limit (used before entitlements are loaded)
const LIMIT_DEFAULTS: Record<LimitKey, number> = {
  live_data_limit: 100,
  scanner_daily_limit: 10,
  history_days: 30,
  max_columns: 10,
  max_presets: 3,
};

export function useEntitlements(): EntitlementsHook {
  const { plan, status, entitlements, isLoading, hasLoaded } = useSubscriptionStore();

  const canAccess = (feature: FeatureKey): boolean => {
    if (!entitlements) {
      // While loading, deny access to paid features to prevent flicker
      // All features available to FREE are treated as accessible
      return feature === "dashboard" || feature === "scanner" || feature === "history";
    }
    return Boolean(entitlements[feature]);
  };

  const getLimit = (limit: LimitKey): number => {
    if (!entitlements) {
      return LIMIT_DEFAULTS[limit];
    }
    return entitlements[limit] as number;
  };

  const isUnlimited = (limit: LimitKey): boolean => {
    return getLimit(limit) === -1;
  };

  return {
    canAccess,
    getLimit,
    isUnlimited,
    plan,
    status,
    entitlements,
    isLoading,
    hasLoaded,
  };
}
