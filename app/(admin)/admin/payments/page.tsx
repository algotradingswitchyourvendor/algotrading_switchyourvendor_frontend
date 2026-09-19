"use client";

import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/api";
import { Loader2, Search, CheckCircle, XCircle, AlertCircle, IndianRupee } from "lucide-react";
import { useState } from "react";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin_payments", page, pageSize, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`${API_BASE_URL}/admin/payments?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load payments");
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

  const totalRevenue = statsData?.payments?.total_revenue_inr || 0;
  const successfulCount = statsData?.payments?.successful || 0;
  const totalCount = statsData?.payments?.total || data?.total || 0;
  // Fallbacks since backend stats doesn't expose failed/refunded explicitly right now
  const failedCount = "—";
  const refundedCount = "—";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Payments</h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor transactions, refunds, and revenue.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Successful</div>
          <div className="text-2xl font-bold text-[var(--color-up)]">{successfulCount}</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Failed</div>
          <div className="text-2xl font-bold text-red-500">{failedCount}</div>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
          <div className="text-[var(--text-tertiary)] text-sm font-medium mb-1">Refunded</div>
          <div className="text-2xl font-bold text-gray-500">{refundedCount}</div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input 
              type="text" 
              placeholder="Search by ID, name or email..." 
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
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Successful</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
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
              <p>Failed to load payments</p>
              <button onClick={() => refetch()} className="text-[var(--color-accent)] text-sm hover:underline mt-2">Try again</button>
            </div>
          ) : data?.payments?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-[var(--text-tertiary)] gap-3">
              <IndianRupee size={48} className="opacity-20" />
              <p>No payments found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Date</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">User</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Amount</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {data.payments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {new Date(payment.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-500">
                          {payment.user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{payment.user.name || "Unknown"}</div>
                          <div className="text-[var(--text-tertiary)] text-xs">{payment.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] font-mono">
                      {payment.currency === 'INR' ? '₹' : payment.currency}{payment.amount_inr.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                        payment.status === "SUCCESS" 
                          ? "bg-[var(--color-up-bg)] text-[var(--color-up)]" 
                          : payment.status === "FAILED"
                          ? "bg-red-500/10 text-red-500"
                          : payment.status === "REFUNDED"
                          ? "bg-gray-500/10 text-gray-500"
                          : "bg-orange-500/10 text-orange-500"
                      }`}>
                        {payment.status === "SUCCESS" ? <CheckCircle size={12} /> : payment.status === "FAILED" ? <XCircle size={12} /> : null}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--text-secondary)] text-xs">
                      {payment.razorpay_payment_id || payment.razorpay_order_id || payment.id.substring(0, 12) + "..."}
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
