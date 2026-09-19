"use client";

/**
 * UpgradePrompt — Locked feature UI component.
 *
 * Displays a MarketPulse-styled "upgrade required" card with:
 * - Current plan badge
 * - Locked feature name
 * - Required plan name
 * - Explanation message
 * - "View Plans" button → /settings?tab=plans&feature=FEATURE&returnTo=PATH
 *
 * Matches MarketPulse design tokens (orange accent, dark grid, card border style).
 */

import Link from "next/link";
import { Lock, ArrowRight, Zap } from "lucide-react";

interface UpgradePromptProps {
  /** The internal feature key (e.g., "scanner_ltd") */
  feature: string;
  /** Human-readable feature name (e.g., "Scanner LTD") */
  featureLabel?: string;
  /** The plan name required (e.g., "PRO") */
  requiredPlan: string;
  /** The user's current plan name */
  currentPlan?: string;
  /** Custom message to show */
  message?: string;
  /** Current route to return to after upgrade */
  returnTo?: string;
  /** If true, renders inline (smaller) rather than full-page */
  inline?: boolean;
}

const PLAN_DISPLAY_LABELS: Record<string, string> = {
  FREE: "Free",
  BASIC: "Basic",
  PRO: "Pro",
  PREMIUM: "Premium",
};

function getPlanLabel(plan: string) {
  return PLAN_DISPLAY_LABELS[plan?.toUpperCase()] ?? plan;
}

export function UpgradePrompt({
  feature,
  featureLabel,
  requiredPlan,
  currentPlan = "FREE",
  message,
  returnTo,
  inline = false,
}: UpgradePromptProps) {
  const upgradeUrl = `/settings?tab=plans&feature=${encodeURIComponent(feature)}${
    returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : ""
  }`;

  const displayMessage =
    message ||
    `${featureLabel ?? feature} requires the ${getPlanLabel(requiredPlan)} plan.`;

  if (inline) {
    return (
      <div
        role="status"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-md)",
          fontSize: 13,
        }}
      >
        <Lock size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
        <span style={{ color: "var(--text-secondary)", flex: 1 }}>
          {displayMessage}
        </span>
        <Link
          href={upgradeUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 10px",
            backgroundColor: "var(--color-accent)",
            color: "#fff",
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
          aria-label={`Upgrade to ${getPlanLabel(requiredPlan)} plan`}
        >
          Upgrade <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        gap: 20,
        minHeight: 320,
      }}
    >
      {/* Lock icon circle */}
      <div
        aria-hidden="true"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(255,107,0,0.08)",
          border: "1px solid rgba(255,107,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Lock size={28} style={{ color: "var(--color-accent)" }} />
      </div>

      {/* Feature name */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {featureLabel ?? feature}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            margin: 0,
            maxWidth: 360,
          }}
        >
          {displayMessage}
        </p>
      </div>

      {/* Plan comparison badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            padding: "4px 10px",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-tertiary)",
          }}
        >
          Current: {getPlanLabel(currentPlan)}
        </span>
        <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
        <span
          style={{
            padding: "4px 10px",
            backgroundColor: "rgba(255,107,0,0.08)",
            border: "1px solid rgba(255,107,0,0.3)",
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-accent)",
          }}
        >
          Required: {getPlanLabel(requiredPlan)}
        </span>
      </div>

      {/* CTA button */}
      <Link
        href={upgradeUrl}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          backgroundColor: "var(--color-accent)",
          color: "#fff",
          borderRadius: "var(--radius-md)",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
          transition: "background-color 0.15s ease",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent-hover, #e85d00)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-accent)";
        }}
        aria-label={`View ${getPlanLabel(requiredPlan)} plan`}
      >
        <Zap size={15} />
        View {getPlanLabel(requiredPlan)} Plan
      </Link>
    </div>
  );
}
