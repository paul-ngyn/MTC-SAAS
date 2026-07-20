// app/(tabs)/search.tsx – Search products

import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import ProductRow from '@/components/ProductRow';
import { colors } from '@/lib/theme';
import type { Product } from '@/lib/types';

export default function SearchScreen() {
  const { q: initialQ } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(initialQ ?? '');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${q.trim()}%`)
      .limit(30);
    setResults(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialQ) runSearch(initialQ);
  }, [initialQ, runSearch]);

  const handleSearch = () => runSearch(query);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search 1,600+ products, SKUs..."
          placeholderTextColor={colors.mutedLight}
          returnKeyType="search"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.navy} />
        </View>
      )}

      {!loading && searched && results.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No products found for "{query}"</Text>
        </View>
      )}

      {!loading && !searched && (
        <View style={styles.center}>
          <Text style={styles.hintText}>Type a product name to search</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <ProductRow product={item} />}
        removeClippedSubviews
        initialNumToRender={8}
        windowSize={7}
        maxToRenderPerBatch={8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.bg,
  },
  searchBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: 18,
    borderRadius: 6,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 0.3 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { color: colors.muted, fontSize: 15, textAlign: 'center' },
  hintText: { color: colors.mutedLight, fontSize: 15 },
  list: { padding: 12, paddingBottom: 32 },
});
