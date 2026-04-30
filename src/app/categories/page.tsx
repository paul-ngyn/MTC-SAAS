// src/app/categories/page.tsx – All Categories listing
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

const EMOJI_MAP: Record<string, string> = {
  "kitchen-equipment": "🍳",
  disposables: "🥡",
  smallwares: "🔪",
  refrigeration: "❄️",
  "cleaning-supplies": "🧹",
  "food-storage": "📦",
  beverages: "🥤",
  bakery: "🥖",
};

// Seed categories shown when Supabase returns nothing (dev fallback)
const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Kitchen Equipment", slug: "kitchen-equipment", description: "Commercial cooking equipment for professional kitchens.", image_url: null },
  { id: "2", name: "Disposables", slug: "disposables", description: "Single-use packaging, containers, and serviceware.", image_url: null },
  { id: "3", name: "Smallwares", slug: "smallwares", description: "Knives, utensils, prep tools, and more.", image_url: null },
  { id: "4", name: "Refrigeration", slug: "refrigeration", description: "Reach-in coolers, walk-ins, and refrigerated display cases.", image_url: null },
  { id: "5", name: "Cleaning Supplies", slug: "cleaning-supplies", description: "Chemicals, mops, brushes, and sanitation equipment.", image_url: null },
  { id: "6", name: "Food Storage", slug: "food-storage", description: "Containers, shelving, and storage solutions.", image_url: null },
];

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  const categories: Category[] = (data && data.length > 0) ? data : FALLBACK_CATEGORIES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">All Categories</h1>
      <p className="text-gray-500 mb-8">Browse our full range of restaurant supply categories.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all"
          >
            <span className="text-5xl">{EMOJI_MAP[cat.slug] ?? "📦"}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
