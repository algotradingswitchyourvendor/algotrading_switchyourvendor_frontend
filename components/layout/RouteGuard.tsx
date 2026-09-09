"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useRestrictionStore } from "@/stores/restriction";
import { RESTRICTED_ROUTES } from "@/constants/routes";
import { RestrictedScreen } from "./RestrictedScreen";

/**
 * RouteGuard — wraps the entire page tree.
 *
 * On mount: hydrates unlock state from localStorage (checkToken).
 * On every navigation: checks if the current route is restricted.
 * If restricted AND not unlocked → renders <RestrictedScreen> instead of children.
 */
export function RouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isRestricted, isUnlocked, checkToken } = useRestrictionStore();

  // Hydrate session token from localStorage on first client render
  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const isCurrentRouteRestricted = RESTRICTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isRestricted && isCurrentRouteRestricted && !isUnlocked) {
    return <RestrictedScreen />;
  }

  return <>{children}</>;
}
