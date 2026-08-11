import {
  percentChange,
  movementOf,
  buildSeries,
  buildSummary,
  buildKpiComparison,
  buildProgress,
} from "../src/services/progressService.js";

/** Build a record shaped like the one the history controller normalises. */
function record({ id, periodLabel, createdAt, bhs, riskLevel = "Moderate", performanceBand = "Good", kpis = [] }) {
  return { id, periodLabel, createdAt, bhs, riskLevel, performanceBand, kpis };
}

const kpi = (key, value, score, unit = "percent") => ({ key, label: key, unit, value, score });

// The worked example from the spec: 1 Aug -> 8 Aug -> 1 Sep.
const AUG_1 = record({ id: 1, periodLabel: "Aug W1", createdAt: "2025-08-01", bhs: 68, riskLevel: "Moderate" });
const AUG_8 = record({ id: 2, periodLabel: "Aug W2", createdAt: "2025-08-08", bhs: 74, riskLevel: "Moderate" });
const SEP_1 = record({ id: 3, periodLabel: "Sep W1", createdAt: "2025-09-01", bhs: 81, riskLevel: "Low", performanceBand: "Excellent" });

describe("percentChange", () => {
  test("computes the change to one decimal place", () => {
    expect(percentChange(68, 74)).toBe(8.8);
    expect(percentChange(74, 81)).toBe(9.5);
    expect(percentChange(68, 81)).toBe(19.1);
  });

  test("is negative when the value falls", () => {
    expect(percentChange(0.08, 0.06)).toBe(-25);
  });

  test("measures against the magnitude of the baseline, so a loss turning into a profit reads positive", () => {
    expect(percentChange(-0.05, 0.02)).toBe(140);
  });

  test("returns null when the change is undefined rather than zero", () => {
    expect(percentChange(0, 5)).toBeNull();
    expect(percentChange(null, 5)).toBeNull();
    expect(percentChange(5, null)).toBeNull();
    expect(percentChange(undefined, undefined)).toBeNull();
  });
});

describe("movementOf", () => {
  test("treats a rise as an improvement for higher-is-better metrics", () => {
    expect(movementOf(0.12, 0.16, "higher")).toBe("improved");
    expect(movementOf(0.08, 0.06, "higher")).toBe("declined");
  });

  test("treats a fall as an improvement for lower-is-better metrics", () => {
    expect(movementOf(0.75, 0.68, "lower")).toBe("improved");
    expect(movementOf(0.68, 0.75, "lower")).toBe("declined");
  });

  test("reports unchanged and unknown", () => {
    expect(movementOf(50, 50)).toBe("unchanged");
    expect(movementOf(null, 50)).toBe("unknown");
  });
});

describe("buildSeries", () => {
  test("annotates every record after the first with its change", () => {
    const series = buildSeries([AUG_1, AUG_8, SEP_1]);

    expect(series[0].change).toBeNull();
    expect(series[1].change).toMatchObject({
      absolute: 6,
      percent: 8.8,
      movement: "improved",
      fromPeriodLabel: "Aug W1",
      riskLevelChanged: false,
    });
    expect(series[2].change).toMatchObject({
      absolute: 7,
      percent: 9.5,
      movement: "improved",
      previousRiskLevel: "Moderate",
      riskLevelChanged: true,
    });
  });

  test("carries the display fields through", () => {
    const [first] = buildSeries([AUG_1]);
    expect(first).toMatchObject({ id: 1, periodLabel: "Aug W1", bhs: 68, riskLevel: "Moderate" });
  });

  test("returns an empty series for no records", () => {
    expect(buildSeries([])).toEqual([]);
  });
});

describe("buildSummary", () => {
  test("compares the latest assessment against the first", () => {
    const summary = buildSummary([AUG_1, AUG_8, SEP_1]);

    expect(summary).toMatchObject({
      assessments: 3,
      comparable: true,
      absolute: 13,
      percent: 19.1,
      movement: "improved",
      best: 81,
      worst: 68,
    });
    expect(summary.first.bhs).toBe(68);
    expect(summary.latest).toMatchObject({ bhs: 81, riskLevel: "Low", performanceBand: "Excellent" });
  });

  test("marks a single assessment as not comparable", () => {
    const summary = buildSummary([AUG_1]);
    expect(summary.comparable).toBe(false);
    expect(summary.absolute).toBe(0);
    expect(summary.movement).toBe("unchanged");
  });

  test("returns null when there are no records", () => {
    expect(buildSummary([])).toBeNull();
  });
});

describe("buildKpiComparison", () => {
  const previous = record({
    id: 1,
    periodLabel: "Aug",
    createdAt: "2025-08-01",
    bhs: 68,
    kpis: [
      kpi("profitMargin", 0.12, 80),
      kpi("currentRatio", 1.4, 60, "ratio"),
      kpi("roa", 0.08, 80),
      kpi("expenseRatio", 0.75, 80),
      kpi("revenueGrowth", 0.05, 80),
    ],
  });
  const latest = record({
    id: 2,
    periodLabel: "Sep",
    createdAt: "2025-09-01",
    bhs: 81,
    kpis: [
      kpi("profitMargin", 0.16, 80),
      kpi("currentRatio", 1.7, 80, "ratio"),
      kpi("roa", 0.06, 60),
      kpi("expenseRatio", 0.68, 80),
      kpi("revenueGrowth", 0.09, 80),
    ],
  });

  const rows = buildKpiComparison(previous, latest);
  const row = (key) => rows.find((r) => r.key === key);

  test("returns one row per configured KPI", () => {
    expect(rows.map((r) => r.key)).toEqual([
      "profitMargin",
      "currentRatio",
      "roa",
      "expenseRatio",
      "revenueGrowth",
    ]);
  });

  test("computes the percentage change for each KPI", () => {
    expect(row("profitMargin")).toMatchObject({ percent: 33.3, movement: "improved" });
    expect(row("currentRatio")).toMatchObject({ percent: 21.4, movement: "improved" });
    expect(row("roa")).toMatchObject({ percent: -25, movement: "declined" });
    expect(row("revenueGrowth")).toMatchObject({ percent: 80, movement: "improved" });
  });

  test("calls a falling expense ratio an improvement", () => {
    expect(row("expenseRatio")).toMatchObject({
      direction: "lower",
      percent: -9.3,
      movement: "improved",
    });
  });

  test("carries previous and current values plus the score delta", () => {
    expect(row("roa")).toMatchObject({
      previous: { value: 0.08, score: 80 },
      current: { value: 0.06, score: 60 },
      scoreChange: -20,
    });
  });

  test("handles a KPI that could not be computed", () => {
    const withNull = record({ id: 3, periodLabel: "Oct", createdAt: "2025-10-01", bhs: 40, kpis: [kpi("profitMargin", null, 10)] });
    const [profit] = buildKpiComparison(previous, withNull);
    expect(profit).toMatchObject({ percent: null, absolute: null, movement: "unknown" });
    expect(profit.current.value).toBeNull();
  });

  test("returns nothing when there is no baseline", () => {
    expect(buildKpiComparison(null, latest)).toEqual([]);
  });
});

describe("buildProgress", () => {
  test("assembles series, summary, and KPI comparison", () => {
    const progress = buildProgress([AUG_1, AUG_8, SEP_1]);
    expect(progress.series).toHaveLength(3);
    expect(progress.summary.percent).toBe(19.1);
    expect(progress.kpiComparison).toHaveLength(5);
  });

  test("orders records chronologically regardless of input order", () => {
    const progress = buildProgress([SEP_1, AUG_1, AUG_8]);
    expect(progress.series.map((s) => s.bhs)).toEqual([68, 74, 81]);
    expect(progress.summary.latest.bhs).toBe(81);
  });

  test("omits the KPI comparison until there are two assessments", () => {
    const progress = buildProgress([AUG_1]);
    expect(progress.kpiComparison).toEqual([]);
    expect(progress.summary.comparable).toBe(false);
  });

  test("handles an empty history", () => {
    expect(buildProgress([])).toEqual({ series: [], summary: null, kpiComparison: [] });
  });
});
