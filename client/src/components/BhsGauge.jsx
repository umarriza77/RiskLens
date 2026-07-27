import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

const RISK_HEX = {
  Low: "#16a34a",
  Moderate: "#d97706",
  High: "#ea580c",
  Critical: "#dc2626",
};

/**
 * Radial gauge for the Business Health Score (0-100), colored by risk tier.
 */
export default function BhsGauge({ bhs, riskLevel }) {
  const color = RISK_HEX[riskLevel] || "#2563eb";
  const data = [{ name: "BHS", value: bhs, fill: color }];

  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="78%"
          outerRadius="100%"
          data={data}
          startAngle={220}
          endAngle={-40}
          barSize={18}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold" style={{ color }}>
          {Math.round(bhs)}
        </span>
        <span className="text-sm text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}
