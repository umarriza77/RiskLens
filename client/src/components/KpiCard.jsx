import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatKpiValue } from "@/lib/format";

const ACCENT = {
  green: "border-l-green-500",
  amber: "border-l-amber-500",
  red: "border-l-red-500",
};

/**
 * Colour-coded KPI indicator card (green / amber / red) per spec.
 */
export default function KpiCard({ kpi }) {
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
        <p className="mt-3 text-xs text-muted-foreground">Weight: {kpi.weight}%</p>
      </CardContent>
    </Card>
  );
}
