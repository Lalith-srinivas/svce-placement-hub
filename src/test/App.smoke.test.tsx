import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("App smoke test", () => {
  it("renders the portal hero on the index route", () => {
    render(<App />);
    expect(
      screen.getByText(/Campus Placements/i)
    ).toBeInTheDocument();
  });

  it("renders recruiter cards once loading finishes", async () => {
    render(<App />);
    expect(await screen.findByText("Accenture plc")).toBeInTheDocument();
  });
});
