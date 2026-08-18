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

const isMissing = (value) => value === null || value === undefined || Number.isNaN(value);

/**
 * Map a derived KPI value to its 0-100 sub-score using the configured bands.
 *
 * An uncomputable value (`null`) is resolved by the indicator's `nullPolicy`
 * rather than being treated as the worst case for every indicator: a business
 * with no current liabilities is maximally liquid, not maximally illiquid.
 * `"exclude"` returns `null`, signalling to `computeBHS` that the indicator
 * must be dropped and the remaining weights renormalised.
 */
export function scoreKpi(def, value) {
  const lowest = def.bands[def.bands.length - 1].score;
  const highest = def.bands[0].score;

  if (isMissing(value)) {
    if (def.nullPolicy === "best") return highest;
    if (def.nullPolicy === "exclude") return null;
    return lowest;
  }

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
  if (score === null) return "neutral";
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
 * Indicators whose `nullPolicy` is "exclude" and whose value could not be
 * computed are reported with a null score and left out of the weighted average;
 * the remaining weights renormalise, so a first-period business is not punished
 * for having no growth baseline.
 *
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
    const excluded = score === null;
    const color = colorFor(score);

    if (!excluded) {
      weightedTotal += score * def.weight;
      weightSum += def.weight;
    }

    kpis.push({
      key: def.key,
      label: def.label,
      unit: def.unit,
      weight: def.weight,
      value, // derived ratio (null if uncomputable)
      score, // 0-100 sub-score, or null when excluded
      color, // green | amber | red | neutral
      excluded, // true => not counted towards the composite
      // explains an uncomputable ratio to the user (null when it computed fine)
      note: isMissing(value) ? def.nullNote ?? null : null,
    });

    // An excluded indicator has not been judged, so it earns no recommendation.
    if (!excluded && color !== "green" && RECOMMENDATIONS[def.key]) {
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
