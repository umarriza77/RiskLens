import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ChangeIndicator from "@/components/ChangeIndicator";

describe("ChangeIndicator", () => {
  test("shows a signed percentage for an improvement", () => {
    render(<ChangeIndicator percent={8.8} absolute={6} movement="improved" />);
    expect(screen.getByText("+8.8%")).toBeInTheDocument();
    expect(screen.getByLabelText("Improved: +8.8%")).toBeInTheDocument();
  });

  test("shows a negative percentage for a decline", () => {
    render(<ChangeIndicator percent={-25} absolute={-0.02} movement="declined" />);
    expect(screen.getByText("-25.0%")).toBeInTheDocument();
  });

  test("labels a falling lower-is-better metric as improved", () => {
    render(<ChangeIndicator percent={-9.3} absolute={-0.07} movement="improved" />);
    expect(screen.getByLabelText("Improved: -9.3%")).toBeInTheDocument();
  });

  test("falls back to the absolute change when there is no percentage", () => {
    render(<ChangeIndicator percent={null} absolute={5} movement="improved" />);
    expect(screen.getByText("+5 pts")).toBeInTheDocument();
  });

  test("renders a dash when nothing is comparable", () => {
    render(<ChangeIndicator percent={null} absolute={null} movement="unknown" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
