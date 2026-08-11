import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import api from "@/lib/api";
import TrendChart from "@/components/TrendChart";
import ChangeIndicator from "@/components/ChangeIndicator";
import ProgressSummary from "@/components/ProgressSummary";
import KpiComparisonTable from "@/components/KpiComparisonTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RISK_STYLES } from "@/lib/format";
import { downloadReport } from "@/lib/report";

const EMPTY = { series: [], summary: null, kpiComparison: [] };

export default function History() {
  const [progress, setProgress] = useState(EMPTY);
  const [range, setRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const params = {};
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;
      const res = await api.get("/history/progress", { params });
      setProgress(res.data ?? EMPTY);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { series, summary, kpiComparison } = progress;
  // The comparison is between the two most recent assessments in range.
  const currentLabel = series[series.length - 1]?.periodLabel;
  const previousLabel = series[series.length - 2]?.periodLabel;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Health History</h1>
        <p className="text-sm text-muted-foreground">
          Track how your Business Health Score changes from one assessment to the next.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter by date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
            </div>
            <Button onClick={load}>Apply</Button>
          </div>
        </CardContent>
      </Card>

      {!loading && <ProgressSummary summary={summary} />}

      {series.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Health Score over time</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={series} />
          </CardContent>
        </Card>
      )}

      {kpiComparison.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>KPI comparison</CardTitle>
            <p className="text-sm text-muted-foreground">
              {previousLabel} vs {currentLabel}
            </p>
          </CardHeader>
          <CardContent>
            <KpiComparisonTable rows={kpiComparison} previousLabel={previousLabel} currentLabel={currentLabel} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : series.length === 0 ? (
            <p className="text-muted-foreground">No assessments in this range.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>BHS</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...series].reverse().map((r) => {
                  const style = RISK_STYLES[r.riskLevel] || RISK_STYLES.Moderate;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.periodLabel}</TableCell>
                      <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="tabular-nums">{r.bhs}</TableCell>
                      <TableCell>
                        {r.change ? (
                          <ChangeIndicator
                            percent={r.change.percent}
                            absolute={r.change.absolute}
                            movement={r.change.movement}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">Baseline</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={style.variant}>{style.label}</Badge>
                      </TableCell>
                      <TableCell>{r.performanceBand}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => downloadReport(r.id, r.periodLabel)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
