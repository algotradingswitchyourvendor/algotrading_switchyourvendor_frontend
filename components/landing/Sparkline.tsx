import { pointsOf, smoothPath } from "@/lib/landing/chart";

interface SparklineProps {
  data: number[];
  w?: number;
  h?: number;
  up?: boolean;
  className?: string;
}

export function Sparkline({ data, w = 72, h = 24, up = true, className }: SparklineProps) {
  const pts = pointsOf(data, w, h, 1.5);
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      className={className}
    >
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke={up ? "#16A34A" : "#DC2626"}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.9}
      />
    </svg>
  );
}
