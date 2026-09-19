import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Activity, LayoutDashboard, ScanSearch } from "lucide-react";
import { INDICES, SCANNER_RESULTS, STOCKS, type Signal, type Stock } from "@/lib/landing/data";
import { fmtINR, fmtPct } from "@/lib/landing/chart";
import { Sparkline } from "./Sparkline";

interface LiveRow extends Stock {
  live: number;
  dir: 1 | -1;
  tick: number;
}

const SIGNAL_STYLE: Record<Signal, string> = {
  MOMENTUM: "bg-up/10 text-up border-up/25",
  BREAKOUT: "bg-signal/10 text-signal border-signal/25",
  TREND: "bg-secondary text-secondary-foreground border-border",
  REVERSAL: "bg-down/10 text-down border-down/25",
  WATCH: "bg-secondary text-muted-foreground border-border",
};

function useLiveRows(active: boolean) {
  const reduced = useReducedMotion();
  const [rows, setRows] = useState<LiveRow[]>(
    STOCKS.slice(0, 6).map((s) => ({ ...s, live: s.price, dir: 1 as const, tick: 0 })),
  );
  const [indices, setIndices] = useState(INDICES.slice(0, 3));

  useEffect(() => {
    if (reduced || !active) return;
    const id = setInterval(() => {
      setRows((rs) =>
        rs.map((r) => {
          const d = (Math.random() - 0.48) * r.price * 0.0011;
          return {
            ...r,
            live: +(r.live + d).toFixed(2),
            dir: d >= 0 ? (1 as const) : (-1 as const),
            tick: r.tick + 1,
          };
        }),
      );
      setIndices((ix) =>
        ix.map((q) => {
          const d = (Math.random() - 0.48) * q.price * 0.0004;
          return { ...q, price: +(q.price + d).toFixed(2) };
        }),
      );
    }, 1600);
    return () => clearInterval(id);
  }, [reduced, active]);

  return { rows, indices };
}

export default function HeroTerminal() {
  const [tab, setTab] = useState<"dashboard" | "scanner">("dashboard");
  const { rows, indices } = useLiveRows(true);

  return (
    <div
      data-testid="hero-terminal"
      className="overflow-hidden rounded-xl border border-border bg-card shadow-lg"
    >
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <span className="hidden font-mono text-[11px] tracking-wider text-muted-foreground sm:block">
            marketpulse · terminal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Terminal view" className="flex rounded-md border border-border bg-secondary p-0.5">
            <button
              role="tab"
              aria-selected={tab === "dashboard"}
              data-testid="terminal-tab-dashboard"
              onClick={() => setTab("dashboard")}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] transition-colors duration-200 ${
                tab === "dashboard" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard size={11} /> Dashboard
            </button>
            <button
              role="tab"
              aria-selected={tab === "scanner"}
              data-testid="terminal-tab-scanner"
              onClick={() => setTab("scanner")}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] transition-colors duration-200 ${
                tab === "scanner" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ScanSearch size={11} /> Scanner
            </button>
          </div>
          {/* <span className="rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-primary">
            DEMO
          </span> */}
        </div>
      </div>

      {tab === "dashboard" ? (
        <div className="p-4 sm:p-5">
          {/* indices strip */}
          <div className="grid grid-cols-3 gap-2.5">
            {indices.map((q) => (
              <div key={q.symbol} className="rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground">{q.symbol}</p>
                <p className="mt-1 font-mono text-sm font-medium tabular-nums sm:text-base">
                  {fmtINR(q.price)}
                </p>
                <p className={`font-mono text-[11px] tabular-nums ${q.changePct >= 0 ? "text-up" : "text-down"}`}>
                  {fmtPct(q.changePct)}
                </p>
              </div>
            ))}
          </div>

          {/* live table */}
          <div className="mt-4" role="table" aria-label="Illustrative live market table">
            <div
              role="row"
              className="grid grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.7fr] gap-2 border-b border-border pb-2 font-mono text-[9.5px] tracking-[0.18em] text-muted-foreground"
            >
              <span role="columnheader">SYMBOL</span>
              <span role="columnheader" className="hidden sm:block">SPARK</span>
              <span role="columnheader" className="text-right">LTP</span>
              <span role="columnheader" className="text-right">CHG%</span>
              <span role="columnheader" className="text-right">VOL</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.symbol}
                role="row"
                className="grid grid-cols-[1.2fr_0.9fr_1fr_0.8fr_0.7fr] items-center gap-2 border-b border-border py-2.5 transition-colors duration-200 hover:bg-secondary/50"
              >
                <div role="cell" className="min-w-0">
                  <p className="truncate font-mono text-xs font-medium">{r.symbol}</p>
                  <p className="hidden truncate text-[10px] text-muted-foreground lg:block">{r.name}</p>
                </div>
                <div role="cell" className="hidden sm:block">
                  <Sparkline data={r.spark} up={r.changePct >= 0} w={64} h={20} />
                </div>
                <div role="cell" className="text-right">
                  <span
                    key={r.tick}
                    className={`inline-block rounded px-1 font-mono text-xs tabular-nums ${
                      r.tick > 0 ? (r.dir > 0 ? "tick-up" : "tick-down") : ""
                    }`}
                  >
                    {fmtINR(r.live)}
                  </span>
                </div>
                <div
                  role="cell"
                  className={`text-right font-mono text-xs tabular-nums ${r.changePct >= 0 ? "text-up" : "text-down"}`}
                >
                  {fmtPct(r.changePct)}
                </div>
                <div role="cell" className="text-right font-mono text-[11px] text-muted-foreground">
                  {r.volume}
                </div>
              </div>
            ))}
          </div>

          {/* footer strip */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground">BREADTH</span>
              <div className="flex h-1 w-28 overflow-hidden rounded-full bg-down/20">
                <div className="h-full w-[67%] bg-up" />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                <span className="text-up">1,420</span> / <span className="text-down">688</span>
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
              <Activity size={11} className="text-up" />
              MoM scanner · 6 signals
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {["MoM scanner", "Δ ≥ +1.0%", "Vol ≥ 2× avg", "Price > ₹100"].map((f, i) => (
              <span
                key={f}
                className={`rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wide ${
                  i === 0
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-secondary/50 text-muted-foreground"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
          <div className="mt-4" role="table" aria-label="Illustrative scanner results">
            {SCANNER_RESULTS.mom.map((r) => (
              <div
                key={r.symbol}
                role="row"
                className="grid grid-cols-[1.1fr_1fr_0.8fr_0.9fr] items-center gap-2 border-b border-border py-2.5 transition-colors duration-200 hover:bg-secondary/50"
              >
                <span role="cell" className="font-mono text-xs font-medium">{r.symbol}</span>
                <span role="cell" className="text-right font-mono text-xs tabular-nums sm:text-left">
                  {fmtINR(r.price)}
                </span>
                <span role="cell" className={`text-right font-mono text-xs tabular-nums ${r.changePct >= 0 ? "text-up" : "text-down"}`}>
                  {fmtPct(r.changePct)}
                </span>
                <span role="cell" className="text-right">
                  <span className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-widest ${SIGNAL_STYLE[r.signal]}`}>
                    {r.signal}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] text-muted-foreground">
            6 matches · scanned 2,400+ NSE symbols
          </p>
        </div>
      )}

      <div className="border-t border-border bg-secondary/50 px-4 py-2">
        <p className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground/70">
          ILLUSTRATIVE DATA — NOT LIVE MARKET VALUES
        </p>
      </div>
    </div>
  );
}
