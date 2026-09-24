import { ReactNode } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface TOCItem {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  label: string;
  title: string;
  description: string;
  lastUpdated: string;
  toc: TOCItem[];
  children: ReactNode;
}

export default function LegalPageLayout({
  label,
  title,
  description,
  lastUpdated,
  toc,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="landing-page relative min-h-svh bg-background text-foreground">
      <Navbar />
      <main className="relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Header Section */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 mb-12 md:mb-20">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold tracking-wider text-primary mb-4">
              {label}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>
            <p className="font-mono text-xs tracking-wider text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
            {/* Desktop TOC */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32">
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground mb-6">
                  CONTENTS
                </p>
                <nav className="flex flex-col gap-3">
                  {toc.map((item, i) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="font-mono text-xs opacity-50 mr-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Mobile TOC */}
            <div className="lg:hidden p-5 rounded-lg border border-border bg-secondary/30 mb-8">
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground mb-4">
                CONTENTS
              </p>
              <nav className="flex flex-col gap-3">
                {toc.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="font-mono text-xs opacity-50 mr-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <article className="max-w-3xl flex-1 flex flex-col gap-12 lg:gap-16 pb-20">
              {children}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
