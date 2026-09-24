import { APP_URL } from "@/config/landingAppConfig";
import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Dashboard", href: APP_URL },
  { label: "Scanner", href: "/#scanner" },
  { label: "Stock Analytics", href: "/#analytics" },
  { label: "History", href: "/#history" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <p className="text-[15px] font-semibold tracking-tight">MarketPulse</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Real-time Indian equity market intelligence. See the market, before it moves.
            </p>
          </div>
          <nav aria-label="Footer" className="flex gap-16">
            <div>
              <p className="font-mono text-[10px] tracking-[0.26em] text-muted-foreground">PRODUCT</p>
              <ul className="mt-4 space-y-2.5">
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-secondary-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.26em] text-muted-foreground">SESSION</p>
              <ul className="mt-4 space-y-2.5 font-mono text-xs text-muted-foreground">
                <li>NSE · BSE</li>
                <li>09:15 – 15:30 IST</li>
                <li>UTC +05:30</li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.26em] text-muted-foreground">LEGAL</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/privacy"
                    data-testid="footer-link-privacy"
                    className="text-sm text-secondary-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    data-testid="footer-link-terms"
                    className="text-sm text-secondary-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border py-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10.5px] tracking-wider text-muted-foreground">
            © 2026 MARKETPULSE
          </p>
          <p className="font-mono text-[10.5px] tracking-wider text-muted-foreground/80">
            ILLUSTRATIVE DEMO DATA · NOT INVESTMENT ADVICE
          </p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none -mb-6 select-none w-full text-center whitespace-nowrap text-[14vw] font-bold leading-[0.85] tracking-[-0.04em] text-foreground/[0.03] sm:-mb-10"
      >
        MARKETPULSE
      </p>
    </footer>
  );
}
