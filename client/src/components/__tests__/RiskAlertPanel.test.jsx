import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import RiskAlertPanel from "@/components/RiskAlertPanel";

describe("RiskAlertPanel", () => {
  test("shows the risk label, performance band, and recommendations", () => {
    render(
      <RiskAlertPanel
        riskLevel="High"
        performanceBand="Fair"
        recommendations={["Improve cash reserves", "Reduce operating costs"]}
      />
    );
    expect(screen.getByText(/High Risk/)).toBeInTheDocument();
    expect(screen.getByText(/Performance: Fair/)).toBeInTheDocument();
    expect(screen.getByText("Improve cash reserves")).toBeInTheDocument();
    expect(screen.getByText("Reduce operating costs")).toBeInTheDocument();
  });

  test("omits the recommendations list when there are none", () => {
    render(<RiskAlertPanel riskLevel="Low" performanceBand="Excellent" recommendations={[]} />);
    expect(screen.getByText(/Low Risk/)).toBeInTheDocument();
    expect(screen.queryByText("Recommended actions:")).not.toBeInTheDocument();
  });
});
