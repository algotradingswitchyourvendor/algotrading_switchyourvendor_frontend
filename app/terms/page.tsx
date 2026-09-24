import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service | MarketPulse",
  description: "Review the terms governing your use of MarketPulse.",
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "eligibility", title: "Eligibility" },
  { id: "account-registration", title: "Account Registration" },
  { id: "market-data-analytics", title: "Market Data and Analytics" },
  { id: "trading-disclaimer", title: "Trading & Investment Disclaimer" },
  { id: "broker-integrations", title: "Broker Integrations" },
  { id: "subscriptions", title: "Subscriptions and Plans" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "changes-to-terms", title: "Changes to Terms" },
  { id: "contact", title: "Contact" },
];

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-6">
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground mb-2 block">
          {index}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      label="MARKETPULSE / TERMS"
      title="Terms of Service"
      description="The terms that govern your access to and use of MarketPulse and its services."
      lastUpdated="September 2026"
      toc={TOC}
    >
      <Section id="introduction" index="01" title="Introduction">
        <p>
          Welcome to MarketPulse. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
          MarketPulse website, applications, and related services (collectively, the &quot;Service&quot;).
        </p>
        <p>
          By accessing or using the Service, you agree to be bound by these Terms. If you do not agree
          to these Terms, you may not access or use the Service.
        </p>
      </Section>

      <Section id="eligibility" index="02" title="Eligibility">
        <p>
          You must be at least 18 years old and capable of forming a binding contract to use the Service.
          By using MarketPulse, you represent and warrant that you meet these eligibility requirements.
        </p>
      </Section>

      <Section id="account-registration" index="03" title="Account Registration">
        <p>
          To access certain features of MarketPulse, you must register for an account. You agree to provide
          accurate, current, and complete information during the registration process and to keep your
          account information updated.
        </p>
        <p>
          You are responsible for safeguarding the credentials you use to access the Service and for any
          activities or actions under your account. We encourage you to use strong passwords or secure
          OAuth providers (such as Google).
        </p>
      </Section>

      <Section id="market-data-analytics" index="04" title="Market Data and Analytics">
        <p>
          MarketPulse provides market data, analytics, screening tools, and informational content.
          While we strive for accuracy, the data provided is sourced from third parties and we do not
          warrant its accuracy, completeness, or timeliness.
        </p>
        <p>
          Market data is provided for informational and analytical purposes only and should not be
          relied upon as the sole basis for making financial decisions.
        </p>
      </Section>

      <Section id="trading-disclaimer" index="05" title="Trading & Investment Disclaimer">
        <div className="my-6 border-l-4 border-primary pl-6 py-2 bg-secondary/10">
          <h3 className="text-lg font-semibold text-foreground mb-2">MARKET DATA ≠ INVESTMENT ADVICE</h3>
          <p className="text-sm">
            MarketPulse provides market data, analytics, screening, and informational tools. These features
            are not a substitute for independent financial research or professional financial advice.
          </p>
          <p className="text-sm mt-2">
            MarketPulse is not a registered investment advisor, broker, or financial institution. Users are
            solely responsible for their own investment and trading decisions.
          </p>
        </div>
      </Section>

      <Section id="broker-integrations" index="06" title="Broker Integrations">
        <p>
          MarketPulse may allow you to connect third-party brokerage accounts (such as Upstox or Zerodha).
          By connecting a broker account, you authorize MarketPulse to access data and execute actions
          (including trades) strictly based on your configured parameters and explicit instructions.
        </p>
        <p>
          We are not responsible for execution delays, API failures from the broker, or financial losses
          resulting from trades executed via our integrations. You remain fully responsible for monitoring
          your connected broker accounts.
        </p>
      </Section>

      <Section id="subscriptions" index="07" title="Subscriptions and Plans">
        <p>
          MarketPulse offers both free and paid subscription plans (such as Basic, Pro, or Premium).
          Paid features require an active subscription billed on a recurring basis.
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>
            <strong className="text-foreground">Payments:</strong> Subscription fees are processed via our authorized payment provider (e.g., Razorpay).
          </li>
          <li>
            <strong className="text-foreground">Cancellation:</strong> You may cancel your subscription at any time. Cancellation will take effect at the end of the current billing cycle.
          </li>
          <li>
            <strong className="text-foreground">Refunds:</strong> Unless otherwise required by law, subscription fees are non-refundable.
          </li>
        </ul>
      </Section>

      <Section id="acceptable-use" index="08" title="Acceptable Use">
        <p>
          You agree not to misuse the Service or help anyone else do so. Prohibited activities include:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Scraping, extracting, or indexing market data without explicit permission.</li>
          <li>Attempting to bypass access controls or security measures.</li>
          <li>Using the Service for illegal, fraudulent, or unauthorized purposes.</li>
          <li>Reselling or redistributing MarketPulse analytics or signals as your own.</li>
        </ul>
      </Section>

      <Section id="intellectual-property" index="09" title="Intellectual Property">
        <p>
          The Service and its original content, features, analytics models, and functionality are and will
          remain the exclusive property of MarketPulse and its licensors. The MarketPulse name, logo,
          and design marks are our trademarks and may not be used without permission.
        </p>
      </Section>

      <Section id="limitation-liability" index="10" title="Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, in no event shall MarketPulse, its directors,
          employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental,
          special, consequential or punitive damages, including without limitation, loss of profits, data,
          use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Your access to or use of or inability to access or use the Service.</li>
          <li>Any conduct or content of any third party on the Service.</li>
          <li>Any trading or investment losses incurred while using the Service.</li>
          <li>Unauthorized access, use or alteration of your transmissions or content.</li>
        </ul>
      </Section>

      <Section id="changes-to-terms" index="11" title="Changes to Terms">
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
          By continuing to access or use our Service after those revisions become effective, you agree
          to be bound by the revised terms.
        </p>
      </Section>

      <Section id="contact" index="12" title="Contact">
        <p>
          If you have any questions about these Terms, please contact us:
        </p>
        <div className="mt-4 p-4 rounded-lg border border-border bg-secondary/20">
          <p className="font-mono text-sm text-foreground">
            {/* TODO: REPLACE_WITH_OFFICIAL_SUPPORT_EMAIL */}
            Email: support@marketpulse.com
          </p>
        </div>
      </Section>
    </LegalPageLayout>
  );
}
