"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Activity,
  ShieldAlert,
  Server,
  LogOut,
  type LucideIcon,
  Home
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";

const ADMIN_NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { href: "/admin/payments", icon: Activity, label: "Payments" },
  { href: "/admin/system", icon: Server, label: "System Health" },
  { href: "/admin/audit-logs", icon: ShieldAlert, label: "Audit Logs" },
];

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--sp-3)",
        padding: "var(--sp-2) var(--sp-4)",
        borderRadius: "var(--radius-md)",
        color: isActive ? "var(--color-accent)" : "var(--text-secondary)",
        backgroundColor: isActive ? "var(--color-accent-bg)" : "transparent",
        transition: "all var(--transition-fast)",
        fontWeight: isActive ? 600 : 500,
        fontSize: 14,
      }}
      className="hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
    >
      <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside 
      style={{
        width: 240,
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: "var(--sp-5) var(--sp-4)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", color: "var(--color-accent)" }}>
          <ShieldAlert size={20} strokeWidth={2.5} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Admin Console</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "var(--sp-4) var(--sp-3)", display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
        {ADMIN_NAV.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))}
          />
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "var(--sp-4) var(--sp-3)", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Home size={18} /> Exit Admin
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
