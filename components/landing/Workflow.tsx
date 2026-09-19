import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { fadeUp, stagger, VIEWPORT } from "@/lib/landing/motion";
import { Chapter } from "./Chapter";

const STEPS = [
  { n: "01", title: "Monitor", desc: "Open the dashboard. The whole session, live, in one view." },
  { n: "02", title: "Scan", desc: "Run MoM or LTD across the universe. Matches surface instantly." },
  { n: "03", title: "Inspect", desc: "Click any row. Price, volume and structure — one focused page." },
  { n: "04", title: "Analyze", desc: "Zoom into history and read how the move actually formed." },
  { n: "05", title: "Act", desc: "Leave the workspace with a decision, not a hunch." },
];

export default function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 45%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });

  return (
    <section id="workflow" className="relative border-t border-border py-28 sm:py-36">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto max-w-7xl px-5 sm:px-8"
      >
        <Chapter index="07" label="Workflow" />
        <div className="mt-9 flex flex-wrap items-end justify-between gap-6">
          <motion.h2 variants={fadeUp} className="max-w-xl text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            A session, start to finish.
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            The workflow is the product. Five movements, one continuous surface.
          </motion.p>
        </div>

        <div ref={ref} className="mt-16">
          {/* progress track (desktop) */}
          <div className="relative mb-10 hidden h-px bg-border md:block" aria-hidden="true">
            <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-primary" style={{ scaleX }} />
          </div>

          <div className="grid gap-10 md:grid-cols-5 md:gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                data-testid={`workflow-step-${s.n}`}
                variants={fadeUp}
                className="relative border-l border-border pl-5 md:border-l-0 md:pl-0"
              >
                <span
                  className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border border-primary/50 bg-background md:hidden"
                  aria-hidden="true"
                />
                <p className="font-mono text-[11px] tracking-[0.3em] text-primary">{s.n}</p>
                <p className="pointer-events-none mt-3 select-none text-5xl font-bold tracking-tight text-foreground/5 lg:text-6xl" aria-hidden="true">
                  {s.n}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <span className="sr-only">Step {i + 1} of 5</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
