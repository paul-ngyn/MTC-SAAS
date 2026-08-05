import { render, screen } from "@testing-library/react";
import OrderHistoryPage from "../page";
import { DEMO_ORDERS, DEMO_ACCOUNT } from "../../data";
import { formatPrice } from "@/lib/catalog";

describe("OrderHistoryPage", () => {
  it("renders one row per order with date, items, total, and status", () => {
    render(<OrderHistoryPage />);
    for (const order of DEMO_ORDERS) {
      expect(screen.getByText(`#${order.id}`)).toBeInTheDocument();
    }
    // spot check one full row's data renders together correctly
    const first = DEMO_ORDERS[0];
    expect(screen.getByText(`${first.lines} lines · ${first.units} units`)).toBeInTheDocument();
    expect(screen.getByText(formatPrice(first.total))).toBeInTheDocument();
  });

  it("does not shift the order date by a day (timezone-independent formatting)", () => {
    render(<OrderHistoryPage />);
    // 2026-07-08 must render as Jul 08, never Jul 07 (see data.ts comment on
    // why this can't use Date + toLocaleDateString)
    expect(screen.getByText("Jul 08, 2026")).toBeInTheDocument();
  });

  it("shows the account's spend and savings stats", () => {
    render(<OrderHistoryPage />);
    expect(screen.getByText(formatPrice(DEMO_ACCOUNT.spendLast90Days))).toBeInTheDocument();
    expect(screen.getByText(formatPrice(DEMO_ACCOUNT.savedViaBulkTiers))).toBeInTheDocument();
  });
});
