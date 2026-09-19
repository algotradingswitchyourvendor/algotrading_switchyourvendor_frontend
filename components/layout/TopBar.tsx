"use client";

import { useMarketStore } from "@/stores/market";
import { useWebSocketStore } from "@/stores/websocket";
import { useAuthStore } from "@/stores/auth";
import { BADGE_COLORS } from "@/constants/colors";
import Link from "next/link";
import { LogOut, Settings, UserCircle, ShieldAlert } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function TopBar({ title }: { title: string }) {
  const { marketStatus, lastUpdated, cacheInfo } = useMarketStore();
  const wsStatus = useWebSocketStore((s) => s.status);
  const { user, logout } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusKey = marketStatus?.status || "CLOSED";
  const badgeColor = BADGE_COLORS[statusKey] || BADGE_COLORS.CLOSED;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between border-b px-6 py-3"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-4">
        <h1
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>

        {/* Market Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor.bg} ${badgeColor.text}`}
        >
          {statusKey === "LIVE" && <span className="live-dot" style={{ width: 6, height: 6 }} />}
          {statusKey}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
          {cacheInfo && (
            <span>{cacheInfo.total_instruments.toLocaleString("en-IN")} instruments</span>
          )}
          {lastUpdated && (
            <span>
              Updated{" "}
              {lastUpdated.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
          {wsStatus === "connected" && (
            <span className="flex items-center gap-1">
              <span className="live-dot" style={{ width: 5, height: 5 }} />
              Live
            </span>
          )}
        </div>

        {/* User Menu */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] pl-1 pr-3 py-1 hover:bg-[var(--bg-hover)] transition-colors"
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-6 h-6 rounded-full" />
              ) : (
                <UserCircle size={24} className="text-[var(--text-secondary)]" />
              )}
              <span className="text-sm font-medium text-[var(--text-primary)] max-w-[100px] truncate">
                {user.name.split(" ")[0]}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-[var(--bg-primary)] shadow-lg border border-[var(--border-subtle)] py-1 overflow-hidden z-50">
                <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)] truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      Free Plan
                    </span>
                    {user.role === "ADMIN" && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-500">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ShieldAlert size={16} /> Admin Console
                  </Link>
                )}

                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={16} /> Settings & Billing
                </Link>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full text-left"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
