"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { EASE } from "@/lib/landing/motion";

const LINKS = [
  { label: "Product", href: "/#product", testId: "nav-link-product" },
  { label: "Features", href: "/#features", testId: "nav-link-features" },
  { label: "Scanner", href: "/#scanner", testId: "nav-link-scanner" },
  { label: "Analytics", href: "/#analytics", testId: "nav-link-analytics" },
  { label: "Pricing", href: "/#pricing", testId: "nav-link-pricing" },
  { label: "FAQ", href: "/#faq", testId: "nav-link-faq" },
];

import { LogoMark } from "@/components/common/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
        }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <a href="/" data-testid="nav-logo" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">MarketPulse</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={l.testId}
              className="rounded-md px-3.5 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.a
            href="/auth/sign-in"
            data-testid="nav-cta-launch"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden items-center gap-1.5 rounded-full bg-primary px-4.5 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-brand-hover md:inline-flex"
          >
            Login / Sign up
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </motion.a>
          <button
            type="button"
            data-testid="nav-mobile-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  data-testid={`${l.testId}-mobile`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: EASE }}
                  className="rounded-md px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="/auth/sign-in"
                data-testid="nav-cta-launch-mobile"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, duration: 0.3, ease: EASE }}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Login / Sign up
                <ArrowUpRight size={15} strokeWidth={2.2} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
