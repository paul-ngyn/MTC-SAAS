// app/categories/[slug].tsx – Browse: products in a category, with filter chips

import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '@/lib/supabase';
import ProductRow from '@/components/ProductRow';
import { colors } from '@/lib/theme';
import type { Category, Product } from '@/lib/types';

type SortKey = 'name' | 'price_asc' | 'price_desc';
const SORT_CYCLE: SortKey[] = ['name', 'price_asc', 'price_desc'];
const SORT_LABEL: Record<SortKey, string> = { name: 'Name', price_asc: 'Price ↑', price_desc: 'Price ↓' };

export default function CategoryProductsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('name');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        const cat: Category = data ?? {
          id: 'fallback',
          name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          slug,
          description: null,
          image_url: null,
        };
        setCategoryId(data?.id ?? 'fallback');
        setCategory(cat);
        navigation.setOptions({ title: cat.name.toUpperCase() });
      });
  }, [slug]);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);

    let query = supabase.from('products').select('*').eq('category_id', categoryId);
    if (sort === 'name') query = query.order('name');
    else if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else query = query.order('price', { ascending: false });

    query
      .limit(50)
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, [categoryId, sort]);

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

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.navy} />
        </View>
      ) : (
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
