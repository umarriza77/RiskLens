import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FIELDS = [
  { key: "periodLabel", label: "Reporting period", type: "text", placeholder: "e.g. 2026-Q1", hint: "A label for this assessment" },
  { key: "revenue", label: "Revenue (this period)", type: "number", hint: "Total sales/turnover" },
  { key: "previousRevenue", label: "Revenue (previous period)", type: "number", hint: "Used for growth rate" },
  { key: "netIncome", label: "Net income / profit", type: "number", hint: "Can be negative for a loss" },
  { key: "totalExpenses", label: "Total operating expenses", type: "number" },
  { key: "currentAssets", label: "Current assets", type: "number" },
  { key: "currentLiabilities", label: "Current liabilities", type: "number" },
  { key: "totalAssets", label: "Total assets", type: "number" },
];

export default function KpiInput() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    periodLabel: "",
    revenue: "",
    previousRevenue: "",
    netIncome: "",
    totalExpenses: "",
    currentAssets: "",
    currentLiabilities: "",
    totalAssets: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        periodLabel: form.periodLabel,
        revenue: Number(form.revenue),
        previousRevenue: Number(form.previousRevenue),
        netIncome: Number(form.netIncome),
        totalExpenses: Number(form.totalExpenses),
        currentAssets: Number(form.currentAssets),
        currentLiabilities: Number(form.currentLiabilities),
        totalAssets: Number(form.totalAssets),
      };
      const res = await api.post("/score", payload);
      navigate(`/?recordId=${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Could not compute score");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>New Health Assessment</CardTitle>
          <CardDescription>
            Enter your financial figures for the period. We compute your Business Health Score automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  type={f.type}
                  step={f.type === "number" ? "any" : undefined}
                  placeholder={f.placeholder}
                  required
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
                {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
              </div>
            ))}
            {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Calculating…" : "Calculate Business Health Score"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
