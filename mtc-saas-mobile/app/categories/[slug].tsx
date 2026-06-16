// app/categories/[slug].tsx – Products in a category

import { useEffect, useState } from 'react';
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
import ProductCard from '@/components/ProductCard';
import type { Category, Product } from '@/lib/types';

type SortKey = 'name' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'price_asc', label: 'Price ↑' },
  { key: 'price_desc', label: 'Price ↓' },
];

export default function CategoryProductsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('name');

  useEffect(() => {
    if (!slug) return;
    // Fetch category
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
        setCategory(cat);
        navigation.setOptions({ title: cat.name });
      });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()
      .then(({ data: catData }) => {
        const categoryId = catData?.id ?? 'fallback';

        let query = supabase.from('products').select('*').eq('category_id', categoryId);
        if (sort === 'name') query = query.order('name');
        else if (sort === 'price_asc') query = query.order('price', { ascending: true });
        else query = query.order('price', { ascending: false });

        return query.limit(50);
      })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, [slug, sort]);

  return (
    <View style={styles.container}>
      {/* Sort bar */}
      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortBtn, sort === opt.key && styles.sortBtnActive]}
            onPress={() => setSort(opt.key)}
          >
            <Text style={[styles.sortBtnText, sort === opt.key && styles.sortBtnTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1c51a3" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <ProductCard product={item} />}
          ListHeaderComponent={
            category?.description ? (
              <Text style={styles.categoryDesc}>{category.description}</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No products found in this category yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sortLabel: { fontSize: 13, color: '#6b7280', marginRight: 4 },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  sortBtnActive: { backgroundColor: '#1c51a3' },
  sortBtnText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  sortBtnTextActive: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { color: '#6b7280', textAlign: 'center', fontSize: 15 },
  categoryDesc: { fontSize: 14, color: '#6b7280', padding: 12, paddingBottom: 4 },
  list: { padding: 12, paddingBottom: 32 },
  row: { gap: 8, marginBottom: 8 },
});
