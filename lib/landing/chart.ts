export interface Pt {
  x: number;
  y: number;
}

export function pointsOf(values: number[], w: number, h: number, pad = 2): Pt[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / span) * (h - pad * 2),
  }));
}

export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function areaPath(pts: Pt[], h: number): string {
  if (pts.length < 2) return "";
  const line = smoothPath(pts);
  return `${line} L ${pts[pts.length - 1].x.toFixed(2)} ${h} L ${pts[0].x.toFixed(2)} ${h} Z`;
}

export const fmtINR = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
