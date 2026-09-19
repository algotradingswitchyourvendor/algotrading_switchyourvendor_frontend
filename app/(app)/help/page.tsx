"use client";

import { LifeBuoy, Search, Activity, BookOpen, Clock, Settings, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I use the Market Scanner?",
      answer: "Navigate to the Scanner page from the top navigation. You can select 'Scanner' for real-time updates or 'Scanner LTD' to query historical scans. Use the Condition Builder to filter by technical indicators like RSI, volume, and moving averages. You can also save your conditions as Quick Presets.",
      category: "Scanner"
    },
    {
      question: "Can I download historical data?",
      answer: "Yes. Go to the History page. Select your desired Trading Date, filter by Symbol and Time Range, and click Apply. Once the data loads, click the 'CSV' button in the top right corner to download the records for local analysis.",
      category: "Market Data"
    },
    {
      question: "How are live updates managed?",
      answer: "MarketPulse uses a real-time WebSocket connection during active market hours (09:00 - 15:30 IST). You will see a 'LIVE' badge in the top navigation when connected. If the market is closed, the badge will indicate 'CLOSED'.",
      category: "Market Data"
    },
    {
      question: "How do I upgrade my plan?",
      answer: "Click your profile avatar in the top right corner and select 'My Plan' (or go to Settings > MarketPulse Plans). Choose your desired tier (Starter, Pro, Ultra) and follow the secure Razorpay checkout process. Your account will upgrade automatically upon successful payment.",
      category: "Account & Billing"
    },
    {
      question: "What happens if I cancel my subscription?",
      answer: "If you cancel your subscription from the Billing tab in Settings, your premium access remains active until the end of your current billing period. After that, your account will downgrade to the Free plan.",
      category: "Account & Billing"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-market-grid-fine flex flex-col">
      <div className="flex-1 w-full max-w-[1000px] mx-auto px-6 md:px-8 py-10 md:py-16">
        
        {/* Page Header */}
        <div className="mb-12">
          <span className="text-[10px] tracking-[0.2em] font-semibold text-[var(--color-accent)] uppercase mb-3 block">03 / Support</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.1]">
            How can we help?
          </h1>
          <p className="text-[var(--text-secondary)] mt-4 max-w-md leading-relaxed text-sm md:text-base">
            Find documentation, guides, and answers to common questions about your MarketPulse workspace.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[var(--text-muted)]" />
          </div>
          <input
            type="text"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-4 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all shadow-sm text-sm"
            placeholder="Search for articles, features, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Links */}
        {!searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Link href="/dashboard" className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--color-accent)] transition-colors group shadow-sm flex flex-col h-full">
              <Activity size={20} className="text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1 group-hover:text-[var(--color-accent)] transition-colors">Dashboard</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mt-auto">Understand your market overview.</p>
            </Link>
            
            <Link href="/scanner" className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--color-accent)] transition-colors group shadow-sm flex flex-col h-full">
              <Search size={20} className="text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1 group-hover:text-[var(--color-accent)] transition-colors">Scanner</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mt-auto">Query and filter real-time stocks.</p>
            </Link>
            
            <Link href="/history" className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--color-accent)] transition-colors group shadow-sm flex flex-col h-full">
              <Clock size={20} className="text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1 group-hover:text-[var(--color-accent)] transition-colors">History</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mt-auto">Download and analyze past data.</p>
            </Link>
            
            <Link href="/settings?tab=plans" className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-5 hover:border-[var(--color-accent)] transition-colors group shadow-sm flex flex-col h-full">
              <Settings size={20} className="text-[var(--color-accent)] mb-3" />
              <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1 group-hover:text-[var(--color-accent)] transition-colors">Billing</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mt-auto">Manage your subscription.</p>
            </Link>
          </div>
        )}

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-[var(--text-secondary)]" />
            Frequently Asked Questions
          </h2>
          
          <div className="flex flex-col gap-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div key={idx} className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-accent)] bg-[#FFF4ED] px-2 py-0.5 rounded-sm">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{faq.question}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.answer}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)]">
                <LifeBuoy size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">No articles found</h3>
                <p className="text-[13px] text-[var(--text-secondary)]">We couldn't find any help articles matching "{searchQuery}".</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
