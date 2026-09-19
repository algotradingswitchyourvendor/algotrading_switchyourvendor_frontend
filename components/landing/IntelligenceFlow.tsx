import { motion } from "motion/react";
import { Cpu, Radio, ScanSearch, ChartLine, Target, Zap } from "lucide-react";
import { drawLine, fadeUp, stagger, VIEWPORT } from "@/lib/landing/motion";
import { Chapter } from "./Chapter";

const STEPS = [
  { icon: Radio, label: "Market Data", sub: "NSE · BSE session feed" },
  { icon: Cpu, label: "Processing", sub: "ticks normalised in real time" },
  { icon: Zap, label: "Signals", sub: "MoM · LTD computed live" },
  { icon: ScanSearch, label: "Scanner", sub: "universe filtered to matches" },
  { icon: ChartLine, label: "Analysis", sub: "chart, volume, history" },
  { icon: Target, label: "Decision", sub: "you act, with context" },
];

const PATH_D =
  "M 40 30 C 160 10, 240 50, 360 30 S 600 10, 720 30 S 960 50, 1080 30 S 1240 15, 1320 26";

export default function IntelligenceFlow() {
  return (
    <section id="pipeline" className="relative border-t border-border py-28 sm:py-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <Chapter index="04" label="The pipeline" />
        <div className="mt-9 flex flex-wrap items-end justify-between gap-6">
          <motion.h2 variants={fadeUp} className="max-w-xl text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            From raw ticks to clear decisions.
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            One continuous path: the session streams in, signals are computed, the scanner
            filters, and every match opens straight into analysis.
          </motion.p>
        </div>

        {/* desktop flow */}
        <motion.div variants={fadeUp} className="relative mt-16 hidden lg:block">
          <svg viewBox="0 0 1360 140" className="w-full" aria-hidden="true">
            <motion.path
              variants={drawLine}
              d={PATH_D}
              fill="none"
              stroke="#DEE2E6"
              strokeWidth="1"
            />
            <motion.path
              variants={drawLine}
              d={PATH_D}
              fill="none"
              stroke="#FF6B00"
              strokeWidth="1"
              opacity={0.45}
            />
            <circle r="3.5" fill="#FF6B00" className="flow-pulse">
              <animateMotion dur="7s" repeatCount="indefinite" path={PATH_D} />
            </circle>
          </svg>
          <div className="absolute inset-x-0 top-0 flex h-full justify-between px-[2%]">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.label}
                data-testid={`dataflow-step-${i + 1}`}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ delay: 0.25 + i * 0.14, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-[13%] flex-col items-center pt-2 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-[0_0_0_4px_#FFFFFF]">
                  <s.icon size={16} className={i === STEPS.length - 1 ? "text-primary" : "text-secondary-foreground"} />
                </span>
                <p className="mt-3 font-mono text-[11px] font-medium tracking-wide">{s.label}</p>
                <p className="mt-1 font-mono text-[9.5px] leading-relaxed text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* mobile flow */}
        <motion.ol variants={fadeUp} className="relative mt-12 space-y-0 lg:hidden">
          {STEPS.map((s, i) => (
            <li key={s.label} data-testid={`dataflow-step-mobile-${i + 1}`} className="relative flex gap-4 pb-8 last:pb-0">
              {i < STEPS.length - 1 && (
                <span className="absolute left-[21px] top-11 h-[calc(100%-2.75rem)] w-px bg-border" aria-hidden="true" />
              )}
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                <s.icon size={16} className={i === STEPS.length - 1 ? "text-primary" : "text-secondary-foreground"} />
              </span>
              <div className="pt-2">
                <p className="font-mono text-xs font-medium tracking-wide">{s.label}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">{s.sub}</p>
              </div>
            </li>
          ))}
        </motion.ol>
      </motion.div>
      <style>{`@media (prefers-reduced-motion: reduce) { .flow-pulse { display: none; } }`}</style>
    </section>
  );
}
