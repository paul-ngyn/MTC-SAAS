import { render, screen, fireEvent } from "@testing-library/react";
import AccountMenu from "../AccountMenu";
import { useAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

jest.mock("@/lib/auth", () => ({
  useAuthUser: jest.fn(),
}));

const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

const mockSignOut = jest.fn().mockResolvedValue({ error: null });
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(() => ({ auth: { signOut: mockSignOut } })),
}));

function openMenu() {
  fireEvent.mouseEnter(screen.getByRole("button"));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSignOut.mockResolvedValue({ error: null });
});

describe("AccountMenu — signed out", () => {
  beforeEach(() => {
    (useAuthUser as jest.Mock).mockReturnValue({ user: null, loading: false });
  });

  it("shows 'Sign In' on the trigger button, not 'Account' (menu closed)", () => {
    render(<AccountMenu />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.queryByText("Account")).not.toBeInTheDocument();
  });

  it("shows Sign in and Create an account links on the left, no My Lists or Log out", () => {
    render(<AccountMenu />);
    openMenu();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/auth/sign-in"
    );
    expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "/auth/sign-up"
    );
    expect(screen.queryByText("My list")).not.toBeInTheDocument();
    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
  });

  it("still shows the Account sections on the right", () => {
    render(<AccountMenu />);
    openMenu();
    expect(screen.getByText("Order history")).toBeInTheDocument();
  });
});

describe("AccountMenu — signed in", () => {
  beforeEach(() => {
    (useAuthUser as jest.Mock).mockReturnValue({
      user: { id: "u1", email: "owner@maplebistro.com" },
      loading: false,
    });
  });

  it("shows 'Account' on the trigger button, not 'Sign In'", () => {
    render(<AccountMenu />);
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  it("shows My Lists links and a Log out button on the left, no sign-in links", () => {
    render(<AccountMenu />);
    openMenu();
    expect(screen.getByText("Create a list")).toBeInTheDocument();
    expect(screen.getByText("My list")).toBeInTheDocument();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
    expect(screen.queryByText("Create an account")).not.toBeInTheDocument();
  });

  it("signs out, closes the menu, and redirects home when Log out is clicked", async () => {
    render(<AccountMenu />);
    openMenu();
    fireEvent.click(screen.getByText("Log out"));

    expect(createClient).toHaveBeenCalled();
    await Promise.resolve();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("still shows the Account sections on the right", () => {
    render(<AccountMenu />);
    openMenu();
    expect(screen.getByText("Order history")).toBeInTheDocument();
    expect(screen.getByText("Users & approvals")).toBeInTheDocument();
  });
});
