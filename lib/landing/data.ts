// Illustrative demo dataset for the MarketPulse marketing site.
// All values are sample data for presentation only — not live market values.

export interface IndexQuote {
  symbol: string;
  venue: string;
  price: number;
  changePct: number;
}

export const INDICES: IndexQuote[] = [
  { symbol: "NIFTY 50", venue: "NSE", price: 24853.4, changePct: 0.42 },
  { symbol: "SENSEX", venue: "BSE", price: 81455.3, changePct: 0.38 },
  { symbol: "NIFTY BANK", venue: "NSE", price: 53240.85, changePct: 0.68 },
  { symbol: "INDIA VIX", venue: "NSE", price: 13.24, changePct: -2.1 },
];

export type Signal = "MOMENTUM" | "BREAKOUT" | "TREND" | "REVERSAL" | "WATCH";

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  volume: string;
  signal: Signal;
  spark: number[];
}

export const STOCKS: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2987.45, changePct: 1.24, volume: "18.4M", signal: "BREAKOUT", spark: [42, 44, 43, 46, 48, 47, 50, 52, 51, 54, 57, 56, 59, 62] },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1742.6, changePct: 0.86, volume: "12.1M", signal: "MOMENTUM", spark: [50, 51, 49, 52, 53, 55, 54, 56, 58, 57, 59, 60, 62, 63] },
  { symbol: "TCS", name: "Tata Consultancy Svcs", price: 4102.3, changePct: -0.42, volume: "3.2M", signal: "WATCH", spark: [60, 59, 61, 58, 57, 58, 56, 55, 57, 54, 53, 55, 52, 51] },
  { symbol: "INFY", name: "Infosys", price: 1864.75, changePct: 0.61, volume: "8.7M", signal: "MOMENTUM", spark: [45, 46, 47, 46, 48, 49, 48, 50, 51, 52, 51, 53, 54, 55] },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1288.9, changePct: 1.05, volume: "15.9M", signal: "BREAKOUT", spark: [40, 42, 41, 44, 45, 47, 46, 48, 50, 52, 51, 53, 55, 57] },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 965.2, changePct: 2.34, volume: "22.6M", signal: "MOMENTUM", spark: [35, 37, 39, 38, 41, 43, 45, 44, 47, 49, 52, 54, 57, 60] },
  { symbol: "SBIN", name: "State Bank of India", price: 812.45, changePct: -0.28, volume: "19.3M", signal: "REVERSAL", spark: [58, 57, 59, 56, 55, 56, 54, 53, 52, 53, 51, 50, 49, 48] },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1542.1, changePct: 0.72, volume: "6.4M", signal: "TREND", spark: [48, 49, 51, 50, 52, 53, 52, 54, 55, 56, 58, 57, 59, 60] },
  { symbol: "ITC", name: "ITC Ltd", price: 462.85, changePct: -0.15, volume: "11.2M", signal: "WATCH", spark: [52, 51, 52, 50, 51, 49, 50, 48, 49, 48, 47, 48, 47, 46] },
  { symbol: "LT", name: "Larsen & Toubro", price: 3684.5, changePct: 1.48, volume: "4.8M", signal: "BREAKOUT", spark: [44, 46, 45, 48, 49, 51, 50, 53, 55, 54, 57, 58, 61, 63] },
];

export interface ScannerResult {
  symbol: string;
  price: number;
  changePct: number;
  volume: string;
  signal: Signal;
}

export const SCANNER_RESULTS: Record<"mom" | "ltd", ScannerResult[]> = {
  mom: [
    { symbol: "TATAMOTORS", price: 965.2, changePct: 2.34, volume: "22.6M", signal: "MOMENTUM" },
    { symbol: "LT", price: 3684.5, changePct: 1.48, volume: "4.8M", signal: "MOMENTUM" },
    { symbol: "RELIANCE", price: 2987.45, changePct: 1.24, volume: "18.4M", signal: "MOMENTUM" },
    { symbol: "ICICIBANK", price: 1288.9, changePct: 1.05, volume: "15.9M", signal: "MOMENTUM" },
    { symbol: "HDFCBANK", price: 1742.6, changePct: 0.86, volume: "12.1M", signal: "MOMENTUM" },
    { symbol: "BHARTIARTL", price: 1542.1, changePct: 0.72, volume: "6.4M", signal: "MOMENTUM" },
  ],
  ltd: [
    { symbol: "RELIANCE", price: 2987.45, changePct: 1.24, volume: "18.4M", signal: "BREAKOUT" },
    { symbol: "LT", price: 3684.5, changePct: 1.48, volume: "4.8M", signal: "BREAKOUT" },
    { symbol: "ICICIBANK", price: 1288.9, changePct: 1.05, volume: "15.9M", signal: "BREAKOUT" },
    { symbol: "BHARTIARTL", price: 1542.1, changePct: 0.72, volume: "6.4M", signal: "TREND" },
    { symbol: "INFY", price: 1864.75, changePct: 0.61, volume: "8.7M", signal: "TREND" },
    { symbol: "HDFCBANK", price: 1742.6, changePct: 0.86, volume: "12.1M", signal: "TREND" },
  ],
};

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function series(seed: number, n: number, start: number, volPct: number, driftPct = 0): number[] {
  const rnd = seeded(seed);
  const out: number[] = [start];
  let v = start;
  for (let i = 1; i < n; i++) {
    v = v * (1 + driftPct + (rnd() - 0.5) * 2 * volPct);
    out.push(+v.toFixed(2));
  }
  return out;
}

export function volumeBars(seed: number, n: number): number[] {
  const rnd = seeded(seed);
  return Array.from({ length: n }, () => +(0.25 + rnd() * 0.75).toFixed(2));
}

export interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: string;
  high52: number;
  low52: number;
  chart: number[];
  volumes: number[];
}

export const STOCK_DETAILS: StockDetail[] = [
  {
    symbol: "RELIANCE", name: "Reliance Industries Ltd", price: 2987.45, changePct: 1.24,
    open: 2948.1, high: 2996.8, low: 2941.25, prevClose: 2950.85, volume: "18.4M",
    high52: 3217.6, low52: 2226.0,
    chart: series(11, 48, 2790, 0.011, 0.0015), volumes: volumeBars(21, 32),
  },
  {
    symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 1742.6, changePct: 0.86,
    open: 1728.4, high: 1751.9, low: 1722.15, prevClose: 1727.75, volume: "12.1M",
    high52: 1880.0, low52: 1363.55,
    chart: series(31, 48, 1660, 0.009, 0.001), volumes: volumeBars(41, 32),
  },
  {
    symbol: "TCS", name: "Tata Consultancy Services", price: 4102.3, changePct: -0.42,
    open: 4128.0, high: 4144.6, low: 4086.3, prevClose: 4119.6, volume: "3.2M",
    high52: 4592.25, low52: 3592.0,
    chart: series(51, 48, 4240, 0.01, -0.0008), volumes: volumeBars(61, 32),
  },
  {
    symbol: "INFY", name: "Infosys Ltd", price: 1864.75, changePct: 0.61,
    open: 1852.3, high: 1876.4, low: 1844.9, prevClose: 1853.45, volume: "8.7M",
    high52: 2006.8, low52: 1411.0,
    chart: series(71, 48, 1780, 0.012, 0.0009), volumes: volumeBars(81, 32),
  },
];

export type HistoryPeriod = "1M" | "6M" | "1Y" | "5Y";

export const HISTORY_PERIODS: HistoryPeriod[] = ["1M", "6M", "1Y", "5Y"];

export const HISTORY: Record<HistoryPeriod, { points: number[]; labels: string[] }> = {
  "1M": { points: series(101, 22, 24380, 0.006, 0.0009), labels: ["W1", "W2", "W3", "W4"] },
  "6M": { points: series(202, 26, 23150, 0.011, 0.0014), labels: ["FEB", "MAR", "APR", "MAY", "JUN", "JUL"] },
  "1Y": { points: series(303, 52, 22800, 0.014, 0.0017), labels: ["AUG", "OCT", "DEC", "FEB", "APR", "JUN"] },
  "5Y": { points: series(404, 60, 14200, 0.022, 0.0023), labels: ["2021", "2022", "2023", "2024", "2025", "2026"] },
};

export const MARQUEE_ITEMS: { symbol: string; price: number; changePct: number }[] = [
  ...INDICES.map((i) => ({ symbol: i.symbol, price: i.price, changePct: i.changePct })),
  ...STOCKS.slice(0, 8).map((s) => ({ symbol: s.symbol, price: s.price, changePct: s.changePct })),
];
