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

/**
 * Historical BHS trend line. `data` = [{ periodLabel, bhs, createdAt }]
 */
export default function TrendChart({ data }) {
  const chartData = data.map((d) => ({
    label: d.periodLabel,
    bhs: d.bhs,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <ReferenceLine y={75} stroke="#16a34a" strokeDasharray="4 4" label={{ value: "Low risk", fontSize: 10, fill: "#16a34a" }} />
        <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="4 4" label={{ value: "Critical", fontSize: 10, fill: "#dc2626" }} />
        <Line type="monotone" dataKey="bhs" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
