import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, MessageSquare, Clock } from "lucide-react";
import { EASE } from "@/lib/landing/motion";

const faqs = [
  {
    id: "01",
    question: "What is MarketPulse?",
    answer: "MarketPulse is a real-time Indian equity market intelligence platform. It brings live NSE and BSE data, scanners, historical analysis and actionable signals into one focused workspace.",
  },
  {
    id: "02",
    question: "Is there a free plan?",
    answer: "Yes. The Free plan lets you explore the core MarketPulse experience, including basic scanning and live market data, before upgrading to a paid plan.",
  },
  {
    id: "03",
    question: "What data sources do you use?",
    answer: "MarketPulse processes market data through its supported market-data infrastructure and presents it through the dashboard, scanners and analytics tools.",
  },
  {
    id: "04",
    question: "How accurate are the signals?",
    answer: "MarketPulse signals are analytical indicators derived from market data and defined scanning rules. They should be used as research tools rather than guarantees of future market movement.",
  },
  {
    id: "05",
    question: "Can I upgrade or downgrade my plan later?",
    answer: "Yes. Your subscription can be changed according to the available billing options and plan rules through your account settings.",
  },
  {
    id: "06",
    question: "Do you offer a refund?",
    answer: "Please refer to our official Terms of Service for our refund policy, as it depends on your specific billing cycle and plan.",
  },
  {
    id: "07",
    question: "Is there an API available?",
    answer: "API availability depends on the subscription plan and the current MarketPulse product configuration.",
  },
  {
    id: "08",
    question: "Need more help?",
    answer: "Contact the MarketPulse team and we'll help you find the right answer.",
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0], isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        id={`faq-btn-${faq.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${faq.id}`}
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm group"
      >
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs font-bold text-primary tracking-widest">{faq.id}</span>
          <span className="text-base font-bold text-foreground">{faq.question}</span>
        </div>
        <span className="text-muted-foreground shrink-0 transition-colors group-hover:text-primary">
          {isOpen ? <Minus size={20} strokeWidth={2} /> : <Plus size={20} strokeWidth={2} />}
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${faq.id}`}
            role="region"
            aria-labelledby={`faq-btn-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden pl-12"
          >
            <div className="pb-8 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("01");

  return (
    <section id="faq" className="relative py-24 sm:py-32 border-t border-border overflow-hidden">


      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="font-mono text-xs font-bold text-primary tracking-widest">10</span>
              <div className="h-px w-12 bg-border"></div>
              <span className="font-mono text-xs font-bold text-muted-foreground tracking-widest uppercase">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Frequently asked <br className="hidden sm:block" />
              <span className="text-primary font-normal">questions.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about MarketPulse. <br className="hidden sm:block" />
              Can&apos;t find what you&apos;re looking for? <a href="/contact-support" className="text-primary underline hover:text-orange-600 transition-colors">Contact us</a>
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6 hidden md:flex">
            <p className="text-sm text-muted-foreground md:text-right">
              Clear answers. <br />
              No confusion.
            </p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Accordion (Left) */}
          <div className="lg:col-span-8 border-t border-border">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </div>

          {/* Support Card (Right) */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#FFEFDE] rounded-xl flex items-center justify-center mb-6 border border-primary/20">
                <MessageSquare className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight">
                Still have questions?
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                We&apos;re here to help. Reach out to our team and we&apos;ll get back to you as soon as possible.
              </p>
              
              <a 
                href="/contact-support"
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-orange-600 transition-colors shadow-sm mb-8"
              >
                Contact Support →
              </a>
              
              <hr className="border-border mb-6" />
              
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Support</p>
                  <p className="text-xs text-muted-foreground">Our team is here to help</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center hidden lg:block">
              <p className="font-serif text-lg text-muted-foreground italic mb-2">
                &quot;A clearer market, a smarter you.&quot;
              </p>
              <p className="text-xs text-muted-foreground font-semibold">— MarketPulse</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
