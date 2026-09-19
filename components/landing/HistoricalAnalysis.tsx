import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { HISTORY, HISTORY_PERIODS, type HistoryPeriod } from "@/lib/landing/data";
import { areaPath, fmtPct, pointsOf, smoothPath } from "@/lib/landing/chart";
import { EASE, fadeUp, stagger, VIEWPORT } from "@/lib/landing/motion";
import { Chapter } from "./Chapter";

const W = 720;
const H = 230;

export default function HistoricalAnalysis() {
  const [period, setPeriod] = useState<HistoryPeriod>("1Y");
  const { points, labels } = HISTORY[period];

  const pts = useMemo(() => pointsOf(points, W, H, 6), [points]);
  const line = useMemo(() => smoothPath(pts), [pts]);
  const area = useMemo(() => areaPath(pts, H), [pts]);

  const periodReturn = ((points[points.length - 1] - points[0]) / points[0]) * 100;
  const high = Math.max(...points);
  const low = Math.min(...points);

  return (
    <section id="history" className="relative border-t border-border py-28 sm:py-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <Chapter index="06" label="Context" />
        <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
              Don&apos;t just watch the market.
              <br />
              <span className="text-muted-foreground">Understand its movement.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Every quote sits on top of its own history. Stretch the tape from a month to five
              years and read how the move you are watching actually formed.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex gap-2">
              {HISTORY_PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={period === p}
                  data-testid={`history-period-${p.toLowerCase()}`}
                  onClick={() => setPeriod(p)}
                  className={`rounded-md border px-4 py-2 font-mono text-xs tracking-wider transition-colors duration-200 ${
                    period === p
                      ? "border-primary/35 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-input hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-3 gap-6 font-mono text-xs">
              <div>
                <p className="text-[9.5px] tracking-[0.2em] text-muted-foreground">PERIOD</p>
                <p className={`mt-1.5 text-base tabular-nums ${periodReturn >= 0 ? "text-up" : "text-down"}`}>
                  {fmtPct(periodReturn)}
                </p>
              </div>
              <div>
                <p className="text-[9.5px] tracking-[0.2em] text-muted-foreground">HIGH</p>
                <p className="mt-1.5 text-base tabular-nums text-foreground">
                  {high.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-[9.5px] tracking-[0.2em] text-muted-foreground">LOW</p>
                <p className="mt-1.5 text-base tabular-nums text-foreground">
                  {low.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
                NIFTY 50 · {period} · ILLUSTRATIVE
              </span>
              <span className={`font-mono text-xs tabular-nums ${periodReturn >= 0 ? "text-up" : "text-down"}`}>
                {fmtPct(periodReturn)}
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 h-56 w-full sm:h-72" role="img" aria-label={`Illustrative NIFTY 50 chart, period ${period}`}>
              <defs>
                <linearGradient id="histArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={periodReturn >= 0 ? "#16A34A" : "#DC2626"} stopOpacity="0.14" />
                  <stop offset="100%" stopColor={periodReturn >= 0 ? "#16A34A" : "#DC2626"} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.2, 0.4, 0.6, 0.8].map((f) => (
                <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} stroke="#DEE2E6" strokeWidth="1" />
              ))}
              <motion.path
                key={`ha-${period}`}
                d={area}
                fill="url(#histArea)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5 }}
              />
              <motion.path
                key={`hl-${period}`}
                d={line}
                fill="none"
                stroke={periodReturn >= 0 ? "#16A34A" : "#DC2626"}
                strokeWidth="1.75"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: EASE }}
              />
              {pts
                .filter((_, i) => i % Math.ceil(pts.length / 8) === 0)
                .map((p, i) => (
                  <motion.circle
                    key={`${period}-pt-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r="2.5"
                    fill="#FFFFFF"
                    stroke={periodReturn >= 0 ? "#16A34A" : "#DC2626"}
                    strokeWidth="1.5"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.08, duration: 0.4 }}
                  />
                ))}
            </svg>
            <div className="mt-3 flex justify-between font-mono text-[9.5px] tracking-[0.16em] text-muted-foreground">
              {labels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
