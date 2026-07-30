import api from "./api";

/**
 * Fetch the PDF report for a record as a blob and trigger a browser download.
 */
export async function downloadReport(recordId, periodLabel = "report") {
  const res = await api.get(`/report/${recordId}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `bhs-report-${periodLabel}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
