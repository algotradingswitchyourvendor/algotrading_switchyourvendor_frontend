import { motion } from "motion/react";
import { fadeUp, stagger, VIEWPORT } from "@/lib/landing/motion";
import { Chapter } from "./Chapter";

const SPECS = [
  { k: "STREAMING", v: "WebSocket tick updates pushed into every open workspace — the tape never waits for a refresh." },
  { k: "TABLES", v: "Dynamic columns over large result sets, built to stay smooth while the market moves." },
  { k: "FILTERING", v: "Full-universe scans resolve the moment you hit run — no round trips, no spinners." },
  { k: "HISTORY", v: "Multi-year depth sits behind every symbol you track, one gesture away." },
  { k: "INTERFACE", v: "One responsive surface, from a multi-window desk to a phone on the move." },
];

export default function TechnicalSection() {
  return (
    <section id="engineering" className="relative border-t border-border py-28 sm:py-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <Chapter index="08" label="Engineering" />
        <div className="mt-9 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              Built for real-time market workflows.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              MarketPulse is engineered around a simple constraint: when the market moves, the
              workspace moves with it. No fabricated benchmarks — just an architecture chosen
              end-to-end for live data.
            </motion.p>
          </div>
          <motion.ul variants={fadeUp} className="divide-y divide-border border-y border-border">
            {SPECS.map((s) => (
              <li key={s.k} className="group grid gap-1.5 py-5 transition-colors duration-200 sm:grid-cols-[140px_1fr] sm:gap-6">
                <span className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.24em] text-primary">
                  <span className="h-1 w-1 rounded-full bg-primary/70 transition-transform duration-200 group-hover:scale-150" aria-hidden="true" />
                  {s.k}
                </span>
                <span className="text-sm leading-relaxed text-foreground">{s.v}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
