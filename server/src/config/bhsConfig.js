/**
 * BHS configuration — single source of truth for the rule-based scoring engine.
 *
 * Each KPI maps a derived value to a 0-100 sub-score via benchmark bands.
 * The composite BHS is the weighted sum of sub-scores. Thresholds are grounded
 * in standard SME financial benchmarks and are intended to be tunable
 * (per the project's Sprint 5 "empirical tuning" note).
 */

// direction: "higher" => larger value is healthier; "lower" => smaller value is healthier
//
// nullPolicy decides what an *uncomputable* ratio means for this indicator. A
// ratio is uncomputable when its denominator is zero, and that does not always
// mean "unhealthy":
//   "best"    the zero denominator is itself the healthiest state
//             (no current liabilities => nothing short-term to cover)
//   "exclude" the indicator is not measurable for this business, so it is
//             dropped and the remaining weights are renormalised
//             (no prior period => growth has no baseline)
//   "worst"   the zero denominator genuinely signals distress
//             (no revenue => cannot be profitable, cannot cover costs)
export const KPI_DEFINITIONS = [
  {
    key: "profitMargin",
    label: "Net Profit Margin",
    unit: "percent",
    weight: 25,
    direction: "higher",
    nullPolicy: "worst",
    nullNote: "No revenue recorded for this period, so the business cannot be profitable.",
    // bands evaluated top-down; first match wins. value is the derived ratio (e.g. 0.2 = 20%).
    bands: [
      { min: 0.2, score: 100 },
      { min: 0.1, score: 80 },
      { min: 0.05, score: 60 },
      { min: 0.0, score: 40 },
      { min: -Infinity, score: 10 },
    ],
  },
  {
    key: "currentRatio",
    label: "Current Ratio",
    unit: "ratio",
    weight: 20,
    direction: "higher",
    nullPolicy: "best",
    nullNote: "No current liabilities — nothing short-term to cover, so liquidity is treated as ideal.",
    bands: [
      { min: 2.0, score: 100 },
      { min: 1.5, score: 80 },
      { min: 1.0, score: 60 },
      { min: 0.5, score: 40 },
      { min: -Infinity, score: 10 },
    ],
  },
  {
    key: "roa",
    label: "Return on Assets",
    unit: "percent",
    weight: 20,
    direction: "higher",
    nullPolicy: "exclude",
    nullNote: "No total assets recorded, so return on assets is not measurable for this period.",
    bands: [
      { min: 0.15, score: 100 },
      { min: 0.08, score: 80 },
      { min: 0.03, score: 60 },
      { min: 0.0, score: 40 },
      { min: -Infinity, score: 10 },
    ],
  },
  {
    key: "expenseRatio",
    label: "Expense Ratio",
    unit: "percent",
    weight: 20,
    direction: "lower",
    nullPolicy: "worst",
    nullNote: "No revenue recorded for this period, so operating costs are not covered.",
    // for "lower is better" we use `max` thresholds; first match wins top-down.
    bands: [
      { max: 0.6, score: 100 },
      { max: 0.75, score: 80 },
      { max: 0.9, score: 60 },
      { max: 1.0, score: 40 },
      { max: Infinity, score: 10 },
    ],
  },
  {
    key: "revenueGrowth",
    label: "Revenue Growth Rate",
    unit: "percent",
    weight: 15,
    direction: "higher",
    nullPolicy: "exclude",
    nullNote: "No prior period to compare against, so growth is excluded from this score.",
    bands: [
      { min: 0.15, score: 100 },
      { min: 0.05, score: 80 },
      { min: 0.0, score: 60 },
      { min: -0.1, score: 40 },
      { min: -Infinity, score: 10 },
    ],
  },
];

// BHS -> overall performance band
export const PERFORMANCE_BANDS = [
  { min: 80, label: "Excellent" },
  { min: 65, label: "Good" },
  { min: 50, label: "Fair" },
  { min: 0, label: "Poor" },
];

// BHS -> risk tier
export const RISK_TIERS = [
  { min: 75, level: "Low" },
  { min: 60, level: "Moderate" },
  { min: 40, level: "High" },
  { min: 0, level: "Critical" },
];

// per-KPI sub-score -> color
export const COLOR_CUTOFFS = { green: 80, amber: 40 }; // >=80 green, >=40 amber, else red

// plain-language recommendations emitted for amber/red KPIs
export const RECOMMENDATIONS = {
  profitMargin:
    "Profitability is low. Review pricing, reduce non-essential costs, and focus on higher-margin products or services.",
  currentRatio:
    "Liquidity is tight. Improve cash reserves, manage receivables faster, and avoid over-committing short-term liabilities.",
  roa:
    "Assets are not generating enough return. Improve asset utilisation or divest underperforming assets.",
  expenseRatio:
    "Expenses are high relative to revenue. Audit operating costs and renegotiate supplier or overhead expenses.",
  revenueGrowth:
    "Revenue growth is weak or negative. Strengthen sales, expand your customer base, and review market positioning.",
};

export const RISK_DESCRIPTIONS = {
  Low: "Your business is financially healthy. Maintain current practices and keep monitoring.",
  Moderate: "Some indicators need attention. Address the flagged areas before they escalate.",
  High: "Several indicators are weak. Take corrective action soon to avoid financial stress.",
  Critical: "Your business shows signs of serious financial distress. Immediate action is strongly advised.",
};
