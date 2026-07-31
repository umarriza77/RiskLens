import { computeBHS, deriveKpis, scoreKpi } from "../src/services/bhsEngine.js";
import { KPI_DEFINITIONS } from "../src/config/bhsConfig.js";

const def = (key) => KPI_DEFINITIONS.find((d) => d.key === key);

describe("deriveKpis", () => {
  test("computes the five financial ratios", () => {
    const k = deriveKpis({
      revenue: 1000,
      previousRevenue: 800,
      netIncome: 200,
      totalExpenses: 600,
      currentAssets: 400,
      currentLiabilities: 200,
      totalAssets: 1000,
    });
    expect(k.profitMargin).toBeCloseTo(0.2);
    expect(k.currentRatio).toBeCloseTo(2.0);
    expect(k.roa).toBeCloseTo(0.2);
    expect(k.expenseRatio).toBeCloseTo(0.6);
    expect(k.revenueGrowth).toBeCloseTo(0.25);
  });

  test("guards against division by zero (returns null)", () => {
    const k = deriveKpis({
      revenue: 0,
      previousRevenue: 0,
      netIncome: 0,
      totalExpenses: 0,
      currentAssets: 100,
      currentLiabilities: 0,
      totalAssets: 0,
    });
    expect(k.profitMargin).toBeNull();
    expect(k.roa).toBeNull();
    expect(k.expenseRatio).toBeNull();
    expect(k.currentRatio).toBeNull();
    expect(k.revenueGrowth).toBeNull();
  });
});

describe("scoreKpi", () => {
  test("higher-is-better band boundaries (profit margin)", () => {
    const d = def("profitMargin");
    expect(scoreKpi(d, 0.2)).toBe(100); // >= 20%
    expect(scoreKpi(d, 0.1)).toBe(80); // >= 10%
    expect(scoreKpi(d, 0.05)).toBe(60); // >= 5%
    expect(scoreKpi(d, 0.0)).toBe(40); // >= 0%
    expect(scoreKpi(d, -0.01)).toBe(10); // loss
  });

  test("lower-is-better band boundaries (expense ratio)", () => {
    const d = def("expenseRatio");
    expect(scoreKpi(d, 0.6)).toBe(100); // <= 60%
    expect(scoreKpi(d, 0.75)).toBe(80);
    expect(scoreKpi(d, 0.9)).toBe(60);
    expect(scoreKpi(d, 1.0)).toBe(40);
    expect(scoreKpi(d, 1.1)).toBe(10); // spending more than earning
  });

  test("null value scores at the worst band", () => {
    expect(scoreKpi(def("currentRatio"), null)).toBe(10);
  });
});

describe("computeBHS", () => {
  test("a strong business scores high with Low risk", () => {
    const r = computeBHS({
      revenue: 1000,
      previousRevenue: 800,
      netIncome: 250,
      totalExpenses: 550,
      currentAssets: 500,
      currentLiabilities: 200,
      totalAssets: 1200,
    });
    // profitMargin .25->100, currentRatio 2.5->100, roa .208->100,
    // expenseRatio .55->100, revenueGrowth .25->100 => 100
    expect(r.bhs).toBe(100);
    expect(r.riskLevel).toBe("Low");
    expect(r.performanceBand).toBe("Excellent");
    expect(r.recommendations).toHaveLength(0);
  });

  test("a distressed business scores low with Critical risk and recommendations", () => {
    const r = computeBHS({
      revenue: 1000,
      previousRevenue: 1500,
      netIncome: -100,
      totalExpenses: 1100,
      currentAssets: 100,
      currentLiabilities: 400,
      totalAssets: 2000,
    });
    // all KPIs land in worst bands -> bhs 10
    expect(r.bhs).toBeLessThan(40);
    expect(r.riskLevel).toBe("Critical");
    expect(r.performanceBand).toBe("Poor");
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  test("weighted composite matches a hand-computed benchmark", () => {
    // profitMargin 12% ->80 (w25), currentRatio 1.6 ->80 (w20),
    // roa 10% ->80 (w20), expenseRatio 70% ->80 (w20), revenueGrowth 8% ->80 (w15)
    // all 80 => bhs 80
    const r = computeBHS({
      revenue: 1000,
      previousRevenue: 925.93, // ~8% growth
      netIncome: 120,
      totalExpenses: 700,
      currentAssets: 1600,
      currentLiabilities: 1000,
      totalAssets: 1200,
    });
    expect(r.bhs).toBe(80);
    expect(r.riskLevel).toBe("Low");
  });

  test("kpis carry per-indicator color and score", () => {
    const r = computeBHS({
      revenue: 1000,
      previousRevenue: 800,
      netIncome: 250,
      totalExpenses: 550,
      currentAssets: 500,
      currentLiabilities: 200,
      totalAssets: 1200,
    });
    const pm = r.kpis.find((k) => k.key === "profitMargin");
    expect(pm.color).toBe("green");
    expect(pm.score).toBe(100);
    expect(r.kpis).toHaveLength(5);
  });
});
