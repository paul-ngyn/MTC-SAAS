// app/(tabs)/index.tsx – Home screen

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import CategoryCard from '@/components/CategoryCard';
import type { Category } from '@/lib/types';

const VALUE_PROPS = [
  { icon: '💰', title: 'Wholesale Pricing', desc: 'Member-exclusive bulk rates on thousands of SKUs.' },
  { icon: '🚚', title: 'Fast Fulfillment', desc: 'Same-day processing on orders placed before 2 PM EST.' },
  { icon: '🌐', title: 'Distributor Network', desc: 'Vetted suppliers and trusted distributors nationwide.' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setCategories(data);
        else {
          // Fallback demo categories
          setCategories([
            { id: '1', name: 'Kitchen Equipment', slug: 'kitchen-equipment', description: null, image_url: null },
            { id: '2', name: 'Disposables', slug: 'disposables', description: null, image_url: null },
            { id: '3', name: 'Smallwares', slug: 'smallwares', description: null, image_url: null },
            { id: '4', name: 'Refrigeration', slug: 'refrigeration', description: null, image_url: null },
            { id: '5', name: 'Cleaning Supplies', slug: 'cleaning-supplies', description: null, image_url: null },
            { id: '6', name: 'Food Storage', slug: 'food-storage', description: null, image_url: null },
          ]);
        }
      });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>The Central Hub for Restaurant Supply Distributors</Text>
        <Text style={styles.heroSub}>
          Wholesale pricing, bulk ordering, and membership discounts — all in one place.
        </Text>
        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.heroBtnPrimary}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Text style={styles.heroBtnPrimaryText}>Browse Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heroBtnSecondary}
            onPress={() => router.push('/membership')}
          >
            <Text style={styles.heroBtnSecondaryText}>View Membership</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Value Props */}
      <View style={styles.section}>
        {VALUE_PROPS.map((vp) => (
          <View key={vp.title} style={styles.valueProp}>
            <Text style={styles.valuePropIcon}>{vp.icon}</Text>
            <View style={styles.valuePropText}>
              <Text style={styles.valuePropTitle}>{vp.title}</Text>
              <Text style={styles.valuePropDesc}>{vp.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Featured Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Categories</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.categoryRow}
        renderItem={({ item }) => <CategoryCard category={item} />}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { paddingBottom: 32 },
  hero: {
    backgroundColor: '#1c51a3',
    padding: 28,
    paddingTop: 48,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: '#d4e2f5',
    lineHeight: 20,
    marginBottom: 20,
  },
  heroActions: { flexDirection: 'row', gap: 10 },
  heroBtnPrimary: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  heroBtnPrimaryText: { color: '#163d7d', fontWeight: '700', fontSize: 13 },
  heroBtnSecondary: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  heroBtnSecondaryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  section: { backgroundColor: '#fff', padding: 20, marginBottom: 8 },
  valueProp: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  valuePropIcon: { fontSize: 24, marginRight: 14, marginTop: 2 },
  valuePropText: { flex: 1 },
  valuePropTitle: { fontWeight: '700', fontSize: 15, color: '#111827', marginBottom: 2 },
  valuePropDesc: { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  seeAll: { fontSize: 14, color: '#1c51a3', fontWeight: '600' },
  categoryRow: { paddingHorizontal: 12, gap: 8, marginBottom: 8 },
});
