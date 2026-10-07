/**
 * Simplified, text-first diagrams built from HTML/CSS. Every node is real text
 * so the diagram is its own text equivalent, and colour never carries meaning
 * alone. Connections show functional relationships only, not network topology.
 */
import type { ReactNode } from "react";

function Figure({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-8 rounded-2xl border border-line bg-card p-4 sm:p-6">
      <p className="label mb-4">{title}</p>
      {children}
      {caption && <figcaption className="mt-4 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

function Node({
  children,
  sub,
  tone = "default",
}: {
  children: ReactNode;
  sub?: string;
  tone?: "default" | "strong" | "exception";
}) {
  const tones = {
    default: "border-line bg-page",
    strong: "border-accent bg-[#e6f0ec]",
    exception: "border-dashed border-warn bg-[#fbf3e8]",
  };
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm leading-snug ${tones[tone]}`}>
      <p className="font-semibold">{children}</p>
      {sub && <p className="mt-1 text-muted">{sub}</p>}
    </div>
  );
}

/** Points down on narrow screens and right on wide ones. */
function Arrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex select-none items-center justify-center text-xl text-accent ${
        vertical ? "py-1" : "py-1 md:px-2 md:py-0"
      }`}
    >
      <span className={vertical ? "" : "md:hidden"}>↓</span>
      {!vertical && <span className="hidden md:inline">→</span>}
    </span>
  );
}

function Sequence({ steps }: { steps: { label: string; sub?: string; tone?: "default" | "strong" | "exception" }[] }) {
  return (
    <ol className="flex flex-col md:flex-row md:items-stretch">
      {steps.map((s, i) => (
        <li key={s.label} className="flex flex-col md:flex-1 md:flex-row">
          <div className="md:flex-1">
            <Node sub={s.sub} tone={s.tone}>
              <span className="sr-only">Step {i + 1}: </span>
              {s.label}
            </Node>
          </div>
          {i < steps.length - 1 && <Arrow />}
        </li>
      ))}
    </ol>
  );
}

function Group({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return (
    <section className="rounded-xl border border-line p-3 sm:p-4">
      <h4 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted">{title}</h4>
      <div className="grid gap-2">{children}</div>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </section>
  );
}

/* ---------- Deliverit ---------- */

export function DeliveritArchitecture() {
  return (
    <Figure
      title="Simplified architecture"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <Group title="Customer clients">
          <Node sub="Customer and driver workflows">Flutter mobile app</Node>
          <Node>React customer web app</Node>
        </Group>
        <Group title="Administration">
          <Node>Vue.js administration app</Node>
        </Group>
      </div>
      <Arrow vertical />
      <Group title="Backend services">
        <div className="grid gap-2 md:grid-cols-2">
          <Node sub="Node.js · TypeScript · Express">Customer-facing service</Node>
          <Node sub="Node.js · TypeScript · Express">Administrative service</Node>
        </div>
      </Group>
      <Arrow vertical />
      <div className="grid gap-2 md:grid-cols-2">
        <Group title="Persistence and jobs">
          <Node>MySQL</Node>
          <Node sub="Queues, background workers, caching">Redis · BullMQ</Node>
        </Group>
        <Group title="External integrations">
          <div className="grid gap-2 sm:grid-cols-2">
            <Node>Stripe</Node>
            <Node>Firebase</Node>
            <Node>Google Maps</Node>
            <Node>Track-POD</Node>
          </div>
        </Group>
      </div>
      <div className="mt-2">
        <Group
          title="Commerce extension"
          note="Implemented as an extension to the delivery platform; later discontinued."
        >
          <Node>Next.js commerce storefront</Node>
        </Group>
      </div>
    </Figure>
  );
}

export function CostComparison() {
  return (
    <Figure
      title="Approximate monthly Google API cost (USD, historical)"
      caption="Monthly Google Maps and Places costs before and after optimization."
    >
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm font-medium">
            <span>Before</span>
            <span>≈ $300 / month</span>
          </div>
          <div className="h-8 w-full rounded bg-[#9aa8a2]" aria-hidden="true" />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm font-medium">
            <span>After</span>
            <span>≈ $36 / month</span>
          </div>
          <div className="h-8 rounded bg-accent" style={{ width: "12%" }} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold">Approximately 88% lower monthly API cost.</p>
      <p className="sr-only">
        Monthly Google API costs fell from approximately $300 to $36, an 88% reduction.
      </p>
    </Figure>
  );
}

export function PaymentFlow() {
  return (
    <Figure
      title="Payment lifecycle"
    >
      <ol className="flex flex-col md:flex-row md:items-center">
        <li className="md:flex-1">
          <Node>Checkout</Node>
        </li>
        <li aria-hidden="true">
          <Arrow />
        </li>
        <li className="md:flex-1">
          <Node tone="strong">Authorized</Node>
        </li>
        <li aria-hidden="true">
          <Arrow />
        </li>
        <li className="md:flex-[2]">
          <ul className="grid gap-3">
            <li>
              <p className="label mb-1">If delivery is completed</p>
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:flex-1">
                  <Node>Delivery completed</Node>
                </div>
                <Arrow />
                <div className="md:flex-1">
                  <Node tone="strong">Capture payment</Node>
                </div>
              </div>
              <div className="mt-2">
                <Node tone="exception">Exception: capture failed</Node>
              </div>
            </li>
            <li>
              <p className="label mb-1">If cancelled before capture</p>
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:flex-1">
                  <Node>Cancelled before capture</Node>
                </div>
                <Arrow />
                <div className="md:flex-1">
                  <Node tone="strong">Cancel authorization</Node>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ol>
    </Figure>
  );
}

export function OtpControls() {
  return (
    <Figure title="OTP protection">
      <Sequence
        steps={[
          { label: "Firebase App Check" },
          { label: "Request validation" },
          { label: "Rate limiting" },
          { label: "OTP provider", tone: "strong" },
        ]}
      />
    </Figure>
  );
}

/* ---------- Multi-tenant SaaS ---------- */

export function TenantProvisioning() {
  return (
    <Figure
      title="Tenant provisioning"
    >
      <Sequence
        steps={[
          { label: "Merchant registration" },
          { label: "Tenant and database setup" },
          { label: "Migrations, defaults and administrator" },
          { label: "Store available", tone: "strong" },
        ]}
      />
      <div className="mt-3">
        <Node tone="exception" sub="Problems during setup are logged so they can be investigated">
          Failure branch: provisioning failure logged
        </Node>
      </div>
    </Figure>
  );
}

export function DomainWorkflow() {
  return (
    <Figure
      title="Domain onboarding"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Node sub="Registration, zone creation and nameserver changes">Path A: Purchase a domain</Node>
        <Node sub="Merchant changes nameservers; the platform checks when Cloudflare is authoritative">
          Path B: Connect an existing domain
        </Node>
      </div>
      <Arrow vertical />
      <Sequence
        steps={[
          { label: "DNS records and tenant mapping", sub: "Readiness is checked asynchronously" },
          { label: "SSL provisioning", sub: "Readiness is checked asynchronously" },
          { label: "Store domain active", tone: "strong" },
        ]}
      />
    </Figure>
  );
}

export function BillingSync() {
  return (
    <Figure
      title="Billing and entitlements"
    >
      <Sequence
        steps={[
          { label: "Stripe billing events" },
          { label: "Subscription-state synchronization" },
          { label: "Merchant entitlements", tone: "strong" },
        ]}
      />
    </Figure>
  );
}

/* ---------- VPN ---------- */

export function VpnProvisioning() {
  return (
    <Figure
      title="Server provisioning"
    >
      <Sequence
        steps={[
          { label: "New server" },
          { label: "OpenVPN and configuration", sub: "Installation, certificates, user setup" },
          { label: "Network and firewall setup", sub: "Firewall rules, routing/NAT, ports" },
          { label: "Register node with the platform", tone: "strong" },
        ]}
      />
    </Figure>
  );
}
