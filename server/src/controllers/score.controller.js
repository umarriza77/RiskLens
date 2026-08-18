import { z } from "zod";
import prisma from "../lib/prisma.js";
import { computeBHS } from "../services/bhsEngine.js";

const figuresSchema = z.object({
  periodLabel: z.string().min(1, "Period label is required"),
  revenue: z.number().nonnegative(),
  previousRevenue: z.number().nonnegative(),
  netIncome: z.number(),
  totalExpenses: z.number().nonnegative(),
  currentAssets: z.number().nonnegative(),
  currentLiabilities: z.number().nonnegative(),
  totalAssets: z.number().nonnegative(),
});

/** Sub-score for a KPI, or null when the indicator was excluded from the score. */
function subScore(kpis, key) {
  return kpis.find((k) => k.key === key)?.score ?? null;
}

/** POST /api/score — compute, persist, and return a BHS result. */
export async function createScore(req, res, next) {
  try {
    const data = figuresSchema.parse(req.body);
    const result = computeBHS(data);

    const submission = await prisma.kpiSubmission.create({
      data: {
        userId: req.user.id,
        periodLabel: data.periodLabel,
        revenue: data.revenue,
        previousRevenue: data.previousRevenue,
        netIncome: data.netIncome,
        totalExpenses: data.totalExpenses,
        currentAssets: data.currentAssets,
        currentLiabilities: data.currentLiabilities,
        totalAssets: data.totalAssets,
      },
    });

    const record = await prisma.bhsRecord.create({
      data: {
        submissionId: submission.id,
        userId: req.user.id,
        bhs: result.bhs,
        riskLevel: result.riskLevel,
        performanceBand: result.performanceBand,
        profitMarginScore: subScore(result.kpis, "profitMargin"),
        currentRatioScore: subScore(result.kpis, "currentRatio"),
        roaScore: subScore(result.kpis, "roa"),
        expenseRatioScore: subScore(result.kpis, "expenseRatio"),
        revenueGrowthScore: subScore(result.kpis, "revenueGrowth"),
        breakdown: { kpis: result.kpis, recommendations: result.recommendations },
      },
    });

    res.status(201).json({
      id: record.id,
      submissionId: submission.id,
      periodLabel: submission.periodLabel,
      createdAt: record.createdAt,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/submissions/:id — single record (owner only). */
export async function getRecord(req, res, next) {
  try {
    const id = Number(req.params.id);
    const record = await prisma.bhsRecord.findUnique({
      where: { id },
      include: { submission: true },
    });
    if (!record || record.userId !== req.user.id) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({
      id: record.id,
      submissionId: record.submissionId,
      periodLabel: record.submission.periodLabel,
      createdAt: record.createdAt,
      bhs: record.bhs,
      riskLevel: record.riskLevel,
      performanceBand: record.performanceBand,
      kpis: record.breakdown.kpis,
      recommendations: record.breakdown.recommendations,
      figures: record.submission,
    });
  } catch (err) {
    next(err);
  }
}
