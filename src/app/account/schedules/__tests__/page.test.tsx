import { render, screen, fireEvent, within } from "@testing-library/react";
import SchedulesPage from "../page";
import { DEMO_SCHEDULES } from "../../data";

describe("SchedulesPage", () => {
  it("renders every schedule's brand, cadence, and next date", () => {
    render(<SchedulesPage />);
    for (const s of DEMO_SCHEDULES) {
      expect(screen.getByText(s.productName)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`next: ${s.nextDate}`))).toBeInTheDocument();
    }
  });

  it("toggles a schedule to skipped and back via the Skip next / Undo skip button", () => {
    render(<SchedulesPage />);
    const first = DEMO_SCHEDULES[0];
    const card = screen.getByText(first.productName).closest("div")!;

    const skipButton = within(card).getByText("Skip next");
    fireEvent.click(skipButton);

    expect(within(card).getByText(/next: skipped/)).toBeInTheDocument();
    expect(within(card).getByText("Undo skip")).toBeInTheDocument();

    fireEvent.click(within(card).getByText("Undo skip"));
    expect(within(card).getByText(new RegExp(`next: ${first.nextDate}`))).toBeInTheDocument();
  });

  it("only affects the schedule that was skipped, not the others", () => {
    render(<SchedulesPage />);
    const [first, second] = DEMO_SCHEDULES;
    const firstCard = screen.getByText(first.productName).closest("div")!;

    fireEvent.click(within(firstCard).getByText("Skip next"));

    expect(within(firstCard).getByText(/next: skipped/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`next: ${second.nextDate}`))).toBeInTheDocument();
  });
});
