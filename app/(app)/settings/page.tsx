"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { useSubscriptionStore } from "@/stores/subscription";
import { 
  Check, Loader2, AlertCircle, User as UserIcon, 
  MonitorSmartphone, Link as LinkIcon, SlidersHorizontal, 
  CreditCard, Shield, Settings2, Trash2, Zap
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ENDPOINTS } from "@/constants/api";

import {
  useProfileMutation,
  useUserPreferences,
  useUpdatePreferencesMutation,
  useUserSessions,
  useRevokeSessionMutation,
  useUserConnections,
  useBillingHistory,
  usePlans,
  useMySubscription,
} from "@/hooks/use-settings";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type TabType = "profile" | "connections" | "sessions" | "preferences" | "plans" | "billing";

const TABS: { id: TabType; label: string; icon: any }[] = [
  { id: "profile", label: "Profile", icon: UserIcon },
  { id: "connections", label: "Connected Accounts", icon: LinkIcon },
  { id: "sessions", label: "Active Sessions", icon: MonitorSmartphone },
  { id: "preferences", label: "Market Preferences", icon: SlidersHorizontal },
  { id: "plans", label: "MarketPulse Plans", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

import { Suspense } from "react";

function SettingsContent() {
  const { user, fetchUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;
  const initialTab = tabParam && TABS.some(t => t.id === tabParam) ? tabParam : "profile";
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // Keep state in sync with URL if user navigates back/forward
  useEffect(() => {
    if (tabParam && TABS.some(t => t.id === tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `/settings?tab=${tab}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-market-grid-fine flex flex-col">
      <div className="flex-1 w-full max-w-[1000px] mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div>
            <span className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] uppercase mb-2 block">Settings</span>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
              Your workspace,<br />
              <span className="text-[var(--color-accent)]">your preferences.</span>
            </h1>
          </div>
          <div className="md:text-right flex flex-col md:items-end justify-center">
             <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-[var(--text-tertiary)] leading-[1.8] max-w-[200px]">
               Same powerful workspace.<br/>
               More control for you.
             </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 relative z-10">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive 
                      ? "bg-white border border-[var(--border-subtle)] text-[var(--color-accent)] shadow-sm" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-[var(--color-accent)]" : "text-[var(--text-tertiary)]"} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full relative z-10">
            <div className={activeTab === "profile" ? "block" : "hidden"}><ProfileSettings /></div>
            <div className={activeTab === "connections" ? "block" : "hidden"}><ConnectionsSettings /></div>
            <div className={activeTab === "sessions" ? "block" : "hidden"}><SessionsSettings /></div>
            <div className={activeTab === "preferences" ? "block" : "hidden"}><PreferencesSettings /></div>
            <div className={activeTab === "plans" ? "block" : "hidden"}><PlansSettings /></div>
            <div className={activeTab === "billing" ? "block" : "hidden"}><BillingSettings /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-64px)] bg-market-grid-fine flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[var(--color-accent)]" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}

// ── Components ───────────────────────────────────────────────────────────────

function ProfileSettings() {
  const { user } = useAuthStore();
  const profileMut = useProfileMutation();
  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    profileMut.mutate({ name: name.trim() });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5">Profile</h2>
        
        {profileMut.isError && (
          <div className="mb-6 p-4 rounded-md bg-red-500/5 border border-red-500/20 text-red-500 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{(profileMut.error as any).message}</p>
          </div>
        )}

        {profileMut.isSuccess && (
          <div className="mb-6 p-4 rounded-md bg-green-500/5 border border-green-500/20 text-green-600 flex items-start gap-3 text-sm">
            <Check size={18} className="mt-0.5 shrink-0" />
            <p>Profile updated successfully.</p>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address (Read-only)</label>
            <input 
              type="email" 
              value={user?.email || ""}
              disabled
              className="px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-black/5 text-[var(--text-tertiary)] cursor-not-allowed"
            />
          </div>

          <button 
            type="submit" 
            disabled={profileMut.isPending || name.trim() === user?.name}
            className="mt-2 flex items-center justify-center w-full md:w-auto self-start px-5 py-2 text-sm bg-[var(--color-accent)] text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {profileMut.isPending ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

function ConnectionsSettings() {
  const { data: connections, isLoading, error } = useUserConnections();

  if (isLoading) return <Loader2 className="animate-spin text-[var(--color-accent)]" />;
  if (error) return <div className="text-red-500 text-sm">Failed to load connections.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Connected Accounts</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Manage the broker and identity providers linked to your account.</p>

        <div className="flex flex-col gap-4">
          {connections?.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No connected accounts found.</p>
          ) : (
            connections?.map((conn) => (
              <div key={`${conn.provider}-${conn.provider_account_id}`} className="flex items-center justify-between p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)]">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] capitalize">{conn.provider}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Connected on {new Date(conn.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-semibold uppercase tracking-wider rounded border border-green-500/20">
                  Connected
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SessionsSettings() {
  const { data: sessions, isLoading, error } = useUserSessions();
  const revokeMut = useRevokeSessionMutation();

  if (isLoading) return <Loader2 className="animate-spin text-[var(--color-accent)]" />;
  if (error) return <div className="text-red-500 text-sm">Failed to load sessions.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Active Sessions</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Review devices currently logged into your account and revoke unfamiliar sessions.</p>

        <div className="flex flex-col gap-4">
          {sessions?.map((session) => (
            <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-secondary)]">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-sm text-[var(--text-primary)]">
                    {session.ip || "Unknown IP"}
                  </h3>
                  {session.is_current && (
                    <span className="px-2 py-0.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-wider rounded border border-[var(--color-accent)]/20">
                      Current Session
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-1 max-w-xl truncate">
                  {session.user_agent || "Unknown Browser/Device"}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  Started: {new Date(session.created_at).toLocaleString()}
                </p>
              </div>
              
              {!session.is_current && (
                <button
                  onClick={() => revokeMut.mutate(session.id)}
                  disabled={revokeMut.isPending}
                  className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors self-start md:self-auto disabled:opacity-50"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreferencesSettings() {
  const { data: prefs, isLoading, error } = useUserPreferences();
  const updateMut = useUpdatePreferencesMutation();

  const [exchange, setExchange] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (prefs) {
      setExchange(prefs.default_exchange);
      setPageSize(prefs.default_page_size);
      setTimezone(prefs.timezone);
    }
  }, [prefs]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMut.mutate({
      default_exchange: exchange,
      default_page_size: pageSize,
      timezone: timezone,
    });
  };

  if (isLoading) return <Loader2 className="animate-spin text-[var(--color-accent)]" />;
  if (error) return <div className="text-red-500 text-sm">Failed to load preferences.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5">Market Preferences</h2>
        
        {updateMut.isError && (
          <div className="mb-6 p-4 rounded-md bg-red-500/5 border border-red-500/20 text-red-500 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{(updateMut.error as any).message}</p>
          </div>
        )}

        {updateMut.isSuccess && (
          <div className="mb-6 p-4 rounded-md bg-green-500/5 border border-green-500/20 text-green-600 flex items-start gap-3 text-sm">
            <Check size={18} className="mt-0.5 shrink-0" />
            <p>Preferences updated successfully.</p>
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Default Exchange</label>
            <select 
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
              <option value="NSE + BSE">NSE + BSE</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Default Page Size</label>
            <select 
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
            <p className="text-xs text-[var(--text-tertiary)]">Affects dashboard tables and scanner results.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Timezone (IANA)</label>
            <input 
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="e.g. Asia/Kolkata"
              className="px-3 py-2 text-sm rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            <p className="text-xs text-[var(--text-tertiary)]">Must be a valid IANA timezone identifier.</p>
          </div>

          <button 
            type="submit" 
            disabled={updateMut.isPending}
            className="mt-2 flex items-center justify-center w-full md:w-auto self-start px-5 py-2 text-sm bg-black text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {updateMut.isPending ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Existing Plans Logic Preserved ──────────────────────────────────────────

interface Plan {
  id: string;
  name: string;
  price_inr: number;
  razorpay_plan_id: string;
  features: Record<string, any>;
  is_active: boolean;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  period_end: string | null;
  cancel_at_period_end?: boolean;
}

function PlansSettings() {
  const { user, fetchUser } = useAuthStore();
  const { data: plansData, isLoading: plansLoading, error: plansError } = usePlans();
  const { data: subData, isLoading: subLoading, error: subError } = useMySubscription();
  const { invalidate: invalidateSubscription } = useSubscriptionStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Feature context from redirect (e.g. ?feature=SCANNER_LTD&returnTo=/scanner-ltd)
  const featureParam = searchParams.get("feature");
  const returnToParam = searchParams.get("returnTo");

  const plans = (plansData as unknown as Plan[]) || [];
  const subscription = subData?.subscription as Subscription | null;
  // Use entitlements.plan as the source of truth for current plan
  const currentPlanName: string = subData?.entitlements?.plan ?? (subscription?.plan ?? "FREE");
  const loading = plansLoading || subLoading;
  const error = plansError ? "Failed to load plans." : subError ? "Failed to load subscription." : checkoutError;

  const handleSubscribe = async (plan: Plan) => {
    if (processingId) return;
    try {
      setProcessingId(plan.id);
      setCheckoutError(null);

      const res = await fetch(ENDPOINTS.CREATE_SUBSCRIPTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_name: plan.name }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.message || data.detail || "Failed to create subscription");

      // Backend returns: subscription_id, short_url, plan_name, amount_inr, razorpay_key_id
      const { subscription_id, razorpay_key_id } = data.data;

      if (!subscription_id || !razorpay_key_id) {
        throw new Error("Invalid payment session. Please try again.");
      }

      const options = {
        key: razorpay_key_id,
        subscription_id: subscription_id,
        name: "MarketPulse",
        description: `${plan.name} Plan`,
        handler: async function () {
          // Post-payment: sync auth + subscription store + TanStack Query
          await fetchUser();
          await invalidateSubscription();
          queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
          // If user was redirected here from a feature gate, return them there
          if (returnToParam) {
            setTimeout(() => router.push(returnToParam), 1200);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setCheckoutError("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err: any) {
      setCheckoutError(err.message || "An error occurred during checkout.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will retain access until the end of the billing period.")) return;
    
    try {
      const res = await fetch(ENDPOINTS.CANCEL_SUBSCRIPTION, { method: "POST", credentials: "include" });
      if (res.ok) {
        await invalidateSubscription();
        queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      } else {
        const data = await res.json();
        setCheckoutError(data.detail?.message || "Failed to cancel subscription.");
      }
    } catch (err) {
      setCheckoutError("An error occurred while canceling.");
    }
  };

  if (loading) return <Loader2 className="animate-spin text-orange-500" />;

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-500 flex items-start gap-3 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Feature Context Banner (shown when redirected from a feature gate) */}
      {featureParam && (
        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3 text-sm">
          <Zap size={18} className="mt-0.5 shrink-0 text-orange-500" />
          <div>
            <p className="font-semibold text-orange-700">Feature requires a higher plan</p>
            <p className="text-orange-600 mt-0.5">
              <span className="font-mono uppercase">{featureParam.replace(/_/g, ' ')}</span> is not available on your current plan.
              Choose a plan below to unlock it.
            </p>
          </div>
        </div>
      )}

      {/* Subscription Status Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Subscription</h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900 tracking-tight uppercase">
                {currentPlanName}
              </span>
              {subscription && subscription.status === "ACTIVE" && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#ECFDF5] text-[#059669] uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
            
            {subscription && subscription.period_end && (
              <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                {subscription.cancel_at_period_end ? (
                  <>Cancels on <span className="font-medium text-gray-900">{new Date(subscription.period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></>
                ) : (
                  <>Renews on <span className="font-medium text-gray-900">{new Date(subscription.period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></>
                )}
              </p>
            )}
            {!subscription && (
              <p className="text-sm text-gray-500 mt-4">
                You are currently on the free tier. Upgrade below to access premium features.
              </p>
            )}
          </div>
          
          {subscription && subscription.status === "ACTIVE" && !subscription.cancel_at_period_end && (
            <button
              onClick={handleCancel}
              className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end mb-6 w-full max-w-[1000px] mx-auto">
        <div className="inline-flex items-center p-1 bg-white border border-gray-200 rounded-full shadow-sm scale-95 origin-right">
          <button 
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              billingCycle === "monthly" 
                ? "bg-[#FFEFDE] text-orange-500" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle("yearly")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              billingCycle === "yearly" 
                ? "bg-[#FFEFDE] text-orange-500" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Yearly 
            <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#059669] text-[10px] font-bold uppercase tracking-wider rounded-full">
              Save 26%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {plans.map((plan) => {
          const isCurrentPlan = plan.name === currentPlanName || (currentPlanName === "FREE" && plan.name === "FREE");
          const isHighlight = plan.name === "BASIC";
          const badge = plan.name === "BASIC" ? "🔥 MOST POPULAR" : undefined;
          
          let displayName = plan.name;
          let description = "";
          if (plan.name === "FREE") { displayName = "FREE"; description = "Perfect to get started"; }
          else if (plan.name === "BASIC") { displayName = "STARTER"; description = "For active learners"; }
          else if (plan.name === "PRO") { displayName = "PRO"; description = "For serious traders"; }
          else if (plan.name === "PREMIUM" || plan.name === "ULTRA") { displayName = "ULTRA"; description = "For professionals"; }
          
          return (
            <div 
              key={plan.id}
              className={`relative flex flex-col bg-white rounded-xl border p-6 transition-shadow hover:shadow-lg ${
                isHighlight 
                  ? "border-orange-500 shadow-sm" 
                  : "border-gray-200"
              }`}
            >
              {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-orange-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-orange-200 flex items-center gap-1 shadow-sm whitespace-nowrap">
                  {badge}
                </div>
              )}
              
              <div className="mb-4 mt-1">
                <h3 className="font-sans text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                  {displayName}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-gray-900">
                    ₹{plan.price_inr}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/ month</span>
                </div>
                <p className="mt-3 text-sm text-gray-500 h-5">{description}</p>
              </div>

              <hr className="border-gray-100 my-5" />
              
              <ul className="space-y-3 mb-8 flex-1">
                {Object.entries(plan.features || {}).map(([key, val], j) => {
                  if (val === false) return null; 
                  
                  let text = key.replace(/_/g, " ");
                  text = text.charAt(0).toUpperCase() + text.slice(1);
                  if (typeof val === "number" && val !== -1) {
                    text = `${val} ${text}`;
                  } else if (val === -1) {
                    text = `Unlimited ${text}`;
                  }
                  
                  return (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                      <Check className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" strokeWidth={2.5} />
                      <span className="leading-relaxed">{text}</span>
                    </li>
                  );
                })}
              </ul>
              
              {plan.name !== "FREE" && !isCurrentPlan && (
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={!!processingId || !plan.razorpay_plan_id}
                  className={`w-full inline-flex items-center justify-center h-12 px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-auto ${
                    isHighlight
                      ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                      : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {processingId === plan.id ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : null}
                  Get Started {isHighlight && "→"}
                </button>
              )}
              
              {isCurrentPlan && (
                <div className="w-full inline-flex items-center justify-center h-12 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-50 border border-gray-200 text-gray-500 mt-auto">
                  Current Plan
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BillingSettings() {
  const { data: payments, isLoading, error } = useBillingHistory();

  if (isLoading) return <Loader2 className="animate-spin text-[var(--color-accent)]" />;
  if (error) return <div className="text-red-500 text-sm">Failed to load billing history.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Billing History</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">View your past payments and invoices.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-[var(--border-subtle)] text-[var(--text-tertiary)]">
              <tr>
                <th className="pb-3 font-semibold px-2">Date</th>
                <th className="pb-3 font-semibold px-2">Amount</th>
                <th className="pb-3 font-semibold px-2">Status</th>
                <th className="pb-3 font-semibold px-2">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
              {payments?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--text-tertiary)]">
                    No billing history found.
                  </td>
                </tr>
              ) : (
                payments?.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-4 px-2">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-2 font-medium">
                      ₹{(payment.amount_inr / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                        payment.status === "SUCCESS" ? "bg-green-500/10 text-green-600 border border-green-500/20" :
                        payment.status === "PENDING" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" :
                        "bg-red-500/10 text-red-600 border border-red-500/20"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-mono text-xs text-[var(--text-secondary)]">
                      {payment.razorpay_payment_id || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
