"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useMarketStore } from "@/stores/market";
import { useWebSocketStore } from "@/stores/websocket";
import { NAV_ITEMS } from "@/constants/routes";
import { Activity, Bell, ChevronDown, Settings, LogOut, Tag, MessageSquare, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useSubscriptionStore } from "@/stores/subscription";

export function TopNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { plan } = useSubscriptionStore();
  const router = useRouter();
  
  const marketStatusObj = useMarketStore((s) => s.marketStatus);
  const { status: wsStatus } = useWebSocketStore();
  const isConnected = wsStatus === "connected";
  const isLive = (marketStatusObj?.is_open ?? false) && isConnected;

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Format plan for display (e.g. "FREE" -> "Free Plan")
  const displayPlan = plan ? plan.charAt(0) + plan.slice(1).toLowerCase() + " Plan" : "Free Plan";

  return (
    <header 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 50,
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--sp-6)",
      }}
    >
      {/* LEFT: Logo & Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-8)" }}>
        {/* Logo */}
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background: "var(--color-accent)",
              flexShrink: 0,
            }}
          >
            <Activity size={18} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            MarketPulse
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 18px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  color: isActive ? "var(--color-accent)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--color-accent-bg)" : "transparent",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* RIGHT: Status & User */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-6)" }}>
        
        {/* Market Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isLive ? (
            <span className="badge badge-live">
              <span className="live-dot" />
              LIVE
            </span>
          ) : (
            <span className="badge badge-closed">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--color-closed)",
                }}
              />
              CLOSED
            </span>
          )}
          
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)", letterSpacing: "0.04em" }}>
            NSE · BSE · 09:00 – 15:30 IST
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, backgroundColor: "var(--border-primary)" }} />

        {/* Notifications & Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)" }}>
          <button 
            className="btn btn-ghost btn-icon" 
            style={{ position: "relative", color: "var(--text-secondary)" }}
          >
            <Bell size={18} />
            <span 
              style={{
                position: "absolute",
                top: 4,
                right: 6,
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--color-accent)",
                border: "1px solid var(--bg-primary)"
              }}
            />
          </button>

          <div style={{ position: "relative" }}>
            <div 
              style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div 
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: "50%", 
                  backgroundColor: "var(--text-secondary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  {user?.name || "User"}
                </span>
                <span style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 500 }}>
                  {displayPlan}
                </span>
              </div>
              <ChevronDown size={14} style={{ color: "var(--text-tertiary)" }} />
            </div>

            {isUserMenuOpen && (
              <>
                <div 
                  style={{ position: "fixed", inset: 0, zIndex: 90 }} 
                  onClick={() => setIsUserMenuOpen(false)} 
                />
                <div 
                  style={{ 
                    position: "absolute", 
                    top: "calc(100% + 8px)", 
                    right: 0, 
                    width: 220, 
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-md)",
                    zIndex: 100,
                    padding: "8px"
                  }}
                >
                  <Link 
                    href="/settings"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--color-accent)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings size={16} className="text-[var(--text-tertiary)]" />
                    Settings
                  </Link>

                  <Link 
                    href="/settings?tab=plans"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--color-accent)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Tag size={16} className="text-[var(--text-tertiary)]" />
                    My Plan
                  </Link>

                  <Link 
                    href="/help"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--color-accent)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <MessageSquare size={16} className="text-[var(--text-tertiary)]" />
                    Help / Support
                  </Link>

                  <Link 
                    href="/whats-new"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--color-accent)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Star size={16} className="text-[var(--text-tertiary)]" />
                    What’s New
                  </Link>

                  <div style={{ height: 1, backgroundColor: "var(--border-primary)", margin: "6px 0" }} />
                  
                  <button
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await logout();
                      router.push("/auth/sign-in");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--color-accent)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                  >
                    <LogOut size={16} className="text-[var(--text-tertiary)]" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
