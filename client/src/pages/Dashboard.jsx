import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import api from "@/lib/api";
import BhsGauge from "@/components/BhsGauge";
import KpiCard from "@/components/KpiCard";
import RiskAlertPanel from "@/components/RiskAlertPanel";
import TrendChart from "@/components/TrendChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function Dashboard() {
  const [params] = useSearchParams();
  const recordId = params.get("recordId");
  const [record, setRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const hist = await api.get("/history");
        setHistory(hist.data);

        const targetId = recordId || hist.data[hist.data.length - 1]?.id;
        if (targetId) {
          const res = await api.get(`/submissions/${targetId}`);
          setRecord(res.data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [recordId]);

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading dashboard…</p>;
  }

  if (!record) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>No assessments yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Run your first health assessment to see your Business Health Score, risk level, and recommendations.
          </p>
          <Button asChild>
            <Link to="/input">
              <PlusCircle className="h-4 w-4" /> Start an assessment
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Health Dashboard</h1>
          <p className="text-sm text-muted-foreground">Period: {record.periodLabel}</p>
        </div>
        <div className="flex gap-2">

          <Button asChild>
            <Link to="/input">
              <PlusCircle className="h-4 w-4" /> New
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Business Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <BhsGauge bhs={record.bhs} riskLevel={record.riskLevel} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <RiskAlertPanel
            riskLevel={record.riskLevel}
            performanceBand={record.performanceBand}
            recommendations={record.recommendations}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {record.kpis.map((kpi) => (
            <KpiCard key={kpi.key} kpi={kpi} />
          ))}
        </div>
      </div>

      {history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Health Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={history} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
