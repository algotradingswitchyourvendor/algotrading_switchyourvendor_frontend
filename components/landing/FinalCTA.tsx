import { motion } from "motion/react";
import { ArrowUpRight, ChevronUp } from "lucide-react";
import { APP_URL } from "@/config/landingAppConfig";
import { fadeUp, lineReveal, stagger, VIEWPORT } from "@/lib/landing/motion";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border py-32 sm:py-44">
      <div
        className="bg-market-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          maskImage: "radial-gradient(ellipse 70% 80% at 50% 100%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 100%, black 10%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 115%, rgba(255,107,0,0.09), transparent 70%)" }}
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="relative mx-auto max-w-4xl px-5 text-center sm:px-8"
      >
        <motion.p variants={fadeUp} className="font-mono text-[11px] tracking-[0.32em] text-primary">
          11 / OPEN THE TERMINAL
        </motion.p>
        <h2 className="mt-7 text-4xl font-bold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          <span className="block overflow-hidden pb-1">
            <motion.span variants={lineReveal} custom={0} className="block">One market.</motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span variants={lineReveal} custom={1} className="text-gradient-fade block">
              One focused view.
            </motion.span>
          </span>
        </h2>
        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          Monitor, scan and analyze the Indian equity market from one intelligent workspace.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href={APP_URL}
            data-testid="final-cta-launch-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-brand-hover"
          >
            Open MarketPulse
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </motion.a>
          <motion.a
            href="#scanner"
            data-testid="final-cta-scanner-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors duration-200 hover:border-input hover:bg-secondary/50"
          >
            Explore Scanner
            <ChevronUp size={15} className="rotate-180 text-muted-foreground" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
