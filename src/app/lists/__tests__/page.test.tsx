import { render, screen, fireEvent, within } from "@testing-library/react";
import ListsPage from "../page";
import { DEMO_LISTS } from "@/lib/lists";

describe("ListsPage", () => {
  it("renders every saved list with its item count", () => {
    render(<ListsPage />);
    for (const list of DEMO_LISTS) {
      expect(screen.getByText(list.name)).toBeInTheDocument();
    }
    const first = DEMO_LISTS[0];
    const firstCard = screen.getByText(first.name).closest("a")!;
    expect(within(firstCard).getByText(`${first.items.length} items`)).toBeInTheDocument();
  });

  it("does not show the create form by default", () => {
    render(<ListsPage />);
    expect(screen.queryByPlaceholderText(/Weekend Catering Order/)).not.toBeInTheDocument();
  });

  it("toggles the create form open via '+ Create new list'", () => {
    render(<ListsPage />);
    fireEvent.click(screen.getByText("+ Create new list"));
    expect(screen.getByPlaceholderText(/Weekend Catering Order/)).toBeInTheDocument();
  });

  it("adds a new list card when the create form is submitted", () => {
    render(<ListsPage />);
    fireEvent.click(screen.getByText("+ Create new list"));
    fireEvent.change(screen.getByPlaceholderText(/Weekend Catering Order/), {
      target: { value: "Holiday Party Supplies" },
    });
    fireEvent.click(screen.getByText("Create"));

    expect(screen.getByText("Holiday Party Supplies")).toBeInTheDocument();
    expect(screen.getByText("0 items")).toBeInTheDocument();
    // form closes after a successful create
    expect(screen.queryByPlaceholderText(/Weekend Catering Order/)).not.toBeInTheDocument();
  });

  it("does not create a list with a blank name", () => {
    render(<ListsPage />);
    const before = screen.getAllByRole("link").length;
    fireEvent.click(screen.getByText("+ Create new list"));
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getAllByRole("link")).toHaveLength(before);
  });

  it("submits the create form on Enter as well as the Create button", () => {
    render(<ListsPage />);
    fireEvent.click(screen.getByText("+ Create new list"));
    const input = screen.getByPlaceholderText(/Weekend Catering Order/);
    fireEvent.change(input, { target: { value: "Staff Meal Prep" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("Staff Meal Prep")).toBeInTheDocument();
  });

  it("auto-opens the create form when the URL has ?create=1", () => {
    window.history.pushState({}, "", "/lists?create=1");
    render(<ListsPage />);
    expect(screen.getByPlaceholderText(/Weekend Catering Order/)).toBeInTheDocument();
    window.history.pushState({}, "", "/lists");
  });

  it("each list card links to its detail page", () => {
    render(<ListsPage />);
    const first = DEMO_LISTS[0];
    const card = screen.getByText(first.name).closest("a")!;
    expect(within(card).getByText(first.name)).toBeInTheDocument();
    expect(card.getAttribute("href")).toBe(`/lists/${first.id}`);
  });
});
