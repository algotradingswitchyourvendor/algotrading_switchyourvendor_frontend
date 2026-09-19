import { motion } from "motion/react";
import { fadeUp } from "@/lib/landing/motion";

interface ChapterProps {
  index: string;
  label: string;
}

export function Chapter({ index, label }: ChapterProps) {
  return (
    <motion.p
      variants={fadeUp}
      className="flex items-center gap-3 font-mono text-[11px] tracking-[0.32em] uppercase text-muted-foreground"
    >
      <span className="text-primary">{index}</span>
      <span className="h-px w-10 bg-border" aria-hidden="true" />
      <span>{label}</span>
    </motion.p>
  );
}
