"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ScanSearch,
  Clock,
  Settings,
  Activity,
  CalendarClock,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { useWebSocketStore } from "@/stores/websocket";
import { useRestrictionStore } from "@/stores/restriction";
import { NAV_ITEMS, RESTRICTED_ROUTES } from "@/constants/routes";
import { useState } from "react";
import { AdminUnlockModal } from "./AdminUnlockModal";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  ScanSearch,
  Clock,
  Settings,
  CalendarClock,
};

function NavItem({
  href,
  icon: iconName,
  label,
  isActive,
  isRestricted,
  onRestrictedClick,
}: {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  isRestricted: boolean;
  onRestrictedClick: () => void;
}) {
  const Icon = ICON_MAP[iconName];
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!Icon) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (isRestricted) {
      e.preventDefault();
      onRestrictedClick();
    } else {
      router.push(href);
    }
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={isRestricted ? `${label} — restricted` : label}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick(e as unknown as React.MouseEvent);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
          color: isActive
            ? "var(--color-accent)"
            : isRestricted
            ? "var(--text-muted)"
            : "var(--text-tertiary)",
          backgroundColor: isActive ? "var(--color-accent-bg)" : "transparent",
          position: "relative",
          transition: "all var(--transition-fast)",
          cursor: isRestricted ? "not-allowed" : "pointer",
          opacity: isRestricted ? 0.55 : 1,
        }}
        onMouseOver={(e) => {
          if (!isActive && !isRestricted) {
            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }
        }}
        onMouseOut={(e) => {
          if (!isActive && !isRestricted) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-tertiary)";
          }
        }}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span
            style={{
              position: "absolute",
              left: -14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 24,
              borderRadius: "0 3px 3px 0",
              backgroundColor: "var(--color-accent)",
            }}
          />
        )}
        <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />

        {/* Restricted lock badge */}
        {isRestricted && (
          <span
            style={{
              position: "absolute",
              bottom: 6,
              right: 6,
              width: 13,
              height: 13,
              borderRadius: "50%",
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={7} color="var(--text-muted)" strokeWidth={2.5} />
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="tooltip-content">
          {label}
          {isRestricted && (
            <span
              style={{
                display: "block",
                fontSize: 10,
                color: "var(--color-negative)",
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              Restricted by Admin
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { status: wsStatus } = useWebSocketStore();
  const isConnected = wsStatus === "connected";
  const { isRestricted, isUnlocked } = useRestrictionStore();

  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  return (
    <>
      <AdminUnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
      />

      <aside className="app-sidebar">
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            marginBottom: "var(--sp-5)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-accent)",
            flexShrink: 0,
          }}
        >
          <Activity size={20} color="#ffffff" strokeWidth={2.5} />
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--sp-1)",
            flex: 1,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const routeIsRestricted =
              isRestricted &&
              !isUnlocked &&
              RESTRICTED_ROUTES.includes(item.href);

            return (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/")
                }
                isRestricted={routeIsRestricted}
                onRestrictedClick={() => setUnlockModalOpen(true)}
              />
            );
          })}
        </nav>

        {/* Connection status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "var(--sp-2)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: isConnected
                ? "var(--color-live)"
                : "var(--text-muted)",
              boxShadow: isConnected
                ? "0 0 6px var(--color-live-glow)"
                : "none",
              animation: isConnected
                ? "pulse-live 2s ease-in-out infinite"
                : "none",
            }}
            title={isConnected ? "WebSocket Connected" : "Disconnected"}
          />
        </div>
      </aside>
    </>
  );
}
