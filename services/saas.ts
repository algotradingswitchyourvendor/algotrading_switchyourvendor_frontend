/**
 * Auth & Subscription service functions.
 */

import { ENDPOINTS } from "@/constants/api";
import { api } from "./api";

// ── Auth ──────────────────────────────────────────────────────────────

export async function fetchMe() {
  return fetch(ENDPOINTS.AUTH_ME, { credentials: "include" }).then((r) =>
    r.json()
  );
}

// ── Subscriptions ─────────────────────────────────────────────────────

export async function fetchPlans() {
  return api.get(ENDPOINTS.PLANS);
}

export async function fetchMySubscription() {
  return api.get(ENDPOINTS.MY_SUBSCRIPTION, {}, { credentials: "include" } as RequestInit);
}

export async function createSubscription(plan_name: string) {
  return api.post(ENDPOINTS.CREATE_SUBSCRIPTION, { plan_name });
}

export async function cancelSubscription() {
  return api.post(ENDPOINTS.CANCEL_SUBSCRIPTION, {});
}

// ── Admin ─────────────────────────────────────────────────────────────

const ADMIN_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "/api/v1") + "/admin";

async function adminGet(path: string, params?: Record<string, string>) {
  const url = new URL(ADMIN_BASE + path, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), { credentials: "include" });
  return res.json();
}

export async function fetchAdminStats() {
  return adminGet("/stats");
}

export async function fetchAdminSystemHealth() {
  return adminGet("/system/health");
}

export async function fetchAdminUsers(params?: {
  page?: number;
  search?: string;
  status?: string;
  role?: string;
}) {
  const p: Record<string, string> = {};
  if (params?.page) p.page = String(params.page);
  if (params?.search) p.search = params.search;
  if (params?.status) p.status = params.status;
  if (params?.role) p.role = params.role;
  return adminGet("/users", p);
}

export async function fetchAdminUser(userId: string) {
  return adminGet(`/users/${userId}`);
}

export async function updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED") {
  const res = await fetch(`${ADMIN_BASE}/users/${userId}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchAdminSubscriptions(params?: { page?: number; status?: string }) {
  const p: Record<string, string> = {};
  if (params?.page) p.page = String(params.page);
  if (params?.status) p.status = params.status;
  return adminGet("/subscriptions", p);
}

export async function fetchAdminPayments(params?: { page?: number }) {
  const p: Record<string, string> = {};
  if (params?.page) p.page = String(params.page);
  return adminGet("/payments", p);
}

export async function fetchAdminAuditLogs(params?: { page?: number }) {
  const p: Record<string, string> = {};
  if (params?.page) p.page = String(params.page);
  return adminGet("/audit-logs", p);
}
