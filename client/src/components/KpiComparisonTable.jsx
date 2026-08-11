import ChangeIndicator from "@/components/ChangeIndicator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatKpiValue, formatSignedNumber, movementStyle } from "@/lib/format";

/**
 * Side-by-side KPI comparison of the two most recent assessments.
 *
 * `rows` come from GET /api/history/progress and already carry the movement
 * classification, so a lower Expense Ratio is labelled "Improved" rather than
 * being presented as a bare negative percentage.
 */
export default function KpiComparisonTable({ rows, previousLabel, currentLabel }) {
  if (!rows || rows.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>KPI</TableHead>
          <TableHead className="text-right">{previousLabel || "Previous"}</TableHead>
          <TableHead className="text-right">{currentLabel || "Current"}</TableHead>
          <TableHead className="text-right">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const style = movementStyle(row.movement);
          return (
            <TableRow key={row.key}>
              <TableCell>
                <span className="font-medium">{row.label}</span>
                {row.direction === "lower" && (
                  <span className="ml-2 text-xs text-muted-foreground">(lower is better)</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatKpiValue({ value: row.previous.value, unit: row.unit })}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatKpiValue({ value: row.current.value, unit: row.unit })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <ChangeIndicator percent={row.percent} absolute={row.absolute} movement={row.movement} />
                  <span className="text-xs text-muted-foreground">
                    {style.label}
                    {typeof row.scoreChange === "number" && row.scoreChange !== 0 && (
                      <> · score {formatSignedNumber(row.scoreChange, 0)}</>
                    )}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
