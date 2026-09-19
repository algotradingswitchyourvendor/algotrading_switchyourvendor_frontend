import { MARQUEE_ITEMS } from "@/lib/landing/data";
import { fmtINR, fmtPct } from "@/lib/landing/chart";

function TickerItems() {
  return (
    <>
      {MARQUEE_ITEMS.map((item, i) => (
        <span key={`${item.symbol}-${i}`} className="flex shrink-0 items-center gap-3 px-7">
          <span className="font-mono text-xs tracking-wider text-secondary-foreground">{item.symbol}</span>
          <span className="font-mono text-xs tabular-nums text-foreground">{fmtINR(item.price)}</span>
          <span
            className={`font-mono text-xs tabular-nums ${item.changePct >= 0 ? "text-up" : "text-down"}`}
          >
            {item.changePct >= 0 ? "▲" : "▼"} {fmtPct(item.changePct)}
          </span>
          <span className="ml-4 h-1 w-1 rounded-full bg-border" aria-hidden="true" />
        </span>
      ))}
    </>
  );
}

export default function TickerMarquee() {
  return (
    <section
      aria-label="Illustrative market ticker"
      className="marquee relative overflow-hidden border-y border-border bg-secondary/30 py-3.5"
    >
      <div className="marquee-track flex w-max">
        <div className="flex" aria-hidden="false">
          <TickerItems />
        </div>
        <div className="flex" aria-hidden="true">
          <TickerItems />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
}
