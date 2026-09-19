import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/constants/api";
import { useAuthStore } from "@/stores/auth";

// -- Types --

export interface UserPreferences {
  default_exchange: string;
  default_page_size: number;
  timezone: string;
}

export interface UserSession {
  id: string;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
  expires_at: string;
  is_current: boolean;
}

export interface UserConnection {
  provider: string;
  provider_account_id: string;
  created_at: string;
}

export interface BillingHistory {
  id: string;
  amount_inr: number;
  currency: string;
  status: string;
  razorpay_payment_id: string | null;
  created_at: string;
}

// -- Helpers --

async function fetchAuth<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || json.message || "An error occurred");
  }
  return json.data;
}

// -- Hooks --

export function useProfileMutation() {
  const queryClient = useQueryClient();
  const fetchUser = useAuthStore((state) => state.fetchUser);

  return useMutation({
    mutationFn: (data: { name: string }) =>
      fetchAuth(ENDPOINTS.PROFILE_UPDATE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Refresh global auth store user
      fetchUser();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

export function useUserPreferences() {
  return useQuery<UserPreferences>({
    queryKey: ["user-preferences"],
    queryFn: () => fetchAuth(ENDPOINTS.PREFERENCES),
  });
}

export function useUpdatePreferencesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserPreferences>) =>
      fetchAuth(ENDPOINTS.PREFERENCES, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
    },
  });
}

export function useUserSessions() {
  return useQuery<UserSession[]>({
    queryKey: ["user-sessions"],
    queryFn: () => fetchAuth(ENDPOINTS.SESSIONS),
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      fetchAuth(ENDPOINTS.REVOKE_SESSION(sessionId), {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
    },
  });
}

export function useUserConnections() {
  return useQuery<UserConnection[]>({
    queryKey: ["user-connections"],
    queryFn: () => fetchAuth(ENDPOINTS.CONNECTIONS),
  });
}

export function useBillingHistory() {
  return useQuery<BillingHistory[]>({
    queryKey: ["billing-history"],
    queryFn: () => fetchAuth(ENDPOINTS.BILLING_HISTORY),
  });
}

export function usePlans() {
  return useQuery<any[]>({
    queryKey: ["plans"],
    queryFn: () => fetchAuth(ENDPOINTS.PLANS),
  });
}

export function useMySubscription() {
  return useQuery<any>({
    queryKey: ["my-subscription"],
    queryFn: () => fetchAuth(ENDPOINTS.MY_SUBSCRIPTION),
  });
}
