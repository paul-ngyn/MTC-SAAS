// app/categories/[slug].tsx – Browse: products in a category, with filter chips

import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '@/lib/supabase';
import ProductRow from '@/components/ProductRow';
import { colors } from '@/lib/theme';
import { getDemoProductsForCategory } from '@/lib/catalog';
import type { Category, Product } from '@/lib/types';

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  if (sort === 'price_asc') copy.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') copy.sort((a, b) => b.price - a.price);
  else copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy;
}

type SortKey = 'name' | 'price_asc' | 'price_desc';
const SORT_CYCLE: SortKey[] = ['name', 'price_asc', 'price_desc'];
const SORT_LABEL: Record<SortKey, string> = { name: 'Name', price_asc: 'Price ↑', price_desc: 'Price ↓' };

export default function CategoryProductsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  // Seed synchronously from demo data so the screen renders instantly even when
  // Supabase is unreachable (it's being wired up separately). Live data, if it
  // arrives, overrides below.
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>(() =>
    sortProducts(getDemoProductsForCategory(slug ?? ''), 'name')
  );
  const [isLive, setIsLive] = useState(false);
  const [sort, setSort] = useState<SortKey>('name');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  // Set the header title from the slug immediately.
  useEffect(() => {
    if (!slug) return;
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    navigation.setOptions({ title: name.toUpperCase() });
  }, [slug, navigation]);

  // Try Supabase in the background; override demo data only if it returns rows.
  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      try {
        const { data: cat } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        if (active && cat) setCategory(cat);

        const categoryId = cat?.id;
        if (!categoryId) return;

        let query = supabase.from('products').select('*').eq('category_id', categoryId);
        if (sort === 'price_asc') query = query.order('price', { ascending: true });
        else if (sort === 'price_desc') query = query.order('price', { ascending: false });
        else query = query.order('name');

        const { data } = await query.limit(50);
        if (active && data && data.length > 0) {
          setProducts(data);
          setIsLive(true);
        }
      } catch {
        /* keep demo data */
      }
    })();
    return () => {
      active = false;
    };
  }, [slug, sort]);

  // Re-sort demo data locally when the sort changes (live data is server-sorted).
  useEffect(() => {
    if (!isLive) {
      setProducts(sortProducts(getDemoProductsForCategory(slug ?? ''), sort));
    }
  }, [sort, slug, isLive]);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand_code).filter((b): b is string => !!b))],
    [products]
  );

  const filtered = useMemo(
    () =>
      products.filter(
        (p) => (!inStockOnly || p.stock > 0) && (!brandFilter || p.brand_code === brandFilter)
      ),
    [products, inStockOnly, brandFilter]
  );

  return (
    <View style={styles.container}>
      {/* Filter chips */}
      <View style={styles.filterBar}>
        {brands.map((brand) => {
          const active = brandFilter === brand;
          return (
            <TouchableOpacity
              key={brand}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setBrandFilter(active ? null : brand)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {brand}{active ? ' ×' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={[styles.chip, inStockOnly && styles.chipActive]}
          onPress={() => setInStockOnly((v) => !v)}
        >
          <Text style={[styles.chipText, inStockOnly && styles.chipTextActive]}>In stock</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => setSort(SORT_CYCLE[(SORT_CYCLE.indexOf(sort) + 1) % SORT_CYCLE.length])}
        >
          <Text style={styles.chipText}>{SORT_LABEL[sort]}</Text>
        </TouchableOpacity>
      </View>

      {(
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <ProductRow product={item} />}
          removeClippedSubviews
          initialNumToRender={10}
          windowSize={7}
          maxToRenderPerBatch={10}
          ListHeaderComponent={
            category?.description ? (
              <Text style={styles.categoryDesc}>{category.description}</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No products match these filters.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 12,
    gap: 6,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.tint, borderColor: colors.navy },
  chipText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  chipTextActive: { color: colors.navy, fontWeight: '800' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: colors.muted, textAlign: 'center', fontSize: 15 },
  categoryDesc: { fontSize: 14, color: colors.muted, paddingBottom: 8 },
  list: { padding: 12, paddingBottom: 32 },
  separator: { height: 8 },
});
