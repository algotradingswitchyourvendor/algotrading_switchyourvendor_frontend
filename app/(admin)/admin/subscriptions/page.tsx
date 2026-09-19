"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS, API_BASE_URL } from "@/constants/api";
import { Loader2, Search, CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null);

  // Auto-clear feedback after 5 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin_subscriptions", page, pageSize, search, statusFilter, planFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (planFilter !== "ALL") params.append("plan", planFilter);

      const res = await fetch(`${API_BASE_URL}/admin/subscriptions?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load subscriptions");
      const json = await res.json();
      return json.data;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load stats");
      const json = await res.json();
      return json.data;
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/admin/subscriptions/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to cancel subscription");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin_stats"] });
      setCancellingId(null);
      setFeedback({ type: "success", message: "Subscription cancelled successfully." });
    },
    onError: (err: any) => {
      setFeedback({ type: "error", message: err.message || "Cancellation failed." });
      setCancellingId(null);
    }
  });

  const handleCancelClick = (sub: any) => {
    if (confirm(`Are you sure you want to cancel the subscription for ${sub.user.email}? This will take effect at the end of their current billing cycle.`)) {
      setCancellingId(sub.id);
      cancelMutation.mutate(sub.id);
    }
  };

  const activeCount = statsData?.subscriptions?.active || 0;
  const totalCount = statsData?.subscriptions?.total || data?.total || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Subscriptions</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage user subscriptions, billing cycles, and plans.</p>
        </div>
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-md border ${feedback.type === 'success' ? 'bg-[var(--color-up-bg)] border-[var(--color-up)] text-[var(--color-up)]' : 'bg-red-500/10 border-red-500 text-red-500'} flex items-center gap-3`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Total Subscriptions</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{totalCount}</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Active</div>
          <div className="text-2xl font-bold text-[var(--color-up)]">{activeCount}</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Canceled</div>
          <div className="text-2xl font-bold text-gray-500">—</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Past Due</div>
          <div className="text-2xl font-bold text-red-500">—</div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={planFilter} 
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="ALL">All Plans</option>
              <option value="FREE">Free</option>
              <option value="BASIC">Basic</option>
              <option value="PRO">Pro</option>
              <option value="PREMIUM">Premium</option>
            </select>
            
            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="TRIALING">Trialing</option>
              <option value="PAST_DUE">Past Due</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <Loader2 className="animate-spin text-[var(--color-accent)]" size={32} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-[var(--text-tertiary)] gap-2">
              <AlertCircle size={32} className="text-red-400" />
              <p>Failed to load subscriptions</p>
              <button onClick={() => refetch()} className="text-[var(--color-accent)] text-sm hover:underline mt-2">Try again</button>
            </div>
          ) : data?.subscriptions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-[var(--text-tertiary)] gap-3">
              <CreditCard size={48} className="opacity-20" />
              <p>No subscriptions found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">User</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Plan</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Price</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Current Period</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {data.subscriptions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-500">
                          {sub.user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{sub.user.name || "Unknown"}</div>
                          <div className="text-[var(--text-tertiary)] text-xs">{sub.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-[var(--text-primary)]">{sub.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                        sub.status === "ACTIVE" 
                          ? "bg-[var(--color-up-bg)] text-[var(--color-up)]" 
                          : sub.status === "CANCELLED"
                          ? "bg-gray-500/10 text-gray-500"
                          : sub.status === "PAST_DUE"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-orange-500/10 text-orange-500"
                      }`}>
                        {sub.status === "ACTIVE" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] font-mono">
                      ₹{sub.price_inr.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[var(--text-secondary)]">
                        {sub.period_start ? new Date(sub.period_start).toLocaleDateString() : '—'} - {sub.period_end ? new Date(sub.period_end).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {sub.status === "ACTIVE" && (
                        <button 
                          onClick={() => handleCancelClick(sub)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-1 bg-red-500/10 rounded disabled:opacity-50"
                          disabled={cancellingId === sub.id}
                        >
                          {cancellingId === sub.id ? <RefreshCw className="animate-spin inline mr-1" size={14} /> : null}
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-sm text-[var(--text-secondary)] bg-[var(--bg-primary)]">
            <div>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.total)} of {data.total}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-[var(--border-subtle)] rounded hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page >= data.pages}
                className="px-3 py-1 border border-[var(--border-subtle)] rounded hover:bg-[var(--bg-hover)] disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
