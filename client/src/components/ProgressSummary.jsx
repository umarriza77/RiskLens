import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangeIndicator from "@/components/ChangeIndicator";
import { RISK_STYLES, formatSignedNumber, formatSignedPercent, movementStyle } from "@/lib/format";

function Stat({ label, value, children }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold">
        <span className="tabular-nums">{value}</span>
        {children}
      </div>
    </div>
  );
}

/**
 * Headline "how far have we come" panel: the latest score, its movement since
 * the first assessment in range, and a plain-language verdict.
 */
export default function ProgressSummary({ summary }) {
  if (!summary) return null;

  const risk = RISK_STYLES[summary.latest.riskLevel] || RISK_STYLES.Moderate;
  const style = movementStyle(summary.movement);

  const verdict = !summary.comparable
    ? "Run a second assessment to start tracking how your business health changes over time."
    : summary.movement === "unchanged"
      ? `Your Business Health Score is unchanged since your first assessment (${summary.first.periodLabel}).`
      : `Your Business Health Score ${summary.movement === "improved" ? "increased" : "decreased"} by ${
          formatSignedPercent(summary.percent).replace(/^[+-]/, "")
        } (${formatSignedNumber(summary.absolute)} points) since your first assessment (${summary.first.periodLabel}).`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Overall progress</CardTitle>
        {summary.comparable && (
          <ChangeIndicator percent={summary.percent} absolute={summary.absolute} movement={summary.movement} />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Current BHS" value={summary.latest.bhs}>
            <Badge variant={risk.variant}>{risk.label}</Badge>
          </Stat>
          <Stat label={`First (${summary.first.periodLabel})`} value={summary.first.bhs} />
          <Stat label="Best" value={summary.best} />
          <Stat label="Assessments" value={summary.assessments} />
        </div>

        <p className="rounded-md border-l-4 p-3 text-sm" style={{ borderLeftColor: style.hex }}>
          {verdict}
        </p>
      </CardContent>
    </Card>
  );
}
