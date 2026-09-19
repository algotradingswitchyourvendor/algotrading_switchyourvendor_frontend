"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Logo } from "@/components/common/Logo";

interface DashboardLoadingProps {
  isAuthLoading: boolean;
  isSubscriptionLoading: boolean;
  isReady: boolean;
}

export function DashboardLoading({ isAuthLoading, isSubscriptionLoading, isReady }: DashboardLoadingProps) {
  // We use local state to ensure minimum display time for smooth animations,
  // even if the actual network requests are extremely fast.
  const [authDone, setAuthDone] = useState(false);
  const [subDone, setSubDone] = useState(false);
  const [fullyReady, setFullyReady] = useState(false);

  useEffect(() => {
    if (!isAuthLoading) {
      // Allow a tiny transition so the step doesn't instantly flash
      const timer = setTimeout(() => setAuthDone(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoading]);

  useEffect(() => {
    if (authDone && !isSubscriptionLoading && !isAuthLoading) {
      const timer = setTimeout(() => setSubDone(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isSubscriptionLoading, authDone, isAuthLoading]);

  useEffect(() => {
    if (authDone && subDone && isReady) {
      const timer = setTimeout(() => setFullyReady(true), 400);
      return () => clearTimeout(timer);
    }
  }, [authDone, subDone, isReady]);

  // Determine current active step for the UI
  const currentStep = !authDone ? 0 : !subDone ? 1 : 2;

  const rows = [
    { label: "Loading your account", state: authDone ? "completed" : currentStep === 0 ? "current" : "pending" },
    { label: "Fetching your preferences", state: subDone ? "completed" : currentStep === 1 ? "current" : "pending" },
    { label: "Preparing your dashboard", state: fullyReady ? "completed" : currentStep === 2 ? "current" : "pending" },
  ];

  return (
    <AnimatePresence>
      {!fullyReady && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-[64px] left-0 right-0 bottom-0 z-40 flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Decorative Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none overflow-hidden flex items-end">
            <svg viewBox="0 0 1440 320" className="w-full h-full object-cover opacity-30 text-primary" preserveAspectRatio="none">
              <path 
                fill="currentColor" 
                fillOpacity="0.1" 
                d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
              <path 
                fill="currentColor" 
                fillOpacity="0.05" 
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg px-4 z-10">
            {/* Animated Chart Icon with Progress Arc */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-10">
              {/* Outer pulsing ring */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-brand-soft"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Spinning progress arc */}
              <motion.svg 
                className="absolute inset-0 w-full h-full text-primary" 
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <circle 
                  cx="50" cy="50" r="48" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  strokeDasharray="300"
                  strokeDashoffset="220"
                  strokeLinecap="round"
                />
              </motion.svg>

              {/* Core Icon */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-16 h-16 bg-white rounded-2xl shadow-sm border border-primary/10 flex items-center justify-center gap-1"
              >
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                <div className="w-1.5 h-4 bg-primary rounded-full" />
              </motion.div>
            </div>

            {/* Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                Setting up your dashboard...
              </h1>
              <p className="text-base text-muted-foreground max-w-sm mx-auto">
                We're getting everything ready for you. This will just take a moment.
              </p>
            </motion.div>

            {/* Checklist Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col gap-5 relative z-10"
            >
              {rows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {row.state === "completed" ? (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white"
                      >
                        <Check size={12} strokeWidth={3} />
                      </motion.div>
                    ) : row.state === "current" ? (
                      <motion.svg 
                        className="w-5 h-5 text-primary" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="45" strokeLinecap="round" />
                      </motion.svg>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}
                  </div>
                  
                  <span className={`text-sm font-medium flex-1 transition-colors ${row.state === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                    {row.label}
                  </span>
                  
                  {row.state === "completed" && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-medium text-muted-foreground flex-shrink-0">
                      ✓
                    </motion.span>
                  )}
                  {row.state === "current" && (
                    <motion.div className="flex gap-0.5" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Quote */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12 text-center text-xs font-medium text-muted-foreground relative z-10"
            >
              "Smarter data. Better decisions."<br/>
              <span className="mt-1 block opacity-70">— MarketPulse</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
