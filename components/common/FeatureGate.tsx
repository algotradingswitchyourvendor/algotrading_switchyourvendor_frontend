"use client";

/**
 * FeatureGate — Declarative entitlement gating component.
 *
 * Wraps premium content and conditionally renders it based on the user's
 * subscription entitlements.
 *
 * Usage:
 *   <FeatureGate feature="scanner_ltd" requiredPlan="PRO" returnTo="/scanner-ltd">
 *     <ScannerLTDPage />
 *   </FeatureGate>
 *
 * Behavior:
 *   Loading    → renders skeleton (no premature redirect)
 *   Authorized → renders children
 *   Unauthorized (redirect=true) → redirects to upgrade URL
 *   Unauthorized (redirect=false) → renders UpgradePrompt inline or full
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEntitlements, type FeatureKey } from "@/hooks/use-entitlements";
import { UpgradePrompt } from "./UpgradePrompt";

interface FeatureGateProps {
  /** Feature key to check (maps to entitlements object keys) */
  feature: FeatureKey;
  /** Human-readable feature name for the upgrade prompt */
  featureLabel?: string;
  /** Required plan name for the upgrade prompt */
  requiredPlan: string;
  /** Current path to return to after upgrade */
  returnTo?: string;
  /**
   * If true, redirects to /settings?tab=plans instead of rendering UpgradePrompt.
   * Use this for full-page route guards.
   * Default: true
   */
  redirect?: boolean;
  /** Content to render when access is granted */
  children: React.ReactNode;
  /** Optional custom fallback (if provided, replaces UpgradePrompt when redirect=false) */
  fallback?: React.ReactNode;
  /** Optional skeleton to render while loading */
  skeleton?: React.ReactNode;
}

export function FeatureGate({
  feature,
  featureLabel,
  requiredPlan,
  returnTo,
  redirect = true,
  children,
  fallback,
  skeleton,
}: FeatureGateProps) {
  const router = useRouter();
  const { canAccess, plan, isLoading, hasLoaded } = useEntitlements();

  const hasAccess = canAccess(feature);

  // Build upgrade URL with all context
  const upgradeUrl = `/settings?tab=plans&feature=${encodeURIComponent(feature)}${
    returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""
  }`;

  useEffect(() => {
    // Only redirect after loading is done and access is denied
    if (hasLoaded && !hasAccess && redirect) {
      router.replace(upgradeUrl);
    }
  }, [hasLoaded, hasAccess, redirect, upgradeUrl, router]);

  // Show skeleton while loading subscription state
  if (isLoading || !hasLoaded) {
    return (
      <>
        {skeleton ?? (
          <DefaultSkeleton />
        )}
      </>
    );
  }

  // Access denied
  if (!hasAccess) {
    if (redirect) {
      // Redirect is in progress — don't flash any content
      return <DefaultSkeleton />;
    }

    // Show upgrade prompt inline
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <UpgradePrompt
        feature={feature}
        featureLabel={featureLabel}
        requiredPlan={requiredPlan}
        currentPlan={plan}
        returnTo={returnTo}
      />
    );
  }

  // Access granted
  return <>{children}</>;
}

function DefaultSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "24px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <div
        style={{
          height: 32,
          width: "40%",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--bg-secondary)",
        }}
      />
      <div
        style={{
          height: 16,
          width: "60%",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--bg-secondary)",
        }}
      />
      <div
        style={{
          height: 200,
          width: "100%",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--bg-secondary)",
          marginTop: 8,
        }}
      />
    </div>
  );
}
