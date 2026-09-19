import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { STOCK_DETAILS } from "@/lib/landing/data";
import { areaPath, fmtINR, fmtPct, pointsOf, smoothPath } from "@/lib/landing/chart";
import { EASE, fadeUp, stagger, VIEWPORT } from "@/lib/landing/motion";
import { Chapter } from "./Chapter";

const W = 720;
const H = 240;

export default function StockShowcase() {
  const [symbol, setSymbol] = useState(STOCK_DETAILS[0].symbol);
  const [hover, setHover] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const stock = STOCK_DETAILS.find((s) => s.symbol === symbol) ?? STOCK_DETAILS[0];

  const pts = useMemo(() => pointsOf(stock.chart, W, H, 6), [stock]);
  const line = useMemo(() => smoothPath(pts), [pts]);
  const area = useMemo(() => areaPath(pts, H), [pts]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = chartRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let dist = Infinity;
    pts.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setHover(best);
  };

  const rangePos = Math.min(
    100,
    Math.max(0, ((stock.price - stock.low52) / (stock.high52 - stock.low52)) * 100),
  );

  return (
    <section id="analytics" className="relative border-t border-border py-28 sm:py-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <Chapter index="05" label="Intelligence" />
        <div className="mt-9 flex flex-wrap items-end justify-between gap-6">
          <motion.h2 variants={fadeUp} className="max-w-xl text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Every symbol, under the lens.
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Click any scanner result and the full stock page opens — price action, volume,
            session levels and history in one focused view.
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-14 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          {/* header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/50 px-5 py-4 sm:px-7">
            <div role="tablist" aria-label="Select symbol" data-testid="stock-intel-symbol-select" className="flex flex-wrap gap-1.5">
              {STOCK_DETAILS.map((s) => (
                <button
                  key={s.symbol}
                  role="tab"
                  aria-selected={symbol === s.symbol}
                  data-testid={`stock-tab-${s.symbol.toLowerCase()}`}
                  onClick={() => setSymbol(s.symbol)}
                  className={`rounded-md border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors duration-200 ${
                    symbol === s.symbol
                      ? "border-primary/35 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-input hover:text-foreground"
                  }`}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-medium tabular-nums sm:text-2xl">
                ₹{fmtINR(stock.price)}
              </p>
              <p className={`font-mono text-xs tabular-nums ${stock.changePct >= 0 ? "text-up" : "text-down"}`}>
                {stock.changePct >= 0 ? "▲" : "▼"} {fmtPct(stock.changePct)}
              </p>
            </div>
          </div>

          <div className="px-5 pt-6 sm:px-7">
            <p className="text-sm text-muted-foreground">{stock.name} · NSE</p>

            {/* chart */}
            <div
              ref={chartRef}
              data-testid="stock-intel-chart"
              onMouseMove={onMove}
              onMouseLeave={() => setHover(null)}
              className="relative mt-4 cursor-crosshair"
            >
              <svg viewBox={`0 0 ${W} ${H}`} className="h-52 w-full sm:h-64" aria-label={`${stock.symbol} illustrative intraday chart`} role="img">
                <defs>
                  <linearGradient id="stockArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} stroke="#DEE2E6" strokeWidth="1" />
                ))}
                <path key={`a-${symbol}`} d={area} fill="url(#stockArea)" />
                <motion.path
                  key={`l-${symbol}`}
                  d={line}
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, ease: EASE }}
                />
                {hover !== null && (
                  <g>
                    <line x1={pts[hover].x} y1="0" x2={pts[hover].x} y2={H} stroke="#868E96" strokeWidth="1" strokeDasharray="3 4" />
                    <circle cx={pts[hover].x} cy={pts[hover].y} r="4" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2" />
                  </g>
                )}
              </svg>
              {hover !== null && (
                <div
                  className="pointer-events-none absolute top-2 rounded-md border border-border bg-card shadow-sm px-2.5 py-1.5 font-mono text-[10.5px] tabular-nums"
                  style={{ left: `${Math.min(88, Math.max(4, (pts[hover].x / W) * 100))}%` }}
                >
                  ₹{fmtINR(stock.chart[hover])}
                </div>
              )}
            </div>

            {/* volume bars */}
            <div className="mt-2 flex h-12 items-end gap-[3px]" aria-hidden="true">
              {stock.volumes.map((v, i) => (
                <motion.div
                  key={`${symbol}-${i}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.015, ease: EASE }}
                  className={`flex-1 origin-bottom rounded-sm ${stock.chart[Math.min(i + 1, stock.chart.length - 1)] >= stock.chart[i % stock.chart.length] ? "bg-up/40" : "bg-down/40"}`}
                  style={{ height: `${v * 100}%` }}
                />
              ))}
            </div>

            {/* stats */}
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border py-6 font-mono text-xs sm:grid-cols-5">
              {[
                ["OPEN", `₹${fmtINR(stock.open)}`],
                ["HIGH", `₹${fmtINR(stock.high)}`],
                ["LOW", `₹${fmtINR(stock.low)}`],
                ["PREV CLOSE", `₹${fmtINR(stock.prevClose)}`],
                ["VOLUME", stock.volume],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[9.5px] tracking-[0.2em] text-muted-foreground">{k}</p>
                  <p className="mt-1 tabular-nums text-foreground">{v}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border py-6">
              <div className="flex items-center justify-between font-mono text-[9.5px] tracking-[0.2em] text-muted-foreground">
                <span>52W LOW ₹{fmtINR(stock.low52)}</span>
                <span>52W HIGH ₹{fmtINR(stock.high52)}</span>
              </div>
              <div className="relative mt-2 h-1 rounded-full bg-border">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-down/60 via-secondary/50 to-up/70" style={{ width: "100%" }} />
                <span
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-up"
                  style={{ left: `${rangePos}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
