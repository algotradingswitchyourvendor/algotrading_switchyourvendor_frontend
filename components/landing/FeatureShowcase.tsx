import { useState } from "react";
import { motion } from "motion/react";
import { INDICES, SCANNER_RESULTS, STOCKS } from "@/lib/landing/data";
import { drawLine, fadeUp, stagger, VIEWPORT } from "@/lib/landing/motion";
import { fmtPct, pointsOf, smoothPath } from "@/lib/landing/chart";
import { Chapter } from "./Chapter";
import { Sparkline } from "./Sparkline";

const WS_COLUMNS = ["CHG%", "VOL", "SPARK", "SIGNAL"] as const;

function WorkspaceDemo() {
  const [visible, setVisible] = useState<Record<string, boolean>>({
    "CHG%": true,
    VOL: true,
    SPARK: false,
    SIGNAL: true,
  });
  const rows = STOCKS.slice(0, 3);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {WS_COLUMNS.map((c) => (
          <button
            key={c}
            type="button"
            data-testid={`workspace-col-${c.toLowerCase().replace(/[%]/g, "").toLowerCase()}`}
            aria-pressed={visible[c]}
            onClick={() => setVisible((v) => ({ ...v, [c]: !v[c] }))}
            className={`rounded border px-2 py-0.5 font-mono text-[9.5px] tracking-widest transition-colors duration-200 ${visible[c]
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        {rows.map((r) => (
          <div
            key={r.symbol}
            className="flex items-center gap-4 border-b border-border px-3 py-2 last:border-0"
          >
            <span className="w-20 shrink-0 font-mono text-[11px]">{r.symbol}</span>
            <span className="font-mono text-[11px] tabular-nums text-secondary-foreground">
              {r.price.toLocaleString("en-IN")}
            </span>
            <span className="ml-auto flex items-center gap-4">
              {visible["CHG%"] && (
                <span className={`font-mono text-[11px] tabular-nums ${r.changePct >= 0 ? "text-up" : "text-down"}`}>
                  {fmtPct(r.changePct)}
                </span>
              )}
              {visible.VOL && <span className="font-mono text-[11px] text-muted-foreground">{r.volume}</span>}
              {visible.SPARK && <Sparkline data={r.spark} up={r.changePct >= 0} w={48} h={16} />}
              {visible.SIGNAL && (
                <span className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[8.5px] tracking-widest text-secondary-foreground">
                  {r.signal}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreamingDemo() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-4 sm:px-6 w-full">
      <div className="flex flex-1 items-center min-w-0">
        {["FEED", "ENGINE", "WORKSPACE", "WS · STREAMING"].map((n, i, arr) => (
          <div key={n} className={`flex items-center ${i < arr.length - 1 ? "flex-1 min-w-0" : "shrink-0"}`}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <span
                className={`pulse-dot h-2 w-2 rounded-full bg-primary`}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
              <span className="font-mono text-[8px] sm:text-[9.5px] tracking-wider sm:tracking-[0.2em] text-muted-foreground">{n}</span>
            </div>
            {i < arr.length - 1 && (
              <div className="flex-1 px-2 sm:px-4 min-w-0">
                <div className="mb-4 h-px w-full bg-gradient-to-r from-primary/50 to-transparent" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryDemo() {
  const pts = pointsOf(STOCKS[0].spark.concat(STOCKS[0].spark.map((v) => v * 0.94)), 260, 64, 2);
  return (
    <svg viewBox="0 0 260 64" className="h-16 w-full" aria-hidden="true">
      <motion.path
        variants={drawLine}
        d={smoothPath(pts)}
        fill="none"
        stroke="#16A34A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1="0" y1="63" x2="260" y2="63" stroke="#DEE2E6" strokeWidth="0.5" />
    </svg>
  );
}

const CARD =
  "group rounded-xl border border-border bg-card p-6 shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md";

function CardHead({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">{num}</span>
        <span className="h-1 w-1 rounded-full bg-border transition-colors duration-300 group-hover:bg-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </>
  );
}

export default function FeatureShowcase() {
  return (
    <section id="features" className="relative border-t border-border py-28 sm:py-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <Chapter index="02" label="Capabilities" />
        <div className="mt-9 flex flex-wrap items-end justify-between gap-6">
          <motion.h2 variants={fadeUp} className="max-w-xl text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Six tools. One workspace.
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Each capability is part of the same live surface — what you scan, you can inspect;
            what you inspect, you can trace through history.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={fadeUp} className={`${CARD} sm:col-span-2`} data-testid="feature-dashboard">
            <CardHead num="01" title="Live Market Dashboard" desc="Indices, breadth and the full tape — updating as the session unfolds." />
            <div className="mt-5 grid grid-cols-3 gap-2">
              {INDICES.slice(0, 3).map((q) => (
                <div key={q.symbol} className="rounded-lg border border-border bg-secondary/30 px-3 py-2">
                  <p className="font-mono text-[9.5px] tracking-wider text-muted-foreground">{q.symbol}</p>
                  <p className="mt-0.5 font-mono text-sm tabular-nums">{q.price.toLocaleString("en-IN")}</p>
                  <p className={`font-mono text-[10.5px] tabular-nums ${q.changePct >= 0 ? "text-up" : "text-down"}`}>{fmtPct(q.changePct)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={CARD} data-testid="feature-scanner">
            <CardHead num="02" title="Advanced Scanner" desc="MoM momentum and LTD scans over the whole universe, ranked instantly." />
            <div className="mt-5 space-y-1.5">
              {SCANNER_RESULTS.mom.slice(0, 3).map((r) => (
                <div key={r.symbol} className="flex items-center justify-between rounded border border-border bg-secondary/30 px-3 py-1.5">
                  <span className="font-mono text-[11px]">{r.symbol}</span>
                  <span className="font-mono text-[11px] tabular-nums text-up">{fmtPct(r.changePct)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={CARD} data-testid="feature-stock-intel">
            <CardHead num="03" title="Stock Intelligence" desc="Every symbol opens into price, volume and session structure." />
            <div className="mt-5 flex items-center gap-4">
              <Sparkline data={STOCKS[0].spark} up w={96} h={36} />
              <div className="grid grid-cols-2 gap-x-5 gap-y-1 font-mono text-[10px] tabular-nums">
                <span className="text-muted-foreground">O <span className="text-foreground">2,948</span></span>
                <span className="text-muted-foreground">H <span className="text-up">2,996</span></span>
                <span className="text-muted-foreground">L <span className="text-down">2,941</span></span>
                <span className="text-muted-foreground">C <span className="text-foreground">2,987</span></span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={CARD} data-testid="feature-history">
            <CardHead num="04" title="Historical Analysis" desc="Zoom from today's tape to multi-year movement in one gesture." />
            <div className="mt-5">
              <HistoryDemo />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={CARD} data-testid="feature-workspace">
            <CardHead num="05" title="Custom Workspace" desc="Dynamic columns — build the table that matches how you read markets. Try it:" />
            <div className="mt-5">
              <WorkspaceDemo />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className={`${CARD} sm:col-span-2 lg:col-span-3`} data-testid="feature-streaming">
            <CardHead 
              num="06" 
              title="Real-Time Streaming" 
              desc="WebSocket updates push every tick into your workspace — no refresh, ever. Built on a high-throughput engine, it delivers zero-latency updates directly to your charts, scanners, and custom layouts without overwhelming your browser. The entire surface reacts to the market in real-time." 
            />
            <div className="mt-8">
              <StreamingDemo />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
