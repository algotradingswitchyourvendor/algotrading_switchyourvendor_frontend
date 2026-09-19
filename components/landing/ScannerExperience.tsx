import { useState } from "react";
import { motion } from "motion/react";
import { Play, SlidersHorizontal } from "lucide-react";
import { SCANNER_RESULTS, type Signal } from "@/lib/landing/data";
import { fmtINR, fmtPct } from "@/lib/landing/chart";
import { fadeUp, stagger, VIEWPORT, EASE } from "@/lib/landing/motion";
import { Chapter } from "./Chapter";

type Mode = "mom" | "ltd";

const FILTERS = ["Gain ≥ +1%", "Volume ≥ 2×", "Price > ₹100", "Large cap only"];

const SIGNAL_STYLE: Record<Signal, string> = {
  MOMENTUM: "border-up/30 bg-up/10 text-up",
  BREAKOUT: "border-signal/30 bg-signal/10 text-signal",
  TREND: "border-border bg-secondary text-secondary-foreground",
  REVERSAL: "border-down/30 bg-down/10 text-down",
  WATCH: "border-border bg-secondary text-muted-foreground",
};

export default function ScannerExperience() {
  const [mode, setMode] = useState<Mode>("mom");
  const [filters, setFilters] = useState<Record<string, boolean>>({
    "Gain ≥ +1%": true,
    "Volume ≥ 2×": true,
    "Price > ₹100": false,
    "Large cap only": false,
  });
  const [run, setRun] = useState(0);
  const [scanning, setScanning] = useState(false);

  const runScan = () => {
    setScanning(true);
    window.setTimeout(() => {
      setRun((r) => r + 1);
      setScanning(false);
    }, 550);
  };

  const results = SCANNER_RESULTS[mode];

  return (
    <section id="scanner" className="relative border-t border-border py-28 sm:py-36">
      <div className="bg-market-grid-fine pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent_80%)]" aria-hidden="true" />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="relative mx-auto max-w-7xl px-5 sm:px-8"
      >
        <Chapter index="03" label="Discovery" />
        <div className="mt-9 max-w-2xl">
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Find the signal.
            <br />
            <span className="text-muted-foreground">Skip the noise.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-muted-foreground">
            The scanner compresses the entire listed universe into the few rows that match your
            criteria. Switch engines, set filters, run — this is the real workflow, on demo data.
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="mt-14 grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* controls */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
              <SlidersHorizontal size={12} /> FILTER
            </p>
            <div role="tablist" aria-label="Scanner engine" className="mt-4 grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary/50 p-1">
              <button
                role="tab"
                aria-selected={mode === "mom"}
                data-testid="scanner-tab-mom"
                onClick={() => setMode("mom")}
                className={`rounded-md px-3 py-2 font-mono text-[11px] tracking-wide transition-colors duration-200 ${
                  mode === "mom" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                MoM SCANNER
              </button>
              <button
                role="tab"
                aria-selected={mode === "ltd"}
                data-testid="scanner-tab-ltd"
                onClick={() => setMode("ltd")}
                className={`rounded-md px-3 py-2 font-mono text-[11px] tracking-wide transition-colors duration-200 ${
                  mode === "ltd" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                LTD SCANNER
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filters[f]}
                  data-testid={`scanner-filter-${f.replace(/[^a-zA-Z]/g, "-").toLowerCase()}`}
                  onClick={() => setFilters((v) => ({ ...v, [f]: !v[f] }))}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[10.5px] tracking-wide transition-colors duration-200 ${
                    filters[f]
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground hover:border-input hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <motion.button
              type="button"
              data-testid="scanner-run-btn"
              onClick={runScan}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-brand-hover disabled:opacity-60"
              disabled={scanning}
            >
              <Play size={14} strokeWidth={2.4} />
              {scanning ? "Scanning…" : "Run Scan"}
            </motion.button>
            <p className="mt-4 font-mono text-[9.5px] leading-relaxed tracking-wider text-muted-foreground/70">
              DEMO DATASET — RESULTS ARE ILLUSTRATIVE, NOT LIVE MARKET VALUES
            </p>
          </div>

          {/* results */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3">
              <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground">RESULTS</span>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {scanning ? "—" : `${results.length} matches`} · {mode === "mom" ? "MoM" : "LTD"} engine
              </span>
            </div>
            <div
              data-testid="scanner-results-table"
              className={`transition-opacity duration-300 ${scanning ? "opacity-30" : "opacity-100"}`}
            >
              <div className="grid grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1fr] gap-2 border-b border-border px-5 py-2.5 font-mono text-[9.5px] tracking-[0.18em] text-muted-foreground">
                <span>SYMBOL</span>
                <span className="text-right">PRICE</span>
                <span className="text-right">CHANGE</span>
                <span className="hidden text-right sm:block">VOLUME</span>
                <span className="text-right">SIGNAL</span>
              </div>
              <div key={`${mode}-${run}`}>
                {results.map((r, i) => (
                  <motion.div
                    key={r.symbol}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                    className="group grid grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1fr] items-center gap-2 border-b border-border px-5 py-3 transition-colors duration-200 last:border-0 hover:bg-secondary/50"
                  >
                    <span className="flex items-center gap-2 font-mono text-xs font-medium">
                      <span className="h-3.5 w-0.5 rounded bg-primary/0 transition-colors duration-200 group-hover:bg-primary" aria-hidden="true" />
                      {r.symbol}
                    </span>
                    <span className="text-right font-mono text-xs tabular-nums">{fmtINR(r.price)}</span>
                    <span className={`text-right font-mono text-xs tabular-nums ${r.changePct >= 0 ? "text-up" : "text-down"}`}>
                      {fmtPct(r.changePct)}
                    </span>
                    <span className="hidden text-right font-mono text-[11px] text-muted-foreground sm:block">{r.volume}</span>
                    <span className="text-right">
                      <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[9px] tracking-widest ${SIGNAL_STYLE[r.signal]}`}>
                        {r.signal}
                      </span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
