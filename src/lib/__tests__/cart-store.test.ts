import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    name: "Test Product",
    slug: "test-product",
    description: null,
    price: 1000,
    image_url: null,
    category_id: "test",
    stock: 100,
    unit: "each",
    ...overrides,
  };
}

beforeEach(() => {
  useCartStore.setState({ items: [], hasHydrated: false });
});

describe("cart store", () => {
  it("starts empty", () => {
    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().itemCount()).toBe(0);
    expect(useCartStore.getState().total()).toBe(0);
  });

  it("adds a new product with the given quantity (default 1)", () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product);
    expect(useCartStore.getState().items).toEqual([{ product, quantity: 1 }]);
  });

  it("merges quantity when adding the same product twice", () => {
    const product = makeProduct();
    useCartStore.getState().addItem(product, 3);
    useCartStore.getState().addItem(product, 2);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("keeps distinct products as separate line items", () => {
    useCartStore.getState().addItem(makeProduct({ id: "p1" }));
    useCartStore.getState().addItem(makeProduct({ id: "p2" }));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("removes an item by product id", () => {
    useCartStore.getState().addItem(makeProduct({ id: "p1" }));
    useCartStore.getState().addItem(makeProduct({ id: "p2" }));
    useCartStore.getState().removeItem("p1");
    expect(useCartStore.getState().items.map((i) => i.product.id)).toEqual(["p2"]);
  });

  it("updates quantity in place", () => {
    useCartStore.getState().addItem(makeProduct({ id: "p1" }), 1);
    useCartStore.getState().updateQuantity("p1", 7);
    expect(useCartStore.getState().items[0].quantity).toBe(7);
  });

  it("removes the item when quantity is updated to zero or below", () => {
    useCartStore.getState().addItem(makeProduct({ id: "p1" }), 1);
    useCartStore.getState().updateQuantity("p1", 0);
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("clears the cart", () => {
    useCartStore.getState().addItem(makeProduct({ id: "p1" }));
    useCartStore.getState().addItem(makeProduct({ id: "p2" }));
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("computes itemCount as the sum of quantities, not line count", () => {
    useCartStore.getState().addItem(makeProduct({ id: "p1" }), 3);
    useCartStore.getState().addItem(makeProduct({ id: "p2" }), 4);
    expect(useCartStore.getState().itemCount()).toBe(7);
  });

  it("computes total as list price × quantity, ignoring tiered pricing", () => {
    useCartStore.getState().addItem(makeProduct({ id: "p1", price: 1000 }), 3);
    useCartStore.getState().addItem(makeProduct({ id: "p2", price: 2500 }), 2);
    expect(useCartStore.getState().total()).toBe(1000 * 3 + 2500 * 2);
  });

  it("starts with hasHydrated false (skipHydration prevents auto-read)", () => {
    expect(useCartStore.getState().hasHydrated).toBe(false);
  });
});
