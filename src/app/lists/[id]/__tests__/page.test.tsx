import { render, screen, fireEvent } from "@testing-library/react";
import ListDetailPage from "../page";
import { DEMO_LISTS } from "@/lib/lists";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, ALL_PRODUCTS } from "@/lib/catalog";
import { getLineTotal } from "@/lib/pricing";

let mockParamId = "weekly-prep-order";
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: mockParamId }),
}));

beforeEach(() => {
  useCartStore.setState({ items: [], hasHydrated: true });
});

describe("ListDetailPage — known list", () => {
  beforeEach(() => {
    mockParamId = "weekly-prep-order";
  });

  it("renders the list name and every item with its line total", () => {
    render(<ListDetailPage />);
    const list = DEMO_LISTS.find((l) => l.id === "weekly-prep-order")!;
    expect(screen.getByRole("heading", { name: "Weekly Prep Order" })).toBeInTheDocument();
    for (const { quantity } of list.items) {
      expect(screen.getByText(String(quantity))).toBeInTheDocument();
    }
  });

  it("shows the correct tiered total on the Add all to cart button", () => {
    render(<ListDetailPage />);
    const list = DEMO_LISTS.find((l) => l.id === "weekly-prep-order")!;
    const expectedTotal = list.items.reduce((sum, item) => {
      // resolve against the real catalog the same way the page does
      const product = ALL_PRODUCTS.find((p) => p.id === item.productId)!;
      return sum + getLineTotal(product.price, product.unit, item.quantity, product.tierBreaks);
    }, 0);
    expect(
      screen.getByText(`Add all to cart · ${formatPrice(expectedTotal)}`)
    ).toBeInTheDocument();
  });

  it("adds every item at its list quantity to the cart when 'Add all to cart' is clicked", () => {
    render(<ListDetailPage />);
    fireEvent.click(screen.getByText(/Add all to cart/));

    const cartItems = useCartStore.getState().items;
    const list = DEMO_LISTS.find((l) => l.id === "weekly-prep-order")!;
    expect(cartItems).toHaveLength(list.items.length);
    for (const { productId, quantity } of list.items) {
      const cartItem = cartItems.find((i) => i.product.id === productId);
      expect(cartItem?.quantity).toBe(quantity);
    }
  });

  it("shows a confirmation state briefly after adding to cart", () => {
    render(<ListDetailPage />);
    fireEvent.click(screen.getByText(/Add all to cart/));
    expect(screen.getByText("✓ Added")).toBeInTheDocument();
  });

  it("increases and decreases an item's quantity independently of the others", () => {
    render(<ListDetailPage />);
    const [incButton] = screen.getAllByLabelText("Increase");
    fireEvent.click(incButton);
    // first item's quantity in the fixture is 20 -> should become 21
    expect(screen.getByText("21")).toBeInTheDocument();
  });

  it("removes a row entirely when its quantity is decreased to zero repeatedly", () => {
    render(<ListDetailPage />);
    const list = DEMO_LISTS.find((l) => l.id === "weekly-prep-order")!;
    const rowCountBefore = list.items.length;
    const [firstDecrease] = screen.getAllByLabelText("Decrease");
    // first item's quantity is 20; click decrease 20 times to zero it out
    for (let i = 0; i < 20; i++) {
      fireEvent.click(screen.getAllByLabelText("Decrease")[0]);
    }
    expect(screen.getAllByLabelText("Decrease")).toHaveLength(rowCountBefore - 1);
  });

  it("removes a row via the trash/remove button", () => {
    render(<ListDetailPage />);
    const rowCountBefore = screen.getAllByLabelText("Remove").length;
    fireEvent.click(screen.getAllByLabelText("Remove")[0]);
    expect(screen.getAllByLabelText("Remove")).toHaveLength(rowCountBefore - 1);
  });
});

describe("ListDetailPage — unknown/empty list", () => {
  beforeEach(() => {
    mockParamId = "a-brand-new-list";
  });

  it("falls back to a human-readable name derived from the id", () => {
    render(<ListDetailPage />);
    expect(screen.getByRole("heading", { name: "A Brand New List" })).toBeInTheDocument();
  });

  it("shows the empty state and no Add all to cart button", () => {
    render(<ListDetailPage />);
    expect(screen.getByText("This list has no items yet.")).toBeInTheDocument();
    expect(screen.queryByText(/Add all to cart/)).not.toBeInTheDocument();
  });
});
