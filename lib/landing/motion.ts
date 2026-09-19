import type { Variants } from "motion/react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

export const lineReveal: Variants = {
  hidden: { y: "112%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 0.95, ease: EASE, delay: 0.1 * i },
  }),
};

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.6, ease: EASE }, opacity: { duration: 0.3 } },
  },
};

export const VIEWPORT = { once: true, margin: "-80px" } as const;
