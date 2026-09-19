"use client";

import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants/api";
import { Loader2, Search, AlertCircle, ShieldAlert } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "ALL", label: "All" },
  { id: "USER_", label: "User Management" },
  { id: "SUBSCRIPTION_", label: "Billing" },
  { id: "PAYMENT_", label: "Payments" },
  { id: "ADMIN_", label: "Admin Actions" },
  { id: "SYSTEM_", label: "System" },
  { id: "AUTH_", label: "Security" },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin_audit_logs", page, pageSize, search, activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      if (search) params.append("search", search);
      if (activeCategory !== "ALL") params.append("action", activeCategory);

      const res = await fetch(`${API_BASE_URL}/admin/audit-logs?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load audit logs");
      const json = await res.json();
      return json.data;
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Logs</h1>
          <p className="text-[var(--text-secondary)] mt-1">Review system and admin activities across the platform.</p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* Tabs */}
        <div className="border-b border-[var(--border-subtle)] px-4 flex gap-6 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setPage(1);
              }}
              className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeCategory === cat.id
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input 
              type="text" 
              placeholder="Search by action or admin email..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <Loader2 className="animate-spin text-[var(--color-accent)]" size={32} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-[var(--text-tertiary)] gap-2">
              <AlertCircle size={32} className="text-red-400" />
              <p>Failed to load audit logs</p>
              <button onClick={() => refetch()} className="text-[var(--color-accent)] text-sm hover:underline mt-2">Try again</button>
            </div>
          ) : data?.logs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-[var(--text-tertiary)] gap-3">
              <ShieldAlert size={48} className="opacity-20" />
              <p>No audit logs found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Date & Time</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Admin</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Action</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Details</th>
                  <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {data.logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-500 text-xs">
                          {log.admin_email.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[var(--text-primary)]">{log.admin_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[var(--text-secondary)] text-xs font-semibold px-2 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={JSON.stringify(log.metadata)}>
                      <span className="text-[var(--text-tertiary)] text-xs">
                        {log.target_user_id ? `Target: ${log.target_user_id.substring(0,8)}... | ` : ''}
                        {JSON.stringify(log.metadata).replace(/[{}"']/g, '').substring(0, 60)}
                        {JSON.stringify(log.metadata).length > 60 ? '...' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--text-secondary)] text-xs">
                      {log.ip || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-sm text-[var(--text-secondary)] bg-[var(--bg-primary)] mt-auto">
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
