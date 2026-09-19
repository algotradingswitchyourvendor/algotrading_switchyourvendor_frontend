import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { APP_URL } from "@/config/landingAppConfig";
import { EASE, fadeUp, lineReveal, stagger } from "@/lib/landing/motion";
import MarketAtmosphere from "./MarketAtmosphere";
import HeroTerminal from "./HeroTerminal";

const HEADLINE = ["See the market.", "Before it moves."];

export default function Hero() {
  const reduced = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    setCanTilt(window.matchMedia("(pointer: fine)").matches && !reduced);
  }, [reduced]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3.5, -3.5]), { stiffness: 110, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4.5, 4.5]), { stiffness: 110, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canTilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section id="top" onMouseMove={onMove} className="relative overflow-hidden pt-10 pb-14 sm:pt-20 lg:pb-20">
      <MarketAtmosphere />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10"
        >
          <div>
            <motion.div variants={fadeUp} className="inline-flex">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-up/25 bg-up/[0.07] px-3.5 py-1.5 font-mono text-[10.5px] tracking-[0.24em] text-up">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-up" aria-hidden="true" />
                LIVE MARKET INTELLIGENCE
              </span>
            </motion.div>

            <h1 className="mt-7 text-[2.75rem] leading-[1.04] font-bold tracking-[-0.03em] sm:text-6xl lg:text-[4.35rem]">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    variants={lineReveal}
                    custom={i + 1}
                    className={`block ${i === 1 ? "text-primary" : ""}`}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Monitor Indian equities in real time, discover market signals faster, and move
              from raw data to meaningful analysis — in one focused workspace.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
              <motion.a
                href={APP_URL}
                data-testid="hero-cta-launch"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-brand-hover"
              >
                Open MarketPulse
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </motion.a>
              <motion.a
                href="#scanner"
                data-testid="hero-cta-scanner"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-input hover:bg-secondary"
              >
                Explore Scanner
                <ChevronDown size={15} className="text-muted-foreground" />
              </motion.a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-5 font-mono text-[10.5px] tracking-[0.18em] text-muted-foreground/80">
              NSE · BSE EQUITIES — MOM &amp; LTD SCANNERS — WEBSOCKET STREAMING
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 56, scale: 0.965 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.05, ease: EASE, delay: 0.55 }}
            style={canTilt ? { rotateX, rotateY, transformPerspective: 1400 } : undefined}
            className="will-change-transform"
          >
            <HeroTerminal />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
