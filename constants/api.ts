// API configuration constants

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

// WebSocket URL: use wss:// in HTTPS context, ws:// in HTTP (local dev)
export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/v1/ws`
    : "ws://localhost:8000/api/v1/ws");

export const ENDPOINTS = {
  // Market data
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  STOCKS: `${API_BASE_URL}/stocks`,
  STOCK_DETAIL: (symbol: string) => `${API_BASE_URL}/stocks/${encodeURIComponent(symbol)}`,
  HISTORY: `${API_BASE_URL}/history`,
  HISTORY_DATES: `${API_BASE_URL}/history/dates`,
  HISTORY_TIMELINE: (symbol: string) => `${API_BASE_URL}/history/timeline/${encodeURIComponent(symbol)}`,
  METADATA: `${API_BASE_URL}/metadata`,
  COLUMNS: `${API_BASE_URL}/columns`,
  MARKET_STATUS: `${API_BASE_URL}/market-status`,
  SCANNER: `${API_BASE_URL}/scanner`,
  SCANNER_QUERY: `${API_BASE_URL}/scanner/query`,
  SCANNER_PRESETS: `${API_BASE_URL}/scanner/presets`,
  HEALTH: `${API_BASE_URL}/health`,

  // Auth
  AUTH_ME: `${API_BASE_URL}/auth/me`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  AUTH_GOOGLE: `${API_BASE_URL}/auth/google`,
  AUTH_UPSTOX: `${API_BASE_URL}/auth/upstox`,
  AUTH_ZERODHA: `${API_BASE_URL}/auth/zerodha`,
  
  // Users
  PROFILE_UPDATE: `${API_BASE_URL}/users/profile`,
  PREFERENCES: `${API_BASE_URL}/users/preferences`,
  CONNECTIONS: `${API_BASE_URL}/users/connections`,
  SESSIONS: `${API_BASE_URL}/users/sessions`,
  REVOKE_SESSION: (id: string) => `${API_BASE_URL}/users/sessions/${id}`,
  BILLING_HISTORY: `${API_BASE_URL}/users/billing/history`,

  // Subscriptions
  PLANS: `${API_BASE_URL}/subscriptions/plans`,
  MY_SUBSCRIPTION: `${API_BASE_URL}/subscriptions/me`,
  CREATE_SUBSCRIPTION: `${API_BASE_URL}/payments/create-subscription`,
  CANCEL_SUBSCRIPTION: `${API_BASE_URL}/subscriptions/cancel`,
} as const;
