"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useAuthStore } from "@/stores/auth";
import { useSubscriptionStore } from "@/stores/subscription";
import { DashboardLoading } from "@/components/loading/DashboardLoading";

import { AppProviders } from "./providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading, fetchUser } = useAuthStore();
  const { fetchSubscription, isLoading: isSubLoading, hasLoaded: hasSubLoaded } = useSubscriptionStore();
  const router = useRouter();
  
  // Track readiness to unmount the loading screen
  const [isReady, setIsReady] = useState(false);

  // 1. Fetch user auth on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 2. Fetch subscription once authenticated
  useEffect(() => {
    if (isAuthenticated && !hasSubLoaded) {
      fetchSubscription();
    }
  }, [isAuthenticated, hasSubLoaded, fetchSubscription]);

  // 3. Handle unauthenticated redirect
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/auth/sign-in");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Determine readiness
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && hasSubLoaded) {
      setIsReady(true);
    }
  }, [isAuthLoading, isAuthenticated, hasSubLoaded]);

  // Don't render layout if not authenticated and not loading (redirecting)
  if (!isAuthLoading && !isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Loading Overlay */}
      {(!isReady || isAuthLoading || isSubLoading) && (
        <DashboardLoading 
          isAuthLoading={isAuthLoading} 
          isSubscriptionLoading={isSubLoading} 
          isReady={isReady}
        />
      )}

      {/* Main Application (Rendered underneath or after loading) */}
      <AppProviders>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <TopNavbar />
          <div style={{ flex: 1, minWidth: 0, paddingTop: 64, display: "flex", flexDirection: "column" }}>
            {children}
          </div>
        </div>
      </AppProviders>
    </>
  );
}
