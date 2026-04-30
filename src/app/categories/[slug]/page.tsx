// src/app/categories/[slug]/page.tsx – Dynamic category + product grid
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/lib/types";
import { notFound } from "next/navigation";

// Demo products shown when Supabase returns nothing (dev fallback)
function buildFallbackProducts(categoryId: string): Product[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `demo-${i + 1}`,
    name: `Demo Product ${i + 1}`,
    slug: `demo-product-${i + 1}`,
    description: "This is a sample product. Connect Supabase to show real inventory.",
    price: (1999 + i * 500),
    image_url: null,
    category_id: categoryId,
    stock: i < 5 ? 100 : 0,
    unit: "case",
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = "1", sort = "name" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const PAGE_SIZE = 12;
  const from = (pageNum - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  // Fetch category
  const { data: categoryData } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  // Graceful fallback for dev (category not in DB yet)
  const category: Category = categoryData ?? {
    id: "fallback",
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug,
    description: "Category coming soon. Connect your Supabase database to populate products.",
    image_url: null,
  };

  if (!category) notFound();

  // Fetch products for this category
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category_id", category.id)
    .range(from, to);

  if (sort === "price_asc") query = query.order("price", { ascending: true });
  else if (sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("name");

  const { data: productsData, count } = await query;
  const products: Product[] = (productsData && productsData.length > 0)
    ? productsData
    : buildFallbackProducts(category.id);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-orange-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/categories" className="hover:text-orange-600">Categories</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 mt-1">{category.description}</p>
          )}
        </div>

        {/* Sort */}
        <form method="GET" className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            onChange={(e) => {
              // client-side navigation for sort changes
              const url = new URL(window.location.href);
              url.searchParams.set("sort", e.target.value);
              url.searchParams.set("page", "1");
              window.location.href = url.toString();
            }}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="name">Name A–Z</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </form>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-24">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}&sort=${sort}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                p === pageNum
                  ? "bg-orange-600 text-white border-orange-600"
                  : "border-gray-300 text-gray-700 hover:border-orange-400"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
