import { render, screen } from "@testing-library/react";
import AccountOverviewPage from "../page";
import { DEMO_ORDERS, DEMO_SCHEDULES, DEMO_ADDRESSES, DEMO_USERS } from "../data";

describe("AccountOverviewPage", () => {
  it("links to every account section", () => {
    render(<AccountOverviewPage />);
    const expectedHrefs = [
      "/account/orders",
      "/account/schedules",
      "/account/addresses",
      "/account/payment",
      "/account/tax-exempt",
      "/account/users",
    ];
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href")).sort()).toEqual(expectedHrefs.sort());
  });

  it("shows a teaser stat derived from the real demo data counts", () => {
    render(<AccountOverviewPage />);
    expect(
      screen.getByText(`${DEMO_ORDERS.length} orders in the last 90 days`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${DEMO_SCHEDULES.length} active schedules`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${DEMO_ADDRESSES.length} saved addresses`)
    ).toBeInTheDocument();
    expect(screen.getByText(`${DEMO_USERS.length} users`)).toBeInTheDocument();
  });
});
