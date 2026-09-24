import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | MarketPulse",
  description: "Learn how MarketPulse collects, uses, and protects information.",
};

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use-information", title: "How We Use Information" },
  { id: "google-sign-in", title: "Google Sign-In" },
  { id: "broker-integrations", title: "Broker Integrations" },
  { id: "market-data", title: "Market Data" },
  { id: "cookies", title: "Cookies & Similar Technologies" },
  { id: "data-storage-security", title: "Data Storage & Security" },
  { id: "data-retention", title: "Data Retention" },
  { id: "third-party-services", title: "Third-Party Services" },
  { id: "your-rights", title: "Your Rights" },
  { id: "changes-to-policy", title: "Changes to This Policy" },
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

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      label="MARKETPULSE / PRIVACY"
      title="Privacy Policy"
      description="A clear explanation of how MarketPulse collects, uses, stores, and protects information when you use our website and services."
      lastUpdated="September 2026"
      toc={TOC}
    >
      <Section id="introduction" index="01" title="Introduction">
        <p>
          This Privacy Policy explains how MarketPulse (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses,
          discloses, and safeguards your information when you visit our website, use our application,
          or engage with our services.
        </p>
        <p>
          We are committed to protecting your personal information and your right to privacy.
          If you have any questions or concerns about this privacy notice, or our practices
          with regards to your personal information, please contact us at the email provided
          in the Contact section.
        </p>
      </Section>

      <Section id="information-we-collect" index="02" title="Information We Collect">
        <h3 className="text-xl font-medium text-foreground mt-8 mb-3">2.1 Account Information</h3>
        <p>
          When you register for an account, we collect information that identifies you, which may include:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Name</li>
          <li>Email address</li>
          <li>Authentication provider information</li>
          <li>User profile preferences</li>
        </ul>

        <h3 className="text-xl font-medium text-foreground mt-8 mb-3">2.2 Authentication Information</h3>
        <p>
          We use modern authentication methods including Google OAuth. When you authenticate using Google,
          we receive the information you explicitly agree to share (such as your email and basic profile).
          We do not receive or store your Google password.
        </p>

        <h3 className="text-xl font-medium text-foreground mt-8 mb-3">2.3 Subscription and Billing Information</h3>
        <p>
          If you subscribe to our paid plans, billing information is processed by our secure payment
          provider (e.g., Razorpay). We store subscription status and transaction records, but we do
          not store your full credit card details on our servers.
        </p>

        <h3 className="text-xl font-medium text-foreground mt-8 mb-3">2.4 Broker Integrations</h3>
        <p>
          If you connect your Upstox or Zerodha account, we process the necessary tokens to fetch your
          positions and execute trades on your behalf via the broker APIs. We do not store your primary
          broker login passwords. Technical secrets used for broker integrations are encrypted and stored
          securely.
        </p>

        <h3 className="text-xl font-medium text-foreground mt-8 mb-3">2.5 Usage and Technical Information</h3>
        <p>
          We collect standard technical information automatically when you visit our services, including
          device type, operating system, browser type, IP address, and interaction data with our application.
          This is required for the proper functioning, security, and optimization of the application.
        </p>
      </Section>

      <Section id="how-we-use-information" index="03" title="How We Use Information">
        <p>We use the collected information for the following purposes:</p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>To authenticate your account and maintain active sessions.</li>
          <li>To provide, operate, and maintain MarketPulse functionality.</li>
          <li>To process subscriptions, payments, and prevent fraudulent transactions.</li>
          <li>To provide market analytics, customized scanners, and relevant alerts.</li>
          <li>To improve the reliability and performance of our infrastructure.</li>
          <li>To provide customer support and respond to inquiries.</li>
        </ul>
      </Section>

      <Section id="google-sign-in" index="04" title="Google Sign-In">
        <p>
          MarketPulse allows you to authenticate using Google Sign-In. When you choose this method:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>We request access to basic profile information and your email address.</li>
          <li>We use this information solely to provision and secure your MarketPulse account.</li>
          <li>Authentication credentials and passwords are not obtained through this flow.</li>
        </ul>
      </Section>

      <Section id="broker-integrations" index="05" title="Broker Integrations">
        <p>
          MarketPulse integrates with third-party brokers (such as Upstox and Zerodha) to provide
          portfolio tracking and trading capabilities.
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>
            <strong className="text-foreground">Authentication:</strong> Account connections use official broker API OAuth or API key mechanisms.
          </li>
          <li>
            <strong className="text-foreground">Market Data:</strong> We may fetch positions and holdings to display your portfolio analytics.
          </li>
          <li>
            <strong className="text-foreground">Trading Permissions:</strong> Trade execution only occurs based on your explicit configuration and API permissions.
          </li>
        </ul>
      </Section>

      <Section id="market-data" index="06" title="Market Data">
        <p>
          MarketPulse processes large amounts of market data to provide analytics, historical charts,
          and scanners. This market data is generalized and not tied to your personal identity. We do
          not imply or collect user-specific trading data for external sale or unauthorized sharing.
        </p>
      </Section>

      <Section id="cookies" index="07" title="Cookies & Similar Technologies">
        <p>
          We use cookies and similar tracking technologies to track activity on our service and hold certain information.
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li>
            <strong className="text-foreground">Session Cookies:</strong> Essential for operating the service and maintaining user authentication state.
          </li>
          <li>
            <strong className="text-foreground">Security Cookies:</strong> Used for security purposes and preventing abuse.
          </li>
        </ul>
        <p>
          We do not use invasive third-party advertising cookies on our core application platform.
        </p>
      </Section>

      <Section id="data-storage-security" index="08" title="Data Storage & Security">
        <p>
          We implement commercially reasonable security measures designed to protect your information.
          These include encrypted HTTPS connections, authenticated API sessions, secure cookie settings,
          and least-privilege access controls within our cloud infrastructure.
        </p>
        <p>
          However, please be aware that no method of transmission over the internet or method of
          electronic storage is 100% secure. While we strive to use acceptable means to protect
          your personal information, we cannot guarantee its absolute security.
        </p>
      </Section>

      <Section id="data-retention" index="09" title="Data Retention">
        <p>
          We will retain your personal information only for as long as is necessary for the purposes
          set out in this Privacy Policy. We will retain and use your information to the extent
          necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
        </p>
      </Section>

      <Section id="third-party-services" index="10" title="Third-Party Services">
        <p>
          We may employ third-party companies and services to facilitate our application, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 marker:text-primary">
          <li><strong>Google:</strong> For authentication and cloud infrastructure.</li>
          <li><strong>Razorpay:</strong> For secure payment and subscription processing.</li>
          <li><strong>Upstox / Zerodha:</strong> For broker integration features.</li>
          <li><strong>Vercel / AWS:</strong> For hosting and database infrastructure.</li>
        </ul>
      </Section>

      <Section id="your-rights" index="11" title="Your Rights">
        <p>
          Depending on your location, you may have certain rights regarding your personal information,
          such as the right to access, update, or delete the information we have on you. To exercise
          these rights, please contact our support team.
        </p>
      </Section>

      <Section id="changes-to-policy" index="12" title="Changes to This Policy">
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </Section>

      <Section id="contact" index="13" title="Contact">
        <p>
          If you have any questions about this Privacy Policy, please contact us:
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
