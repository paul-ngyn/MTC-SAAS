// src/app/search/page.tsx – Product search results
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await props.searchParams;
  const q = (rawQ ?? "").trim();

  let products: Product[] = [];
  if (q) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${q}%`)
      .order("name")
      .limit(48);
    products = data ?? [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {!q && (
        <div className="text-center py-24">
          <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-700">Enter a search term above to find products</h1>
          <Link
            href="/categories"
            className="mt-5 inline-block text-[#1c51a3] hover:underline text-sm font-medium"
          >
            Browse all categories
          </Link>
        </div>
      )}

      {q && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Results for &ldquo;{q}&rdquo;
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700 font-medium text-lg">No products found for &ldquo;{q}&rdquo;</p>
              <p className="text-gray-400 text-sm mt-1">Try a different term or browse by category.</p>
              <Link
                href="/categories"
                className="mt-6 inline-block px-6 py-2.5 rounded-md bg-[#1c51a3] text-white text-sm font-semibold hover:bg-[#163d7d] transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
