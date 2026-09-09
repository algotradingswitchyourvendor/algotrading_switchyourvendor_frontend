"use client";

import { useState } from "react";
import { ShieldAlert, Lock, KeyRound } from "lucide-react";
import { AdminUnlockModal } from "./AdminUnlockModal";

export function RestrictedScreen() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <AdminUnlockModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "var(--sp-8)",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.04) 0%, transparent 70%), var(--bg-primary)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background rings */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: "1px solid rgba(220,38,38,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "1px solid rgba(220,38,38,0.03)",
            pointerEvents: "none",
          }}
        />

        {/* Icon */}
        <div
          style={{
            position: "relative",
            marginBottom: "var(--sp-8)",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: -24,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              backgroundColor: "rgba(220,38,38,0.06)",
              border: "1.5px solid rgba(220,38,38,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 0 0 8px rgba(220,38,38,0.03)",
            }}
          >
            <ShieldAlert
              size={36}
              color="var(--color-negative)"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Text content */}
        <div
          style={{
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--sp-3)",
          }}
        >
          {/* Badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 10px",
              backgroundColor: "rgba(220,38,38,0.06)",
              border: "1px solid rgba(220,38,38,0.15)",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-negative)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            <Lock size={10} />
            Admin Restricted
          </span>

          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Access Restricted
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "var(--text-tertiary)",
              margin: 0,
              lineHeight: 1.65,
              maxWidth: 340,
            }}
          >
            This section has been restricted by the administrator. If you
            believe you should have access, please contact your system admin.
          </p>
        </div>

        {/* Admin unlock trigger — intentionally subtle */}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            marginTop: "var(--sp-10)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "var(--sp-2) var(--sp-4)",
            background: "none",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-md)",
            color: "var(--text-muted)",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "var(--border-secondary)";
            e.currentTarget.style.color = "var(--text-tertiary)";
            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "var(--border-primary)";
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <KeyRound size={12} />
          Admin Unlock
        </button>

        <style>{`
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.06); }
          }
        `}</style>
      </div>
    </>
  );
}
