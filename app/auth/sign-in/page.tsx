"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ENDPOINTS } from "@/constants/api";
import { AlertCircle, ChevronRight, ShieldCheck } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    oauth_denied: "You denied the login request.",
    invalid_state: "Security token mismatch. Please try again.",
    no_code: "No authorization code received.",
    auth_failed: "Authentication failed. Please try again later.",
  };

  const errorMessage = error ? errorMessages[error] || "An unknown error occurred." : null;

  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 relative">
      
      {/* Decorative handwriting (hidden on mobile, visible on large screens) */}
      <div className="hidden xl:block absolute -right-32 top-8 text-gray-400 rotate-[-8deg] pointer-events-none opacity-80" style={{ fontFamily: 'var(--font-sans)' }}>
        <div className="text-[15px] font-medium italic mb-1">Powered</div>
        <div className="text-[15px] font-medium italic ml-2 mb-1">by data.</div>
        <div className="text-[15px] font-medium italic ml-4">Built for</div>
        <div className="text-[15px] font-medium italic ml-6">traders</div>
        <svg className="w-6 h-6 mt-2 ml-4 text-gray-300 transform rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-[32px] font-bold text-[#111827] tracking-tight leading-tight mb-2">Welcome back</h1>
        <p className="text-[15px] text-[#64748b]">Sign in to your MarketPulse account</p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 mb-6 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-3.5 mb-8">
        {/* Google Button */}
        <a
          href={ENDPOINTS.AUTH_GOOGLE}
          className="group flex items-center justify-between w-full h-[52px] px-5 bg-white hover:bg-gray-50 border border-gray-200 text-[#111827] rounded-xl font-medium text-[15px] transition-colors"
        >
          <div className="flex items-center gap-3">
             <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </a>

        {/* Zerodha Button */}
        <a
          href={ENDPOINTS.AUTH_ZERODHA}
          className="group flex items-center justify-between w-full h-[52px] px-5 bg-white hover:bg-gray-50 border border-gray-200 text-[#111827] rounded-xl font-medium text-[15px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <img src="/kite-logo.svg" alt="Zerodha" className="w-[20px] h-[20px] object-contain" />
            <span>Continue with Zerodha</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </a>

        {/* Upstox Button */}
        <a
          href={ENDPOINTS.AUTH_UPSTOX}
          className="group flex items-center justify-between w-full h-[52px] px-5 bg-white hover:bg-gray-50 border border-gray-200 text-[#111827] rounded-xl font-medium text-[15px] transition-colors"
        >
          <div className="flex items-center gap-3">
            <img src="/upstox.jpeg" alt="Upstox" className="w-[18px] h-[18px] object-contain rounded-sm" />
            <span>Continue with Upstox</span>
          </div>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </a>
      </div>

    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF6B00]/20 border-t-[#FF6B00] animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
