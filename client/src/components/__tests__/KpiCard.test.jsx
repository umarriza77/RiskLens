import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import KpiCard from "@/components/KpiCard";

describe("KpiCard", () => {
  test("renders label, formatted percent value, and score badge", () => {
    render(
      <KpiCard
        kpi={{ key: "profitMargin", label: "Net Profit Margin", unit: "percent", weight: 25, value: 0.2, score: 100, color: "green" }}
      />
    );
    expect(screen.getByText("Net Profit Margin")).toBeInTheDocument();
    expect(screen.getByText("20.0%")).toBeInTheDocument();
    expect(screen.getByText("100/100")).toBeInTheDocument();
    expect(screen.getByText("Weight: 25%")).toBeInTheDocument();
  });

  test("renders ratio unit without percent and N/A for null value", () => {
    render(
      <KpiCard
        kpi={{ key: "currentRatio", label: "Current Ratio", unit: "ratio", weight: 20, value: null, score: 10, color: "red" }}
      />
    );
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  test("shows an excluded indicator as not scored, with the reason", () => {
    render(
      <KpiCard
        kpi={{
          key: "revenueGrowth",
          label: "Revenue Growth Rate",
          unit: "percent",
          weight: 15,
          value: null,
          score: null,
          color: "neutral",
          excluded: true,
          note: "No prior period to compare against, so growth is excluded from this score.",
        }}
      />
    );
    expect(screen.getByText("Not scored")).toBeInTheDocument();
    expect(screen.getByText("Excluded from the score")).toBeInTheDocument();
    expect(screen.getByText(/no prior period to compare against/i)).toBeInTheDocument();
    expect(screen.queryByText("Weight: 15%")).not.toBeInTheDocument();
  });

  test("a debt-free current ratio is shown as a full score, not a failure", () => {
    render(
      <KpiCard
        kpi={{
          key: "currentRatio",
          label: "Current Ratio",
          unit: "ratio",
          weight: 20,
          value: null,
          score: 100,
          color: "green",
          excluded: false,
          note: "No current liabilities — nothing short-term to cover, so liquidity is treated as ideal.",
        }}
      />
    );
    expect(screen.getByText("100/100")).toBeInTheDocument();
    expect(screen.getByText("Weight: 20%")).toBeInTheDocument();
    expect(screen.getByText(/no current liabilities/i)).toBeInTheDocument();
  });

  test("applies the colour accent border for the KPI status", () => {
    const { container } = render(
      <KpiCard kpi={{ key: "roa", label: "Return on Assets", unit: "percent", weight: 20, value: 0.05, score: 60, color: "amber" }} />
    );
    expect(container.querySelector(".border-l-amber-500")).toBeTruthy();
  });
});
