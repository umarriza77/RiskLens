import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChangeIndicator from "@/components/ChangeIndicator";
import { formatKpiValue } from "@/lib/format";

const ACCENT = {
  green: "border-l-green-500",
  amber: "border-l-amber-500",
  red: "border-l-red-500",
};

/**
 * Colour-coded KPI indicator card (green / amber / red) per spec.
 *
 * `change` is optional and comes from the progress endpoint's KPI comparison;
 * when present the card also shows the movement since the previous assessment.
 */
export default function KpiCard({ kpi, change }) {
  return (
    <Card className={`border-l-4 ${ACCENT[kpi.color] || "border-l-slate-300"}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-2xl font-semibold">{formatKpiValue(kpi)}</p>
          </div>
          <Badge variant={kpi.color}>{kpi.score}/100</Badge>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Weight: {kpi.weight}%</p>
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
