import { render, screen, within } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import KpiComparisonTable from "@/components/KpiComparisonTable";

const rows = [
  {
    key: "profitMargin",
    label: "Net Profit Margin",
    unit: "percent",
    direction: "higher",
    previous: { value: 0.12, score: 80 },
    current: { value: 0.16, score: 80 },
    scoreChange: 0,
    absolute: 0.04,
    percent: 33.3,
    movement: "improved",
  },
  {
    key: "roa",
    label: "Return on Assets",
    unit: "percent",
    direction: "higher",
    previous: { value: 0.08, score: 80 },
    current: { value: 0.06, score: 60 },
    scoreChange: -20,
    absolute: -0.02,
    percent: -25,
    movement: "declined",
  },
  {
    key: "expenseRatio",
    label: "Expense Ratio",
    unit: "percent",
    direction: "lower",
    previous: { value: 0.75, score: 80 },
    current: { value: 0.68, score: 80 },
    scoreChange: 0,
    absolute: -0.07,
    percent: -9.3,
    movement: "improved",
  },
];

const rowFor = (label) => screen.getByText(label).closest("tr");

describe("KpiComparisonTable", () => {
  test("renders previous and current values side by side", () => {
    render(<KpiComparisonTable rows={rows} previousLabel="Aug" currentLabel="Sep" />);

    const row = within(rowFor("Net Profit Margin"));
    expect(row.getByText("12.0%")).toBeInTheDocument();
    expect(row.getByText("16.0%")).toBeInTheDocument();
    expect(row.getByText("+33.3%")).toBeInTheDocument();
  });

  test("uses the period labels as column headers", () => {
    render(<KpiComparisonTable rows={rows} previousLabel="Aug" currentLabel="Sep" />);
    expect(screen.getByRole("columnheader", { name: "Aug" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Sep" })).toBeInTheDocument();
  });

  test("flags a declining KPI and its score drop", () => {
    render(<KpiComparisonTable rows={rows} />);
    const row = within(rowFor("Return on Assets"));
    expect(row.getByText("-25.0%")).toBeInTheDocument();
    expect(row.getByText(/Declined/)).toBeInTheDocument();
    expect(row.getByText(/score -20/)).toBeInTheDocument();
  });

  test("describes a falling expense ratio as improved, not just negative", () => {
    render(<KpiComparisonTable rows={rows} />);
    const row = within(rowFor("Expense Ratio"));
    expect(row.getByText(/Improved/)).toBeInTheDocument();
    expect(row.getByText("(lower is better)")).toBeInTheDocument();
    expect(row.getByLabelText("Improved: -9.3%")).toBeInTheDocument();
  });

  test("renders nothing without rows", () => {
    const { container } = render(<KpiComparisonTable rows={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
