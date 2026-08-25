import { z } from "zod";
import prisma from "../lib/prisma.js";
import { buildProgress } from "../services/progressService.js";

/**
 * Date-range filter. Validated before it reaches Prisma — an unparseable date
 * previously produced `new Date("Invalid Date")` and a 500 whose body exposed
 * the internal query structure.
 */
const rangeSchema = z
  .object({
    from: z.coerce.date({ invalid_type_error: "from must be a valid date" }).optional(),
    to: z.coerce.date({ invalid_type_error: "to must be a valid date" }).optional(),
  })
  .refine((r) => !r.from || !r.to || r.from <= r.to, {
    message: "from must not be later than to",
    path: ["from"],
  });

/** Shared query: the user's BHS records in a date range, oldest first. */
function historyQuery(req) {
  const { from, to } = rangeSchema.parse({
    // absent params stay absent; empty strings from the UI are treated as unset
    from: req.query.from || undefined,
    to: req.query.to || undefined,
  });

  const where = { userId: req.user.id };
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lte = to;
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
