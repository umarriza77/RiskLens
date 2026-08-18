import { Link } from "react-router-dom";
import {
  ArrowRight,
  PlusCircle,
  LayoutDashboard,
  Gauge,
  ShieldAlert,
  ListChecks,
  TrendingUp,
  FileText,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Descriptive copy for the landing page. The authoritative definitions of the
 * weights and risk thresholds live in server/src/config/bhsConfig.js; these
 * values mirror them for explanation only and are never used in a calculation.
 */
const INDICATORS = [
  { label: "Net Profit Margin", weight: 25, measures: "How much of each ringgit of revenue you keep" },
  { label: "Current Ratio", weight: 20, measures: "Whether short-term assets cover short-term debts" },
  { label: "Return on Assets", weight: 20, measures: "How hard the assets you own are working" },
  { label: "Expense Ratio", weight: 20, measures: "How much of your revenue is consumed by costs" },
  { label: "Revenue Growth Rate", weight: 15, measures: "Whether sales are moving up or down" },
];

const TIERS = [
  { level: "Low", range: "75 – 100", hex: "#16a34a", note: "Healthy. Keep monitoring." },
  { level: "Moderate", range: "60 – 74", hex: "#d97706", note: "Some indicators need attention." },
  { level: "High", range: "40 – 59", hex: "#ea580c", note: "Act soon to avoid financial stress." },
  { level: "Critical", range: "0 – 39", hex: "#dc2626", note: "Signs of serious distress." },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "Business Health Score",
    body: "Eight figures become five financial ratios, each scored against an SME benchmark and combined into one weighted score out of 100.",
  },
  {
    icon: ShieldAlert,
    title: "Four-tier risk classification",
    body: "Every score maps to Low, Moderate, High or Critical risk, with a performance band and a plain-language verdict.",
  },
  {
    icon: ListChecks,
    title: "Recommendations that name the problem",
    body: "Each indicator that falls short produces a specific action, so a healthy business still learns where it is weakest.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    body: "Each assessment is compared with the previous one and with your first, including whether your risk tier itself has changed.",
  },
  {
    icon: FileText,
    title: "Exportable PDF reports",
    body: "Download any assessment as a formatted report with the full indicator breakdown and recommendations.",
  },
  {
    icon: Lock,
    title: "Your data, only yours",
    body: "Every record is scoped to your account and ownership is re-checked on every read. Passwords are hashed, never stored.",
  },
];

const STEPS = [
  { n: 1, title: "Enter your figures", body: "Eight numbers from your accounts for the period: revenue, previous revenue, net income, expenses, current assets, current liabilities and total assets." },
  { n: 2, title: "The engine derives five ratios", body: "Profitability, liquidity, asset efficiency, cost control and growth — one indicator per perspective rather than a single headline number." },
  { n: 3, title: "Each ratio is scored and weighted", body: "Every ratio is matched to a benchmark band worth 0–100, then weighted into the composite score and classified into a risk tier." },
  { n: 4, title: "Act, then measure again", body: "Work on the flagged indicators, submit the next period, and the system shows you whether it actually moved." },
];

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">{title}</h2>
      {children && <p className="mt-3 text-muted-foreground">{children}</p>}
    </div>
  );
}

/**
 * Landing page shown immediately after sign-in and reachable from the logo.
 * It explains what the system does and how the score is produced before the
 * user navigates to the dashboard, so the score is never the first thing a new
 * user meets without context.
 */
export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-20 pb-8">
      {/* hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-6 py-16 text-white sm:px-12 sm:py-20">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative max-w-3xl">
          {user?.businessName && (
            <p className="text-sm font-medium text-white/70">Welcome back, {user.businessName}</p>
          )}
          <h1 className="mt-3 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
            See risks. Stay ahead.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            RiskLens turns the figures you already have into a Business Health Score you can explain —
            with a risk level, the specific indicators dragging it down, and a record of whether things
            are getting better.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/input">
                <PlusCircle className="h-4 w-4" /> Run an assessment
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" /> Open dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* features */}
      <section>
        <SectionHeading eyebrow="What it does" title="Everything the system gives you">
          Six capabilities, all built on one deterministic scoring engine.
        </SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="group transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section>
        <SectionHeading eyebrow="How it works" title="From your accounts to an action, in four steps" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.n} className="relative overflow-hidden">
              <CardContent className="pt-6">
                <span className="text-5xl font-bold leading-none text-primary/15">
                  {String(step.n).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* indicators + tiers */}
      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">The five indicators</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Each is scored 0–100 against an SME benchmark, then weighted into the composite.
            </p>
            <ul className="mt-6 space-y-4">
              {INDICATORS.map((ind) => (
                <li key={ind.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium">{ind.label}</span>
                    <span className="tabular-nums text-sm font-semibold text-primary">{ind.weight}%</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{ind.measures}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${(ind.weight / 25) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">How risk is classified</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The composite score maps to one of four tiers.
            </p>
            <ul className="mt-6 space-y-4">
              {TIERS.map((tier) => (
                <li key={tier.level} className="flex gap-3">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: tier.hex }}
                  />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{tier.level}</span>
                      <span className="tabular-nums text-xs text-muted-foreground">{tier.range}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-md bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
              The same figures always produce the same score. Nothing is estimated or predicted — every
              number can be traced back through a documented band to your own inputs.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* closing CTA */}
      <section className="rounded-2xl border bg-card px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-bold tracking-tight">Ready to check your health score?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          One period of figures takes a couple of minutes. Add a second period and the system starts
          tracking whether you are improving.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/input">
              Run an assessment <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/history">View history</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
