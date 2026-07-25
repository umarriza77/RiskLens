import {
  KPI_DEFINITIONS,
  PERFORMANCE_BANDS,
  RISK_TIERS,
  COLOR_CUTOFFS,
  RECOMMENDATIONS,
} from "../config/bhsConfig.js";

/**
 * Safe division: returns null when the denominator is zero/invalid so callers
 * can treat the KPI as the worst case rather than producing Infinity/NaN.
 */
function safeDiv(numerator, denominator) {
  if (!denominator || denominator === 0 || Number.isNaN(denominator)) return null;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : null;
}

/**
 * Derive the five financial KPIs from raw figures.
 * A null value means the ratio could not be computed (e.g. zero revenue);
 * such KPIs are scored at the worst band.
 */
export function deriveKpis(f) {
  return {
    profitMargin: safeDiv(f.netIncome, f.revenue),
    currentRatio: safeDiv(f.currentAssets, f.currentLiabilities),
    roa: safeDiv(f.netIncome, f.totalAssets),
    expenseRatio: safeDiv(f.totalExpenses, f.revenue),
    revenueGrowth: safeDiv(f.revenue - f.previousRevenue, f.previousRevenue),
  };
}

/**
 * Map a derived KPI value to its 0-100 sub-score using the configured bands.
 * `null` (uncomputable) and missing matches fall to the lowest band score.
 */
export function scoreKpi(def, value) {
  const lowest = def.bands[def.bands.length - 1].score;
  if (value === null || value === undefined || Number.isNaN(value)) return lowest;

  for (const band of def.bands) {
    if (def.direction === "lower") {
      if (value <= band.max) return band.score;
    } else {
      if (value >= band.min) return band.score;
    }
  }
  return lowest;
}

function colorFor(score) {
  if (score >= COLOR_CUTOFFS.green) return "green";
  if (score >= COLOR_CUTOFFS.amber) return "amber";
  return "red";
}

function bandFor(bhs) {
  return PERFORMANCE_BANDS.find((b) => bhs >= b.min).label;
}

function riskFor(bhs) {
  return RISK_TIERS.find((t) => bhs >= t.min).level;
}

/**
 * Compute the composite Business Health Score and risk classification.
 *
 * @param {object} figures raw inputs: revenue, previousRevenue, netIncome,
 *   totalExpenses, currentAssets, currentLiabilities, totalAssets
 * @returns {{ bhs:number, riskLevel:string, performanceBand:string,
 *   kpis:Array, recommendations:string[] }}
 */
export function computeBHS(figures) {
  const derived = deriveKpis(figures);

  let weightedTotal = 0;
  let weightSum = 0;
  const kpis = [];
  const recommendations = [];

  for (const def of KPI_DEFINITIONS) {
    const value = derived[def.key];
    const score = scoreKpi(def, value);
    const color = colorFor(score);

    weightedTotal += score * def.weight;
    weightSum += def.weight;

    kpis.push({
      key: def.key,
      label: def.label,
      unit: def.unit,
      weight: def.weight,
      value, // derived ratio (null if uncomputable)
      score, // 0-100 sub-score
      color, // green | amber | red
    });

    if (color !== "green" && RECOMMENDATIONS[def.key]) {
      recommendations.push(RECOMMENDATIONS[def.key]);
    }
  }

  const bhs = weightSum > 0 ? Math.round((weightedTotal / weightSum) * 100) / 100 : 0;

  return {
    bhs,
    riskLevel: riskFor(bhs),
    performanceBand: bandFor(bhs),
    kpis,
    recommendations,
  };
}
