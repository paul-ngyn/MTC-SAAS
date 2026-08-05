// src/app/lists/[id]/page.tsx – Saved list detail: items + add-all-to-cart
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { getList, resolveListItems } from "@/lib/lists";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/catalog";
import { getLineTotal } from "@/lib/pricing";

function unslugify(id: string) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ListDetailPage() {
  const params = useParams<{ id: string }>();
  const list = getList(params.id);
  const initialItems = useMemo(
    () => (list ? resolveListItems(list) : []),
    [list]
  );
  const [items, setItems] = useState(initialItems);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const listName = list?.name ?? unslugify(params.id);

  const updateQty = (productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          )
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleAddAll = () => {
    items.forEach((i) => addItem(i.product, i.quantity));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const total = items.reduce(
    (sum, i) =>
      sum + getLineTotal(i.product.price, i.product.unit, i.quantity, i.product.tierBreaks),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/lists" className="hover:text-navy">
          My Lists
        </Link>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl uppercase text-gray-900">
          {listName}
        </h1>
        {items.length > 0 && (
          <button
            onClick={handleAddAll}
            className="px-6 py-3 bg-navy text-white text-sm font-bold hover:bg-navy-dark transition-colors flex-shrink-0"
          >
            {added ? "✓ Added" : `Add all to cart · ${formatPrice(total)}`}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-500">This list has no items yet.</p>
          <Link
            href="/categories"
            className="mt-4 inline-block text-sm font-bold text-navy hover:text-navy-dark"
          >
            Browse the catalog →
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                  Item
                </th>
                <th className="text-left font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                  Qty
                </th>
                <th className="text-right font-bold text-gray-500 text-xs uppercase tracking-wide px-6 py-4">
                  Line total
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {items.map(({ product, quantity }) => (
                <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {product.brand_code && (
                        <span className="text-[10px] font-bold tracking-wide uppercase text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5">
                          {product.brand_code}
                        </span>
                      )}
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-bold text-gray-900 hover:text-navy"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center border border-gray-300 w-fit">
                      <button
                        onClick={() => updateQty(product.id, quantity - 1)}
                        aria-label="Decrease"
                        className="px-2.5 py-1 font-bold text-gray-500 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-semibold text-gray-900 border-x border-gray-300 text-sm tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, quantity + 1)}
                        aria-label="Increase"
                        className="px-2.5 py-1 font-bold text-gray-500 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-navy tabular-nums whitespace-nowrap">
                    {formatPrice(
                      getLineTotal(product.price, product.unit, quantity, product.tierBreaks)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
