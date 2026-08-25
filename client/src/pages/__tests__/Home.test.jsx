import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "@/pages/Home";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { businessName: "Bright Beans Cafe Sdn Bhd" } }),
}));

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe("Home (landing page)", () => {
  test("greets the signed-in business and offers both primary actions", () => {
    renderHome();
    expect(screen.getByText(/welcome back, bright beans cafe sdn bhd/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /see risks\. stay ahead\./i })
    ).toBeInTheDocument();

    const assess = screen.getAllByRole("link", { name: /run an assessment/i });
    expect(assess.length).toBeGreaterThan(0);
    assess.forEach((link) => expect(link).toHaveAttribute("href", "/input"));
    expect(screen.getByRole("link", { name: /open dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });

  test("explains every feature of the system", () => {
    renderHome();
    [
      "Business Health Score",
      "Four-tier risk classification",
      "Recommendations you can act on",
      "Progress tracking",
      "Exportable PDF reports",
      "Your data stays yours",
    ].forEach((title) => expect(screen.getByText(title)).toBeInTheDocument());
  });

  test("describes how the score is produced, step by step", () => {
    renderHome();
    [
      "Enter your figures",
      "Five ratios get worked out",
      "Each ratio is scored and weighted",
      "Fix things, then check again",
    ].forEach((step) => expect(screen.getByText(step)).toBeInTheDocument());
  });

  test("lists the five weighted indicators and the four risk tiers", () => {
    renderHome();
    expect(screen.getByText("Net Profit Margin")).toBeInTheDocument();
    expect(screen.getByText("Revenue Growth Rate")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("15%")).toBeInTheDocument();

    ["Low", "Moderate", "High", "Critical"].forEach((tier) =>
      expect(screen.getByText(tier)).toBeInTheDocument()
    );
    expect(screen.getByText("75 – 100")).toBeInTheDocument();
    expect(screen.getByText("0 – 39")).toBeInTheDocument();
  });
});
