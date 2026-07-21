// app/(tabs)/categories.tsx – Categories list

import { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import CategoryCard from '@/components/CategoryCard';
import { colors } from '@/lib/theme';
import { DEMO_CATEGORIES } from '@/lib/catalog';
import type { Category } from '@/lib/types';

export default function CategoriesScreen() {
  // Seed from demo data so the grid renders instantly; live data overrides.
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase.from('categories').select('*').order('name');
        if (active && data && data.length > 0) setCategories(data);
      } catch {
        /* keep demo data */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
