"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { LoginLoading } from "@/components/loading/LoginLoading";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  const provider = searchParams.get("provider");
  const hasAttempted = useRef(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    // Only attempt to fetch once to avoid loops
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const completeLogin = async () => {
      // Small tick to ensure React renders Step 0 before immediately jumping to Step 1
      await new Promise((resolve) => setTimeout(resolve, 0));
      setStep(1); // Verifying account
      
      await fetchUser();
      
      setStep(2); // Session verified
    };
    
    completeLogin();
  }, [fetchUser]);

  // Once authenticated, redirect to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      setStep(3); // Redirecting to dashboard
      // Slight visual grace period so step 3 is visible but not delaying unnecessarily
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router]);

  return <LoginLoading currentStep={step} provider={provider} />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoginLoading currentStep={0} provider={null} />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
