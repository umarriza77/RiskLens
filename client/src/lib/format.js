export function formatKpiValue(kpi) {
  if (kpi.value === null || kpi.value === undefined) return "N/A";
  return kpi.unit === "percent" ? `${(kpi.value * 100).toFixed(1)}%` : kpi.value.toFixed(2);
}

export const RISK_STYLES = {
  Low: { variant: "green", label: "Low Risk" },
  Moderate: { variant: "amber", label: "Moderate Risk" },
  High: { variant: "red", label: "High Risk" },
  Critical: { variant: "red", label: "Critical Risk" },
};

export const COLOR_HEX = {
  green: "#16a34a",
  amber: "#d97706",
  red: "#dc2626",
};
