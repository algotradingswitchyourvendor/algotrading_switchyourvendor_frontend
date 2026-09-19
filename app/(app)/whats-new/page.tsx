"use client";

import { Star, Sparkles } from "lucide-react";

export default function WhatsNewPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-market-grid-fine flex flex-col">
      <div className="flex-1 w-full max-w-[800px] mx-auto px-6 md:px-8 py-10 md:py-16">
        
        {/* Page Header */}
        <div className="mb-12">
          <span className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] uppercase mb-3 block">04 / Changelog</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            What's New
          </h1>
          <p className="text-[var(--text-secondary)] mt-4 max-w-md leading-relaxed text-sm md:text-base">
            Stay up to date with the latest features, improvements, and fixes in MarketPulse.
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-[#FFF4ED] border border-[#FFEDD5] text-[var(--color-accent)] flex items-center justify-center mb-6 relative">
            <Star size={24} className="text-[var(--color-accent)]" />
            <Sparkles size={14} className="absolute -top-1 -right-1 text-[var(--color-accent)] opacity-70" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            No Recent Product Updates
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md leading-relaxed">
            MarketPulse product updates, new features, and technical release notes will appear here. You're currently using the latest stable version.
          </p>
        </div>

      </div>
    </div>
  );
}
