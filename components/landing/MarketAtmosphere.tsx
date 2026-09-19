import { motion } from "motion/react";
import { EASE } from "@/lib/landing/motion";

const NODES = [
  { left: "12%", top: "22%", delay: "0s", color: "#FF6B00" },
  { left: "78%", top: "16%", delay: "1.4s", color: "#0EA5E9" },
  { left: "62%", top: "58%", delay: "2.6s", color: "#16A34A" },
  { left: "28%", top: "68%", delay: "3.8s", color: "#868E96" },
  { left: "90%", top: "44%", delay: "2s", color: "#868E96" },
];

export default function MarketAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="bg-market-grid absolute inset-0"
        style={{
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 32%, black 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 32%, black 20%, transparent 78%)",
        }}
      />
      <motion.svg
        className="absolute -bottom-10 left-0 h-[340px] w-full opacity-[0.07]"
        viewBox="0 0 1440 340"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 1.6, delay: 0.8 }}
      >
        <motion.path
          d="M0 280 C 120 260, 180 300, 280 250 S 460 180, 560 210 S 760 120, 880 150 S 1100 90, 1220 110 S 1380 60, 1440 70"
          fill="none"
          stroke="#16A34A"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, ease: EASE, delay: 1 }}
        />
        <motion.path
          d="M0 310 C 140 300, 220 320, 340 290 S 520 240, 660 260 S 860 200, 980 220 S 1180 170, 1300 180 S 1400 150, 1440 155"
          fill="none"
          stroke="#DEE2E6"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: EASE, delay: 1.2 }}
        />
      </motion.svg>
      {NODES.map((n, i) => (
        <span
          key={i}
          className="drift-y absolute h-[3px] w-[3px] rounded-full"
          style={{ left: n.left, top: n.top, background: n.color, animationDelay: n.delay, opacity: 0.7 }}
        />
      ))}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
