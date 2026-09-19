import { useState } from "react";
import { motion } from "motion/react";
import { Check, Shield, CreditCard, Clock, HeadphonesIcon } from "lucide-react";
import { EASE } from "@/lib/landing/motion";

const plans = [
  {
    id: "FREE",
    displayName: "FREE",
    description: "Perfect to get started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "100 live market rows",
      "Basic scanner (10 scans/day)",
      "Limited historical data (30 days)",
      "Community support",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
  {
    id: "BASIC",
    displayName: "STARTER",
    description: "For active learners",
    monthlyPrice: 99,
    yearlyPrice: Math.floor(99 * 0.74),
    badge: "🔥 Most Popular",
    features: [
      "Everything in Free",
      "Unlimited live market data",
      "Advanced scanner (100/day)",
      "Extended historical data (180 days)",
      "Advanced analytics & CSV export",
    ],
    buttonText: "Get Started",
    highlight: true,
  },
  {
    id: "PRO",
    displayName: "PRO",
    description: "For serious traders",
    monthlyPrice: 149,
    yearlyPrice: Math.floor(149 * 0.74),
    features: [
      "Everything in Starter",
      "Advanced scanner + LTD (500/day)",
      "Full historical data (1 year)",
      "FII & Sentiment analytics",
      "Standard support",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
  {
    id: "PREMIUM",
    displayName: "ULTRA",
    description: "For professionals",
    monthlyPrice: 199,
    yearlyPrice: Math.floor(199 * 0.74),
    features: [
      "Everything in Pro",
      "Unlimited scanner access",
      "Unlimited historical data",
      "Unlimited presets & columns",
      "Priority support",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-24 sm:py-32 border-t border-border overflow-hidden">


      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="font-mono text-xs font-bold text-primary tracking-widest">09</span>
              <div className="h-px w-12 bg-border"></div>
              <span className="font-mono text-xs font-bold text-muted-foreground tracking-widest uppercase">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Simple pricing <br className="hidden sm:block" />
              <span className="text-primary font-normal">for serious traders.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get the tools you need, at a price that makes sense. <br className="hidden sm:block" />
              Start free and upgrade anytime.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="text-sm text-muted-foreground md:text-right">
              Same powerful workspace. <br />
              More depth as you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center p-1 bg-white border border-border rounded-full shadow-sm">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                  !isYearly ? "bg-[#FFEFDE] text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                  isYearly ? "bg-[#FFEFDE] text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Save 26%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 * i, ease: EASE }}
              className={`relative flex flex-col bg-white rounded-2xl border p-8 transition-shadow hover:shadow-md ${
                plan.highlight 
                  ? "border-primary/50 shadow-sm bg-gradient-to-b from-white to-[#FFEFDE]/20" 
                  : "border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FFEFDE] text-primary text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary/20 flex items-center gap-1 shadow-sm whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="mb-4 mt-2">
                <h3 className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4">
                  {plan.displayName}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    ₹{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">/ month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground h-5">{plan.description}</p>
              </div>

              <hr className="border-border my-6" />
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" strokeWidth={2.5} />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/auth/sign-in"
                className={`w-full inline-flex items-center justify-center h-11 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-orange-600 shadow-sm"
                    : "bg-white text-foreground border border-border hover:bg-secondary"
                }`}
              >
                {plan.buttonText} {plan.highlight && "→"}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
          className="mt-12 bg-white border border-border rounded-xl p-6 sm:p-0 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex items-center gap-4 py-4 sm:py-6 sm:px-8">
              <Shield className="h-6 w-6 text-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-foreground">No hidden charges</p>
                <p className="text-xs text-muted-foreground">Transparent pricing</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-4 sm:py-6 sm:px-8">
              <CreditCard className="h-6 w-6 text-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-foreground">Secure payments</p>
                <p className="text-xs text-muted-foreground">Powered by Razorpay</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-4 sm:py-6 sm:px-8">
              <Clock className="h-6 w-6 text-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-foreground">Upgrade anytime</p>
                <p className="text-xs text-muted-foreground">No lock-in period</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-4 sm:py-6 sm:px-8">
              <HeadphonesIcon className="h-6 w-6 text-foreground shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-foreground">Need a custom plan?</p>
                <a href="#faq" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  Contact us →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
