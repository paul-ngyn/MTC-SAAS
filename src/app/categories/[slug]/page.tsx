// src/app/categories/[slug]/page.tsx – Catalog pre-filtered to one category
// Same CatalogView shell as /categories — only the initial filter differs.
import CatalogView from "@/components/CatalogView";
import { CATEGORIES } from "@/lib/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: `${category?.name ?? "Category"} — MTC Maple Trade Corporation Hub`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return <CatalogView initialCategorySlug={slug} />;
}
