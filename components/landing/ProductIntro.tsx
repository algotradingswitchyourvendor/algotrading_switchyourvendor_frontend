import { motion } from "motion/react";
import { fadeUp, lineReveal, stagger, VIEWPORT } from "@/lib/landing/motion";
import { Chapter } from "./Chapter";

const FACTS = [
  "REAL-TIME NSE · BSE STREAM",
  "MOM + LTD SCAN ENGINES",
  "FULL HISTORICAL DEPTH",
];

export default function ProductIntro() {
  return (
    <section id="product" className="relative py-28 sm:py-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-6xl px-5 sm:px-8"
      >
        <Chapter index="01" label="The problem" />

        <h2 className="mt-9 text-4xl font-bold leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
          <span className="block overflow-hidden pb-1">
            <motion.span variants={lineReveal} custom={0} className="block">
              Raw market data is everywhere.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-1">
            <motion.span variants={lineReveal} custom={1} className="text-gradient-fade block">
              Clarity is not.
            </motion.span>
          </span>
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.25fr_1fr] md:gap-16">
          <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every tick of every session is already public. What is rare is a workspace that
            turns thousands of NSE and BSE quotes into a small set of signals you can actually
            read. MarketPulse streams the market live, scans it the way you define, and keeps
            every answer one click away from its evidence — the stock, the chart, the history.
          </motion.p>
          <motion.ul variants={fadeUp} className="flex flex-col justify-center gap-3">
            {FACTS.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 border-b border-border pb-3 font-mono text-xs tracking-[0.18em] text-secondary-foreground"
              >
                <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                {f}
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
