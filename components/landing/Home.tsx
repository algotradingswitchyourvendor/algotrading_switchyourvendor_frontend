import { MotionConfig } from "motion/react";
import CursorGlow from "@/components/landing/CursorGlow";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TickerMarquee from "@/components/landing/TickerMarquee";
import ProductIntro from "@/components/landing/ProductIntro";
import FeatureShowcase from "@/components/landing/FeatureShowcase";
import ScannerExperience from "@/components/landing/ScannerExperience";
import IntelligenceFlow from "@/components/landing/IntelligenceFlow";
import StockShowcase from "@/components/landing/StockShowcase";
import HistoricalAnalysis from "@/components/landing/HistoricalAnalysis";
import Workflow from "@/components/landing/Workflow";
import TechnicalSection from "@/components/landing/TechnicalSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="landing-page relative min-h-svh bg-background text-foreground">
        <CursorGlow />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <TickerMarquee />
          <ProductIntro />
          <FeatureShowcase />
          <ScannerExperience />
          <IntelligenceFlow />
          <StockShowcase />
          <HistoricalAnalysis />
          <Workflow />
          <TechnicalSection />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
