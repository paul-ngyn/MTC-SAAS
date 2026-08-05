import { render, screen, fireEvent } from "@testing-library/react";
import WishlistPage from "../page";
import { DEMO_WISHLIST_PRODUCT_IDS } from "@/lib/wishlist";
import { ALL_PRODUCTS } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";

beforeEach(() => {
  useCartStore.setState({ items: [], hasHydrated: true });
});

describe("WishlistPage", () => {
  it("renders every favorited product from the demo wishlist", () => {
    render(<WishlistPage />);
    for (const id of DEMO_WISHLIST_PRODUCT_IDS) {
      const product = ALL_PRODUCTS.find((p) => p.id === id)!;
      expect(screen.getByText(product.name)).toBeInTheDocument();
    }
  });

  it("removes a product from view when its heart button is clicked", () => {
    render(<WishlistPage />);
    const removedProduct = ALL_PRODUCTS.find(
      (p) => p.id === DEMO_WISHLIST_PRODUCT_IDS[0]
    )!;
    const removeButtons = screen.getAllByLabelText("Remove from wishlist");
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByText(removedProduct.name)).not.toBeInTheDocument();
  });

  it("shows the empty state once every item has been removed", () => {
    render(<WishlistPage />);
    let removeButtons = screen.getAllByLabelText("Remove from wishlist");
    while (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0]);
      removeButtons = screen.queryAllByLabelText("Remove from wishlist");
    }
    expect(screen.getByText("Your wishlist is empty.")).toBeInTheDocument();
  });

  it("can add a wishlist item to the real cart via its Add button", () => {
    render(<WishlistPage />);
    fireEvent.click(screen.getAllByText("Add")[0]);
    expect(useCartStore.getState().items).toHaveLength(1);
  });
});
