import { render, screen, within } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ProgressSummary from "@/components/ProgressSummary";

const summary = {
  assessments: 3,
  comparable: true,
  first: { periodLabel: "Aug W1", createdAt: "2025-08-01", bhs: 68, riskLevel: "Moderate" },
  latest: { periodLabel: "Sep W1", createdAt: "2025-09-01", bhs: 81, riskLevel: "Low", performanceBand: "Excellent" },
  best: 81,
  worst: 68,
  absolute: 13,
  percent: 19.1,
  movement: "improved",
};

describe("ProgressSummary", () => {
  test("states the overall improvement in plain language", () => {
    render(<ProgressSummary summary={summary} />);
    expect(
      screen.getByText(
        "Your Business Health Score increased by 19.1% (+13 points) since your first assessment (Aug W1)."
      )
    ).toBeInTheDocument();
  });

  test("shows the latest score with its risk badge and the headline change", () => {
    render(<ProgressSummary summary={summary} />);
    const current = within(screen.getByText("Current BHS").parentElement);
    expect(current.getByText("81")).toBeInTheDocument();
    expect(current.getByText("Low Risk")).toBeInTheDocument();
    expect(screen.getByLabelText("Improved: +19.1%")).toBeInTheDocument();
    expect(screen.getByText("Assessments")).toBeInTheDocument();
  });

  test("describes a decline", () => {
    render(
      <ProgressSummary
        summary={{ ...summary, absolute: -8, percent: -10.5, movement: "declined", latest: { ...summary.latest, bhs: 60, riskLevel: "Moderate" } }}
      />
    );
    expect(
      screen.getByText(
        "Your Business Health Score decreased by 10.5% (-8 points) since your first assessment (Aug W1)."
      )
    ).toBeInTheDocument();
  });

  test("prompts for a second assessment when there is nothing to compare", () => {
    render(
      <ProgressSummary
        summary={{ ...summary, assessments: 1, comparable: false, absolute: 0, percent: null, movement: "unchanged" }}
      />
    );
    expect(screen.getByText(/Run a second assessment/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Improved/)).not.toBeInTheDocument();
  });

  test("renders nothing without a summary", () => {
    const { container } = render(<ProgressSummary summary={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
