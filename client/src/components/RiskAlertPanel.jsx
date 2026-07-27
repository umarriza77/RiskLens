import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { RISK_STYLES } from "@/lib/format";

const RISK_TEXT = {
  Low: "Your business is financially healthy. Maintain current practices and keep monitoring.",
  Moderate: "Some indicators need attention. Address the flagged areas before they escalate.",
  High: "Several indicators are weak. Take corrective action soon to avoid financial stress.",
  Critical: "Your business shows signs of serious financial distress. Immediate action is strongly advised.",
};

const ICON = {
  Low: CheckCircle2,
  Moderate: AlertTriangle,
  High: AlertTriangle,
  Critical: ShieldAlert,
};

/**
 * The most visually prominent panel: risk classification + plain-language
 * recommendations. (Survey: risk alerts are the highest-valued feature.)
 */
export default function RiskAlertPanel({ riskLevel, performanceBand, recommendations = [] }) {
  const style = RISK_STYLES[riskLevel] || RISK_STYLES.Moderate;
  const Icon = ICON[riskLevel] || AlertTriangle;

  return (
    <Alert variant={style.variant}>
      <Icon className="h-5 w-5" />
      <AlertTitle className="text-base">
        {style.label} · Performance: {performanceBand}
      </AlertTitle>
      <AlertDescription>
        <p className="mt-1">{RISK_TEXT[riskLevel]}</p>
        {recommendations.length > 0 && (
          <div className="mt-3">
            <p className="font-medium">Recommended actions:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
