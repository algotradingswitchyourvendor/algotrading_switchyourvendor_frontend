export function LogoMark({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
      <rect x="0.5" y="0.5" width="21" height="21" rx="5" stroke="#DEE2E6" />
      <path d="M5 14.5 8.5 10l3 3L17 6.5" stroke="#FF6B00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="6.5" r="1.6" fill="#FF6B00" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className || ""}`}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">MarketPulse</span>
    </div>
  );
}
