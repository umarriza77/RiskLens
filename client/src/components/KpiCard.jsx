import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChangeIndicator from "@/components/ChangeIndicator";
import { formatKpiValue } from "@/lib/format";

const ACCENT = {
  green: "border-l-green-500",
  amber: "border-l-amber-500",
  red: "border-l-red-500",
  neutral: "border-l-slate-300",
};

/**
 * Colour-coded KPI indicator card (green / amber / red) per spec.
 *
 * An indicator the engine could not compute and chose to exclude is rendered
 * grey with a "Not scored" badge and the reason, rather than as a bad score —
 * a business with no prior period has not earned a zero for growth.
 *
 * `change` is optional and comes from the progress endpoint's KPI comparison;
 * when present the card also shows the movement since the previous assessment.
 */
export default function KpiCard({ kpi, change }) {
  const excluded = kpi.excluded || kpi.score === null || kpi.score === undefined;

  return (
    <Card className={`border-l-4 ${ACCENT[kpi.color] || "border-l-slate-300"}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold">{formatKpiValue(kpi)}</p>
          </div>
          <Badge variant={excluded ? "neutral" : kpi.color}>
            {excluded ? "Not scored" : `${kpi.score}/100`}
          </Badge>
        </div>
        {kpi.note && <p className="mt-2 text-xs text-muted-foreground">{kpi.note}</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {excluded ? "Excluded from the score" : `Weight: ${kpi.weight}%`}
          </p>
          {change && (
            <ChangeIndicator percent={change.percent} absolute={change.absolute} movement={change.movement} />
          )}
        </div>
        {change && (
          <p className="mt-2 text-xs text-muted-foreground">
            Previous: {formatKpiValue({ value: change.previous.value, unit: kpi.unit })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
