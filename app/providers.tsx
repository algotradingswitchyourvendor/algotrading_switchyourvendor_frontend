"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

export function Providers({ children }: { children: ReactNode }) {
  useWebSocket();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 0, // Retries are handled by api.ts with exponential backoff
            staleTime: 30_000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
