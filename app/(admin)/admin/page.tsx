"use client";

import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS, API_BASE_URL } from "@/constants/api";
import { Users, CreditCard, Activity, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface AdminStats {
  users: {
    total: number;
    active: number;
    suspended: number;
  };
  subscriptions: {
    active: number;
    by_plan: {
      FREE: number;
      BASIC: number;
      PRO: number;
      PREMIUM: number;
    };
  };
  payments: {
    total: number;
    successful: number;
    total_revenue_inr: number;
  };
}

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load stats");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 animate-pulse bg-gray-200 h-8 w-48 rounded"></h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-md">
          Failed to load admin stats. Ensure you have admin privileges and the server is running.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Overview</h1>
          <p className="text-[var(--text-secondary)] mt-1">Platform metrics and recent activity</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--text-secondary)] font-medium">Total Users</span>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {stats.users?.total.toLocaleString()}
          </div>
          <div className="text-sm text-[var(--color-up)] flex items-center gap-1 mt-auto">
            <TrendingUp size={14} />
            <span>{stats.users?.active} active currently</span>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--text-secondary)] font-medium">Active Subscriptions</span>
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center text-[var(--color-accent)]">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {stats.subscriptions?.active.toLocaleString()}
          </div>
          <div className="text-sm text-[var(--text-tertiary)] mt-auto">
            Paying customers
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--text-secondary)] font-medium">Total Revenue (INR)</span>
            <div className="w-10 h-10 rounded-full bg-[var(--color-up-bg)] flex items-center justify-center text-[var(--color-up)]">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            ₹{((stats.payments?.total_revenue_inr || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-[var(--text-tertiary)] mt-auto">
            All-time collected
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Link 
          href="/admin/users"
          className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors group"
        >
          <span className="font-medium text-[var(--text-primary)]">Manage Users</span>
          <ArrowUpRight size={18} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
        </Link>
        <Link 
          href="/admin/subscriptions"
          className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors group"
        >
          <span className="font-medium text-[var(--text-primary)]">Subscriptions</span>
          <ArrowUpRight size={18} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
        </Link>
        <Link 
          href="/admin/system"
          className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors group"
        >
          <span className="font-medium text-[var(--text-primary)]">System Health</span>
          <ArrowUpRight size={18} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
        </Link>
        <Link 
          href="/admin/audit-logs"
          className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors group"
        >
          <span className="font-medium text-[var(--text-primary)]">Audit Logs</span>
          <ArrowUpRight size={18} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]" />
        </Link>
      </div>

    </div>
  );
}
