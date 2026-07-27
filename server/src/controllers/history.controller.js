import prisma from "../lib/prisma.js";

/** GET /api/history?from=&to= — time-series of the user's BHS records. */
export async function getHistory(req, res, next) {
  try {
    const { from, to } = req.query;
    const where = { userId: req.user.id };
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const records = await prisma.bhsRecord.findMany({
      where,
      include: { submission: true },
      orderBy: { createdAt: "asc" },
    });

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
