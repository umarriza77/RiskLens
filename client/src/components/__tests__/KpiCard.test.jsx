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

  test("applies the colour accent border for the KPI status", () => {
    const { container } = render(
      <KpiCard kpi={{ key: "roa", label: "Return on Assets", unit: "percent", weight: 20, value: 0.05, score: 60, color: "amber" }} />
    );
    expect(container.querySelector(".border-l-amber-500")).toBeTruthy();
  });
});
