/**
 * Progress service — turns a chronologically ordered list of BHS records into
 * a comparison view: how the score moved between assessments, how it moved
 * overall, and how each individual KPI changed since the previous assessment.
 *
 * Pure functions only (no Prisma) so the logic is unit-testable in isolation.
 */

import { KPI_DEFINITIONS } from "../config/bhsConfig.js";

const round = (n, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp;

const isNumber = (n) => typeof n === "number" && Number.isFinite(n);

/**
 * Percentage change from `previous` to `current`, rounded to 1 dp.
 *
 * Returns null when the change is undefined rather than zero — a missing value
 * or a zero baseline has no meaningful percentage (0 -> 5 is not "+500%"), so
 * callers should fall back to the absolute change in that case. The denominator
 * is the magnitude of the baseline, so a move from -5% to +2% reads as a gain.
 */
export function percentChange(previous, current) {
  if (!isNumber(previous) || !isNumber(current)) return null;
  if (previous === 0) return null;
  return round(((current - previous) / Math.abs(previous)) * 100, 1);
}

/**
 * Classify a movement as improved / declined / unchanged, honouring the KPI's
 * direction. For "lower is better" metrics such as the Expense Ratio a *fall*
 * is an improvement, which is why raw sign alone is not enough.
 */
export function movementOf(previous, current, direction = "higher") {
  if (!isNumber(previous) || !isNumber(current)) return "unknown";
  if (previous === current) return "unchanged";
  const rose = current > previous;
  const higherIsBetter = direction !== "lower";
  return rose === higherIsBetter ? "improved" : "declined";
}

/** Change descriptor shared by the BHS series and the KPI comparison. */
function changeBetween(previous, current, direction = "higher") {
  return {
    absolute: isNumber(previous) && isNumber(current) ? round(current - previous) : null,
    percent: percentChange(previous, current),
    movement: movementOf(previous, current, direction),
  };
}

/**
 * Annotate each record with its change relative to the preceding assessment.
 * The first record has `change: null` — there is nothing to compare it against.
 *
 * @param {Array} records ascending by date; each { id, periodLabel, createdAt,
 *   bhs, riskLevel, performanceBand, kpis }
 */
export function buildSeries(records) {
  return records.map((record, i) => {
    const prev = i > 0 ? records[i - 1] : null;
    return {
      id: record.id,
      periodLabel: record.periodLabel,
      createdAt: record.createdAt,
      bhs: record.bhs,
      riskLevel: record.riskLevel,
      performanceBand: record.performanceBand,
      change: prev
        ? {
            ...changeBetween(prev.bhs, record.bhs),
            fromPeriodLabel: prev.periodLabel,
            previousRiskLevel: prev.riskLevel,
            riskLevelChanged: prev.riskLevel !== record.riskLevel,
          }
        : null,
    };
  });
}

/**
 * Overall movement from the first assessment in the range to the latest, plus
 * the best/worst scores recorded. `comparable` is false when there is only one
 * assessment, so the UI can prompt for another rather than render a flat 0%.
 */
export function buildSummary(records) {
  if (records.length === 0) return null;

  const first = records[0];
  const latest = records[records.length - 1];
  const scores = records.map((r) => r.bhs);

  return {
    assessments: records.length,
    comparable: records.length > 1,
    first: { periodLabel: first.periodLabel, createdAt: first.createdAt, bhs: first.bhs, riskLevel: first.riskLevel },
    latest: {
      periodLabel: latest.periodLabel,
      createdAt: latest.createdAt,
      bhs: latest.bhs,
      riskLevel: latest.riskLevel,
      performanceBand: latest.performanceBand,
    },
    best: round(Math.max(...scores)),
    worst: round(Math.min(...scores)),
    ...changeBetween(first.bhs, latest.bhs),
  };
}

function kpiFrom(record, key) {
  return record?.kpis?.find((k) => k.key === key) ?? null;
}

/**
 * Side-by-side comparison of every KPI between the two most recent assessments.
 * Returns [] when there is nothing to compare against.
 *
 * Each row carries `direction` so the client can label an Expense Ratio drop as
 * an improvement instead of presenting a bare negative percentage.
 */
export function buildKpiComparison(previousRecord, latestRecord) {
  if (!previousRecord || !latestRecord) return [];

  return KPI_DEFINITIONS.map((def) => {
    const prev = kpiFrom(previousRecord, def.key);
    const curr = kpiFrom(latestRecord, def.key);
    const previousValue = isNumber(prev?.value) ? prev.value : null;
    const currentValue = isNumber(curr?.value) ? curr.value : null;

    return {
      key: def.key,
      label: def.label,
      unit: def.unit,
      weight: def.weight,
      direction: def.direction,
      previous: { value: previousValue, score: prev?.score ?? null },
      current: { value: currentValue, score: curr?.score ?? null, color: curr?.color ?? null },
      scoreChange:
        isNumber(prev?.score) && isNumber(curr?.score) ? round(curr.score - prev.score) : null,
      ...changeBetween(previousValue, currentValue, def.direction),
    };
  });
}

/**
 * Full progress payload for the history/dashboard views.
 *
 * @param {Array} records ascending by date
 * @returns {{ series:Array, summary:object|null, kpiComparison:Array }}
 */
export function buildProgress(records) {
  const ordered = [...records].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    series: buildSeries(ordered),
    summary: buildSummary(ordered),
    kpiComparison: buildKpiComparison(
      ordered[ordered.length - 2] ?? null,
      ordered.length > 1 ? ordered[ordered.length - 1] : null
    ),
  };
}
