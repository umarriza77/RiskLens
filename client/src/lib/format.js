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

/**
 * Presentation for a progress movement. The backend already accounts for
 * direction, so a falling Expense Ratio arrives here as "improved" and is shown
 * in green even though its percentage change is negative.
 */
export const MOVEMENT_STYLES = {
  improved: { variant: "green", label: "Improved", arrow: "▲", hex: "#16a34a" },
  declined: { variant: "red", label: "Declined", arrow: "▼", hex: "#dc2626" },
  unchanged: { variant: "secondary", label: "No change", arrow: "→", hex: "#64748b" },
  unknown: { variant: "outline", label: "Not comparable", arrow: "–", hex: "#94a3b8" },
};

export function movementStyle(movement) {
  return MOVEMENT_STYLES[movement] || MOVEMENT_STYLES.unknown;
}

/** "+8.8%" / "-25.0%" / "—" when the change is undefined. */
export function formatSignedPercent(percent) {
  if (typeof percent !== "number" || Number.isNaN(percent)) return "—";
  return `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
}

/** "+13" / "-4.5" / "—" — used for BHS point changes. */
export function formatSignedNumber(value, dp = 1) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  const trimmed = Number(value.toFixed(dp));
  return `${trimmed > 0 ? "+" : ""}${trimmed}`;
}
