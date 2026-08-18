import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import AuthLayout from "@/components/AuthLayout";

describe("AuthLayout", () => {
  test("renders the form it wraps", () => {
    render(
      <AuthLayout>
        <button type="submit">Sign in</button>
      </AuthLayout>
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  test("marks the decorative brand panel as hidden from assistive technology", () => {
    const { container } = render(
      <AuthLayout>
        <span>form</span>
      </AuthLayout>
    );
    const panel = container.querySelector('[aria-hidden="true"]');
    expect(panel).toBeTruthy();
    // the gradient panel only appears from the lg breakpoint upwards
    expect(panel.className).toMatch(/hidden/);
    expect(panel.className).toMatch(/lg:block/);
  });
});
