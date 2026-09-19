"use client";

import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { Logo } from "@/components/common/Logo";

interface LoginLoadingProps {
  currentStep: 0 | 1 | 2 | 3;
  provider?: string | null;
}

export function LoginLoading({ currentStep, provider }: LoginLoadingProps) {
  const providerName = provider
    ? provider.charAt(0).toUpperCase() + provider.slice(1)
    : "your provider";

  const steps = [
    { label: `Connecting\nwith ${providerName}` },
    { label: "Verifying\naccount" },
    { label: "Setting up\nyour session" },
    { label: "Redirecting\nto dashboard" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-transparent overflow-hidden">
      {/* Decorative Bottom Grid */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(255, 107, 0, 0.05) 0%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,107,0,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,107,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg) scale(2) translateY(50px)",
            transformOrigin: "bottom center",
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 z-10">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-xl mx-auto pt-16">
        
        {/* Animated Central Icon */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-10">
          {/* Concentric circles */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/10"
              style={{ width: 48 + i * 32, height: 48 + i * 32 }}
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5] 
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Orbiting dots */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-4 left-1/2 w-1.5 h-1.5 bg-primary/40 rounded-full" />
            <div className="absolute bottom-6 right-2 w-2 h-2 bg-primary/60 rounded-full" />
            <div className="absolute top-1/2 left-2 w-1 h-1 bg-primary/30 rounded-full" />
          </motion.div>

          {/* Core icon */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 w-14 h-14 bg-white rounded-2xl shadow-sm border border-primary/10 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M5 14.5 8.5 10l3 3L17 6.5" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="17" cy="6.5" r="2" fill="#FF6B00" />
            </svg>
          </motion.div>
        </div>

        {/* Text */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Completing your login...
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Please wait while we securely authenticate your account {provider ? `with ${providerName}` : ""}.
          </p>
        </motion.div>

        {/* Stepper */}
        <div className="w-full max-w-lg mb-12 relative px-2">
          {/* Connecting Line */}
          <div className="absolute top-3.5 left-10 right-10 h-[2px] bg-border -z-10" />
          <motion.div 
            className="absolute top-3.5 left-10 h-[2px] bg-primary -z-10 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStep / (steps.length - 1) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          <div className="flex justify-between relative z-0">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > idx;
              const isCurrent = currentStep === idx;
              
              return (
                <div key={idx} className="flex flex-col items-center w-20">
                  <motion.div 
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted || isCurrent ? "var(--primary)" : "#ffffff",
                      borderColor: isCompleted || isCurrent ? "var(--primary)" : "var(--border)",
                      color: isCompleted || isCurrent ? "#ffffff" : "var(--muted-foreground)"
                    }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mb-3 bg-white`}
                  >
                    {isCompleted ? (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    ) : isCurrent ? (
                      <motion.div 
                        className="w-2 h-2 bg-white rounded-full" 
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    ) : null}
                  </motion.div>
                  <span 
                    className={`text-xs text-center whitespace-pre-line font-medium transition-colors ${
                      isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md bg-brand-soft rounded-2xl p-4 flex items-center gap-4 border border-primary/10 shadow-sm"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary flex-shrink-0">
            <Lock size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-0.5">Secure Authentication</h3>
            <p className="text-xs text-muted-foreground">Your information is encrypted and secure.</p>
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.p
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-xs font-medium text-muted-foreground"
        >
          Almost there...
        </motion.p>
      </div>
    </div>
  );
}
