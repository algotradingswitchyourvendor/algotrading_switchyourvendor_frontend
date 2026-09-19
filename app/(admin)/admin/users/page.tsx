"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS, API_BASE_URL } from "@/constants/api";
import { Loader2, Search, MoreVertical, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load users");
      const json = await res.json();
      return json.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[var(--color-accent)]" size={32} />
      </div>
    );
  }

  const filteredUsers = data?.users?.filter((u: any) => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Users Management</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage user accounts, roles, and access.</p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input 
              type="text" 
              placeholder="Search users by email or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">User</th>
                <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Role</th>
                <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Status</th>
                <th className="px-6 py-3 font-medium text-[var(--text-secondary)]">Joined</th>
                <th className="px-6 py-3 font-medium text-[var(--text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-500">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{user.name || "Unknown"}</div>
                        <div className="text-[var(--text-tertiary)] text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.role === "ADMIN" 
                        ? "bg-purple-500/10 text-purple-500" 
                        : "bg-gray-500/10 text-gray-500"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                      user.status === "ACTIVE" 
                        ? "bg-[var(--color-up-bg)] text-[var(--color-up)]" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {user.status === "ACTIVE" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.status === "ACTIVE" ? (
                      <button 
                        onClick={() => toggleStatusMutation.mutate({ id: user.id, status: "SUSPENDED" })}
                        className="text-red-500 hover:text-red-600 text-sm font-medium px-3 py-1 bg-red-500/10 rounded"
                        disabled={toggleStatusMutation.isPending}
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleStatusMutation.mutate({ id: user.id, status: "ACTIVE" })}
                        className="text-[var(--color-up)] hover:text-green-600 text-sm font-medium px-3 py-1 bg-[var(--color-up-bg)] rounded"
                        disabled={toggleStatusMutation.isPending}
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-tertiary)]">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
