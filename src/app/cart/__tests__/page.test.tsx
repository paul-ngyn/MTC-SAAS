import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "../page";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "td-c32-150",
    name: "32 oz Round Container with Lid, Case of 150",
    slug: "td-c32-150",
    description: null,
    price: 4299,
    image_url: null,
    category_id: "takeout-containers",
    stock: 500,
    unit: "case",
    sku: "TD-C32-150",
    brand_code: "TD",
    ...overrides,
  };
}

function seedCart(items: { product: Product; quantity: number }[]) {
  useCartStore.setState({ items, hasHydrated: true });
}

beforeEach(() => {
  useCartStore.setState({ items: [], hasHydrated: false });
  global.fetch = jest.fn();
});

describe("CartPage — empty / loading state", () => {
  it("shows the empty-cart message before hydration, even if items exist in the store", () => {
    useCartStore.setState({
      items: [{ product: makeProduct(), quantity: 1 }],
      hasHydrated: false,
    });
    render(<CartPage />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("shows the empty-cart message once hydrated with no items", () => {
    useCartStore.setState({ items: [], hasHydrated: true });
    render(<CartPage />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Browse the catalog")).toBeInTheDocument();
  });
});

describe("CartPage — populated cart", () => {
  it("renders line items with tiered unit price and line total", () => {
    seedCart([{ product: makeProduct(), quantity: 10 }]);
    render(<CartPage />);
    expect(screen.getByText("32 oz Round Container with Lid, Case of 150")).toBeInTheDocument();
    // 10 cases hits the 10-49 tier: 4299 * 0.9 = 3869.10 -> rounds to 3869
    expect(screen.getByText("$38.69")).toBeInTheDocument();
    expect(screen.getByText("$386.90")).toBeInTheDocument();
  });

  it("shows bulk-tier savings once a discount applies", () => {
    seedCart([{ product: makeProduct(), quantity: 10 }]);
    render(<CartPage />);
    expect(screen.getByText("Bulk-tier savings")).toBeInTheDocument();
  });

  it("does not show bulk-tier savings at list price (qty below first break)", () => {
    seedCart([{ product: makeProduct(), quantity: 1 }]);
    render(<CartPage />);
    expect(screen.queryByText("Bulk-tier savings")).not.toBeInTheDocument();
  });

  it("charges freight and shows the free-freight nudge below the threshold", () => {
    seedCart([{ product: makeProduct(), quantity: 1 }]); // $42.99, well under $500
    render(<CartPage />);
    expect(screen.getByText("$24.99")).toBeInTheDocument();
    expect(screen.getByText(/join MTC\+/)).toBeInTheDocument();
  });

  it("waives freight once the subtotal clears the free-freight threshold", () => {
    seedCart([{ product: makeProduct(), quantity: 200 }]); // well over $500 even after discount
    render(<CartPage />);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.queryByText(/join MTC\+/)).not.toBeInTheDocument();
  });

  it("increases quantity via the + button", () => {
    seedCart([{ product: makeProduct(), quantity: 1 }]);
    render(<CartPage />);
    fireEvent.click(screen.getByLabelText("Increase"));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("decreases quantity via the − button", () => {
    seedCart([{ product: makeProduct(), quantity: 2 }]);
    render(<CartPage />);
    fireEvent.click(screen.getByLabelText("Decrease"));
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("removes the line item via the trash button", () => {
    seedCart([{ product: makeProduct(), quantity: 1 }]);
    render(<CartPage />);
    fireEvent.click(screen.getByLabelText("Remove"));
    expect(useCartStore.getState().items).toEqual([]);
  });
});

describe("CartPage — checkout", () => {
  it("submits the correct payload to /api/checkout, including tiered unit prices", async () => {
    // jsdom doesn't implement real navigation, so assigning window.location.href
    // logs a (harmless, expected) console.error — silence just that noise.
    // The checkout payload assembly is what this test actually covers.
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/session/abc" }),
    });
    seedCart([{ product: makeProduct(), quantity: 10 }]);
    render(<CartPage />);

    fireEvent.change(screen.getByPlaceholderText("Maple Bistro Inc."), {
      target: { value: "Acme Diner" },
    });
    fireEvent.change(screen.getByPlaceholderText("orders@maplebistro.com"), {
      target: { value: "orders@acmediner.com" },
    });

    fireEvent.click(screen.getByText(/Place order/));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("/api/checkout");
    const body = JSON.parse(options.body);
    expect(body.business).toBe("Acme Diner");
    expect(body.email).toBe("orders@acmediner.com");
    expect(body.items).toEqual([
      { id: "td-c32-150", name: expect.any(String), price: 3869, quantity: 10, image: null },
    ]);

    consoleError.mockRestore();
  });

  it("shows an error message and re-enables the button if checkout fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Cart is empty." }),
    });
    seedCart([{ product: makeProduct(), quantity: 1 }]);
    render(<CartPage />);

    fireEvent.click(screen.getByText(/Place order/));

    await waitFor(() => expect(screen.getByText("Cart is empty.")).toBeInTheDocument());
    expect(screen.getByText(/Place order/)).not.toBeDisabled();
  });
});
