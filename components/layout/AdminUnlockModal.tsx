"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldOff, Eye, EyeOff, X, Lock, Unlock } from "lucide-react";
import { useRestrictionStore } from "@/stores/restriction";

interface AdminUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminUnlockModal({ isOpen, onClose }: AdminUnlockModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { unlock, lock, isVerifying, unlockError, isUnlocked, clearError } =
    useRestrictionStore();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && !isUnlocked) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setPassword("");
      setShowPassword(false);
      clearError();
    }
  }, [isOpen, isUnlocked, clearError]);

  // Shake animation on error
  useEffect(() => {
    if (unlockError) {
      setShake(true);
      setPassword("");
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [unlockError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isVerifying) return;
    await unlock(password);
  };

  const handleLock = () => {
    lock();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          animation: "fadeIn 0.15s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: "100%",
          maxWidth: 420,
          padding: "0 var(--sp-4)",
          animation: "slideUp 0.2s ease",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-lg, 12px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.24)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--sp-5) var(--sp-5) 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  backgroundColor: isUnlocked
                    ? "rgba(22, 163, 74, 0.1)"
                    : "rgba(220, 38, 38, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isUnlocked ? (
                  <Unlock size={16} color="var(--color-positive)" />
                ) : (
                  <Lock size={16} color="var(--color-negative)" />
                )}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  {isUnlocked ? "Routes Unlocked" : "Admin Authentication"}
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    margin: 0,
                    marginTop: 2,
                  }}
                >
                  {isUnlocked
                    ? "Restricted routes are accessible this session"
                    : "Enter your admin password to unlock restricted routes"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-tertiary)",
                padding: 4,
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "var(--sp-5)" }}>
            {isUnlocked ? (
              /* Unlocked state — show lock option */
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--sp-3)",
                    padding: "var(--sp-4)",
                    backgroundColor: "rgba(22, 163, 74, 0.05)",
                    border: "1px solid rgba(22, 163, 74, 0.15)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Unlock size={18} color="var(--color-positive)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                    All restricted routes are currently accessible. You can re-enable restrictions
                    by locking them below.
                  </p>
                </div>
                <button
                  onClick={handleLock}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--sp-2)",
                    width: "100%",
                    padding: "var(--sp-3)",
                    backgroundColor: "rgba(220, 38, 38, 0.06)",
                    border: "1px solid rgba(220, 38, 38, 0.2)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-negative)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.06)";
                  }}
                >
                  <ShieldOff size={14} />
                  Lock All Restricted Routes
                </button>
              </div>
            ) : (
              /* Locked state — show password form */
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
                <div
                  style={{
                    animation: shake ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both" : "none",
                  }}
                >
                  <label
                    htmlFor="admin-password"
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "var(--sp-2)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Admin Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      ref={inputRef}
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (unlockError) clearError();
                      }}
                      placeholder="Enter admin password"
                      autoComplete="current-password"
                      disabled={isVerifying}
                      style={{
                        width: "100%",
                        padding: "var(--sp-3) 44px var(--sp-3) var(--sp-4)",
                        border: `1px solid ${unlockError ? "var(--color-negative)" : "var(--border-primary)"}`,
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        fontSize: 14,
                        outline: "none",
                        fontFamily: unlockError ? "inherit" : "var(--font-mono)",
                        letterSpacing: showPassword ? "normal" : "0.15em",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s ease",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        padding: 4,
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Error message */}
                  {unlockError && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--color-negative)",
                        margin: "var(--sp-2) 0 0",
                        fontWeight: 500,
                      }}
                    >
                      {unlockError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || !password.trim()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--sp-2)",
                    width: "100%",
                    padding: "var(--sp-3)",
                    backgroundColor:
                      isVerifying || !password.trim()
                        ? "var(--bg-tertiary)"
                        : "var(--color-accent)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    color:
                      isVerifying || !password.trim()
                        ? "var(--text-muted)"
                        : "#ffffff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor:
                      isVerifying || !password.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!isVerifying && password.trim()) {
                      e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isVerifying && password.trim()) {
                      e.currentTarget.style.backgroundColor = "var(--color-accent)";
                    }
                  }}
                >
                  {isVerifying ? (
                    <>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTop: "2px solid #ffffff",
                          borderRadius: "50%",
                          display: "inline-block",
                          animation: "spin 0.6s linear infinite",
                        }}
                      />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <Unlock size={14} />
                      Unlock Routes
                    </>
                  )}
                </button>

                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  Unauthorized access attempts are logged.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes shake {
          10%, 90%  { transform: translate3d(-2px, 0, 0); }
          20%, 80%  { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60%  { transform: translate3d(6px, 0, 0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
