import prisma from "../lib/prisma.js";
import { buildProgress } from "../services/progressService.js";

/** Shared query: the user's BHS records in a date range, oldest first. */
function historyQuery(req) {
  const { from, to } = req.query;
  const where = { userId: req.user.id };
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }
  return { where, include: { submission: true }, orderBy: { createdAt: "asc" } };
}

/** GET /api/history?from=&to= — time-series of the user's BHS records. */
export async function getHistory(req, res, next) {
  try {
    const records = await prisma.bhsRecord.findMany(historyQuery(req));

    res.json(
      records.map((r) => ({
        id: r.id,
        periodLabel: r.submission.periodLabel,
        createdAt: r.createdAt,
        bhs: r.bhs,
        riskLevel: r.riskLevel,
        performanceBand: r.performanceBand,
      }))
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/history/progress?from=&to= — the same time-series enriched with
 * comparison data: per-assessment change, an overall improvement summary, and
 * a KPI-by-KPI comparison of the two most recent assessments.
 */
export async function getProgress(req, res, next) {
  try {
    const records = await prisma.bhsRecord.findMany(historyQuery(req));

    res.json(
      buildProgress(
        records.map((r) => ({
          id: r.id,
          periodLabel: r.submission.periodLabel,
          createdAt: r.createdAt,
          bhs: r.bhs,
          riskLevel: r.riskLevel,
          performanceBand: r.performanceBand,
          kpis: r.breakdown?.kpis ?? [],
        }))
      )
    );
  } catch (err) {
    next(err);
  }
}
