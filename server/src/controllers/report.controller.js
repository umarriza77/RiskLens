import prisma from "../lib/prisma.js";
import { streamReport } from "../services/reportService.js";

/** GET /api/report/:id — stream a PDF report (owner only). */
export async function getReport(req, res, next) {
  try {
    const id = Number(req.params.id);
    const record = await prisma.bhsRecord.findUnique({
      where: { id },
      include: { submission: true, user: true },
    });
    if (!record || record.userId !== req.user.id) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="bhs-report-${record.submission.periodLabel}.pdf"`
    );

    streamReport(res, {
      businessName: record.user.businessName,
      periodLabel: record.submission.periodLabel,
      createdAt: record.createdAt,
      bhs: record.bhs,
      riskLevel: record.riskLevel,
      performanceBand: record.performanceBand,
      kpis: record.breakdown.kpis,
      recommendations: record.breakdown.recommendations,
    });
  } catch (err) {
    next(err);
  }
}
