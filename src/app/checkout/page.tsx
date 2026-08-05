// src/app/checkout/page.tsx – Checkout now lives on /cart (Cart & Checkout).
// Kept as a redirect so any existing links/bookmarks still land somewhere.
import { redirect } from "next/navigation";

export default function CheckoutPage() {
  redirect("/cart");
}
