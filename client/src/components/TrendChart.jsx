import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatSignedNumber, formatSignedPercent, movementStyle } from "@/lib/format";

/**
 * Tooltip that reports not just the score but how it moved since the previous
 * assessment, so the trend line answers "am I improving?" at a glance.
 */
function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const style = movementStyle(point.change?.movement);

  return (
    <div className="rounded-md border bg-background p-3 text-sm shadow-sm">
      <p className="font-medium">{point.label}</p>
      <p className="tabular-nums">BHS: {point.bhs}</p>
      {point.riskLevel && <p className="text-muted-foreground">{point.riskLevel} risk</p>}
      {point.change && (
        <p className="tabular-nums" style={{ color: style.hex }}>
          {style.arrow} {formatSignedPercent(point.change.percent)} ({formatSignedNumber(point.change.absolute)} pts)
          {point.change.fromPeriodLabel ? ` vs ${point.change.fromPeriodLabel}` : ""}
        </p>
      )}
    </div>
  );
}

/**
 * Historical BHS trend line.
 * `data` = [{ periodLabel, bhs, createdAt, riskLevel?, change? }] — the extra
 * fields come from GET /api/history/progress and enrich the tooltip.
 */
export default function TrendChart({ data }) {
  const chartData = data.map((d) => ({
    label: d.periodLabel,
    bhs: d.bhs,
    riskLevel: d.riskLevel,
    change: d.change,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip content={<TrendTooltip />} />
        <ReferenceLine y={75} stroke="#16a34a" strokeDasharray="4 4" label={{ value: "Low risk", fontSize: 10, fill: "#16a34a" }} />
        <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="4 4" label={{ value: "Critical", fontSize: 10, fill: "#dc2626" }} />
        <Line type="monotone" dataKey="bhs" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
