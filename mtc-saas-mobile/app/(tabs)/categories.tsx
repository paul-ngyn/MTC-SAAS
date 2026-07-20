// app/(tabs)/categories.tsx – Categories list

import { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import CategoryCard from '@/components/CategoryCard';
import { colors } from '@/lib/theme';
import type { Category } from '@/lib/types';

const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Kitchen Equipment', slug: 'kitchen-equipment', description: 'Commercial ranges, fryers, and ovens.', image_url: null },
  { id: '2', name: 'Disposables', slug: 'disposables', description: 'Cups, containers, and packaging.', image_url: null },
  { id: '3', name: 'Smallwares', slug: 'smallwares', description: 'Pots, pans, and utensils.', image_url: null },
  { id: '4', name: 'Refrigeration', slug: 'refrigeration', description: 'Coolers, freezers, and reach-ins.', image_url: null },
  { id: '5', name: 'Cleaning Supplies', slug: 'cleaning-supplies', description: 'Chemicals, mops, and brooms.', image_url: null },
  { id: '6', name: 'Food Storage', slug: 'food-storage', description: 'Containers, shelving, and wraps.', image_url: null },
];

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setCategories(data && data.length > 0 ? data : DEMO_CATEGORIES);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => <CategoryCard category={item} />}
      removeClippedSubviews
      initialNumToRender={8}
      windowSize={7}
      maxToRenderPerBatch={8}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Categories</Text>
          <Text style={styles.headerSub}>{categories.length} categories available</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 12, paddingBottom: 32 },
  row: { gap: 8, marginBottom: 8 },
  header: { paddingHorizontal: 4, paddingTop: 8, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 0.2, color: colors.ink },
  headerSub: { fontSize: 13, color: colors.muted, marginTop: 4 },
});
