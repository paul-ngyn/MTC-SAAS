// app/(tabs)/search.tsx – Search products

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${q}%`)
      .limit(30);
    setResults(data ?? []);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          placeholderTextColor="#9ca3af"
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
          <ActivityIndicator color="#1c51a3" />
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
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  searchBtn: {
    backgroundColor: '#1c51a3',
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { color: '#6b7280', fontSize: 15, textAlign: 'center' },
  hintText: { color: '#9ca3af', fontSize: 15 },
  list: { padding: 12, paddingBottom: 32 },
  row: { gap: 8, marginBottom: 8 },
});
