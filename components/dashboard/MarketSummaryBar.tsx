"use client";

import { useMarketStore } from "@/stores/market";

export function MarketSummaryBar() {
  const stocks = useMarketStore((s) => s.stocks);

  const totalStocks = stocks.length;
  const advancers = stocks.filter(
    (s) => typeof s.day_change_pct === "number" && s.day_change_pct > 0
  ).length;
  const decliners = stocks.filter(
    (s) => typeof s.day_change_pct === "number" && s.day_change_pct < 0
  ).length;
  const unchanged = totalStocks - advancers - decliners;

  const advPct = totalStocks > 0 ? (advancers / totalStocks) * 100 : 0;
  const decPct = totalStocks > 0 ? (decliners / totalStocks) * 100 : 0;

  if (totalStocks === 0) return null;

  return (
    <div style={{ display: "flex", gap: "var(--sp-4)", alignItems: "stretch", overflowX: "auto", paddingBottom: "var(--sp-2)" }}>
      {/* Total */}
      <StatCard 
        label="Total Stocks" 
        value={totalStocks.toLocaleString("en-IN")} 
        subtext="NSE + BSE"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent)" }}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        }
      />

      {/* Advancers */}
      <StatCard
        label="Advancers"
        value={advancers.toLocaleString("en-IN")}
        valueColor="var(--text-primary)"
        indicator="positive"
        pct={`${advPct.toFixed(1)}%`}
        chartColor="var(--color-positive)"
      />

      {/* Decliners */}
      <StatCard
        label="Decliners"
        value={decliners.toLocaleString("en-IN")}
        valueColor="var(--text-primary)"
        indicator="negative"
        pct={`${decPct.toFixed(1)}%`}
        chartColor="var(--color-negative)"
      />

      {/* Unchanged */}
      <StatCard 
        label="Unchanged" 
        value={unchanged.toLocaleString("en-IN")} 
        valueColor="var(--text-primary)"
        indicator="neutral"
        pct={`${(100 - advPct - decPct).toFixed(1)}%`}
        chartColor="var(--color-neutral)"
      />

      {/* Market Breadth */}
      <div
        style={{ 
          minWidth: 260, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          borderRadius: "var(--radius-lg)",
          padding: "var(--sp-4) var(--sp-5)",
          border: "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-xs)",
          flex: 1
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Market Breadth
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <div
            style={{
              width: "100%",
              height: 8,
              borderRadius: 4,
              backgroundColor: "var(--bg-tertiary)",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: `${advPct}%`,
                backgroundColor: "var(--color-positive)",
                transition: "width 500ms ease",
              }}
            />
            <div
              style={{
                width: `${100 - advPct - decPct}%`,
                backgroundColor: "var(--border-secondary)",
              }}
            />
            <div
              style={{
                width: `${decPct}%`,
                backgroundColor: "var(--color-negative)",
                transition: "width 500ms ease",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-tabular" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-positive)" }}>
              {advPct.toFixed(1)}%
            </span>
            <span className="font-tabular" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-tertiary)" }}>
              {(100 - advPct - decPct).toFixed(1)}%
            </span>
            <span className="font-tabular" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-negative)" }}>
              {decPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueColor,
  indicator,
  subtext,
  pct,
  icon,
  chartColor
}: {
  label: string;
  value: string;
  valueColor?: string;
  indicator?: "positive" | "negative" | "neutral";
  subtext?: string;
  pct?: string;
  icon?: React.ReactNode;
  chartColor?: string;
}) {
  const isPositive = indicator === "positive";
  const isNegative = indicator === "negative";
  const isNeutral = indicator === "neutral";

  return (
    <div 
      style={{ 
        minWidth: 200, 
        backgroundColor: "#ffffff",
        borderRadius: "var(--radius-lg)",
        padding: "var(--sp-4) var(--sp-5)",
        border: "1px solid var(--border-primary)",
        boxShadow: "var(--shadow-xs)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {indicator && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isPositive
                ? "var(--color-positive)"
                : isNegative
                ? "var(--color-negative)"
                : "var(--text-tertiary)",
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span
              className="font-tabular"
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: valueColor || "var(--text-primary)",
                letterSpacing: "-0.02em",
                lineHeight: 1
              }}
            >
              {value}
            </span>
            {pct && (
              <span
                className="font-tabular"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isPositive ? "var(--color-positive)" : isNegative ? "var(--color-negative)" : "var(--text-tertiary)",
                }}
              >
                {pct}
              </span>
            )}
          </div>
          {subtext && (
            <span style={{ fontSize: 11, color: "var(--text-tertiary)", display: "block", marginTop: 8 }}>
              {subtext}
            </span>
          )}
        </div>

        {icon && (
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: "var(--radius-md)", 
            backgroundColor: "var(--color-accent-bg)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            {icon}
          </div>
        )}

        {chartColor && (
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
            {isPositive && <path d="M2 22 L14 14 L24 18 L46 2" stroke={chartColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            {isNegative && <path d="M2 2 L14 10 L24 6 L46 22" stroke={chartColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            {isNeutral && <path d="M2 12 L46 12" stroke={chartColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
        )}
      </div>
    </div>
  );
}
