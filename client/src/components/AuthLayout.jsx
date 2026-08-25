import { Radar, Gauge, ShieldAlert, TrendingUp } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Gauge,
    title: "One score, fully explained",
    body: "Five financial indicators become a single 0–100 Business Health Score you can trace back to your own figures.",
  },
  {
    icon: ShieldAlert,
    title: "Risk you can act on",
    body: "Every weak indicator produces a plain-language recommendation, not just a colour.",
  },
  {
    icon: TrendingUp,
    title: "Progress, not snapshots",
    body: "Each assessment is compared with the last, so you can see whether the business is actually improving.",
  },
];

/**
 * Shell for the unauthenticated screens. The form occupies the left column; on
 * large viewports a gradient brand panel fills the right half. The panel is
 * decorative and is hidden below `lg` so the form keeps full width on mobile.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form column */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Radar className="h-5 w-5 text-primary" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-semibold">RiskLens</span>
              <span className="text-xs text-muted-foreground">See Risks. Stay Ahead.</span>
            </span>
          </div>
          {children}
        </div>
      </div>

      {/* brand panel — decorative, large viewports only */}
      <div
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 lg:block"
      >
        {/* soft light sources */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-sky-400/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white xl:p-16">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur">
              <Radar className="h-6 w-6" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xl font-semibold tracking-tight">RiskLens</span>
              <span className="text-xs text-white/70">See Risks. Stay Ahead.</span>
            </span>
          </div>

          <div className="max-w-lg">
            <h2 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-[2.75rem]">
              Know how healthy your business really is.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              A business health and risk intelligence platform for small and medium enterprises.
              Enter your figures, get a score you can explain, and see exactly where to act.
            </p>

            <ul className="mt-10 space-y-6">
              {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-inset ring-white/20">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/70">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/60">
            {["Low", "Moderate", "High", "Critical"].map((tier, i) => (
              <span key={tier} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: ["#4ade80", "#fbbf24", "#fb923c", "#f87171"][i] }}
                />
                {tier}
              </span>
            ))}
            <span className="ml-1">risk classification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
