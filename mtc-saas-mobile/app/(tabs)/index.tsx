// app/(tabs)/index.tsx – Home screen

import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import CategoryCard from '@/components/CategoryCard';
import ProductRow from '@/components/ProductRow';
import { colors } from '@/lib/theme';
import { useCartStore } from '@/lib/cart-store';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '@/lib/catalog';
import type { Category, Product, Profile } from '@/lib/types';

// Home shows the first four categories and a couple of quick-reorder shortcuts.
const HOME_CATEGORIES = DEMO_CATEGORIES.slice(0, 4);
const DEMO_REORDER_PRODUCTS: Product[] = [
  DEMO_PRODUCTS.find((p) => p.slug === 'td-c32-150')!,
  DEMO_PRODUCTS.find((p) => p.slug === 'mtc-f18-2k')!,
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore((s) => s.itemCount());
  const [categories, setCategories] = useState<Category[]>(HOME_CATEGORIES);
  const [reorderProducts, setReorderProducts] = useState<Product[]>(DEMO_REORDER_PRODUCTS);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    supabase.from('categories').select('*').limit(4).then(({ data }) => {
      setCategories(data && data.length > 0 ? data : HOME_CATEGORIES);
    });

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) setProfile(profileData);

      // Reorder shortcuts: most recent distinct products from this user's past orders.
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (orders && orders.length > 0) {
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id, products(*)')
          .in('order_id', orders.map((o) => o.id))
          .limit(10);
        const seen = new Set<string>();
        const products: Product[] = [];
        for (const item of items ?? []) {
          const p = (item as unknown as { products: Product | null }).products;
          if (p && !seen.has(p.id)) {
            seen.add(p.id);
            products.push(p);
          }
          if (products.length >= 2) break;
        }
        if (products.length > 0) setReorderProducts(products);
      }
    });
  }, []);

  const handleSearch = useCallback(() => {
    const q = query.trim();
    if (q) router.push(`/(tabs)/search?q=${encodeURIComponent(q)}`);
  }, [query, router]);

  const isMember = !!profile?.membership_tier;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.logo}>MTC</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/(tabs)/cart')}>
          <Ionicons name="cart-outline" size={24} color={colors.ink} />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={16} color={colors.mutedLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, SKUs..."
          placeholderTextColor={colors.mutedLight}
          returnKeyType="search"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Membership banner */}
      <TouchableOpacity
        style={[styles.memberBanner, !isMember && styles.memberBannerUpsell]}
        onPress={() => router.push('/membership')}
        activeOpacity={0.85}
      >
        <Text style={[styles.memberEyebrow, !isMember && styles.memberEyebrowUpsell]}>
          {isMember ? 'MTC+ MEMBER' : 'GO MTC+'}
        </Text>
        <Text style={[styles.memberTitle, !isMember && styles.memberTitleUpsell]}>
          {isMember ? 'Free freight over $250 — Active' : 'Unlock free freight & tiered pricing'}
        </Text>
      </TouchableOpacity>

      {/* Shop by category */}
      <Text style={styles.sectionLabel}>Shop by category</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.categoryRow}
        renderItem={({ item }) => <CategoryCard category={item} />}
        scrollEnabled={false}
      />

      {/* Reorder in one tap */}
      <Text style={styles.sectionLabel}>Reorder in one tap</Text>
      <View style={styles.reorderList}>
        {reorderProducts.map((p) => (
          <ProductRow key={p.id} product={p} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 32 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logo: { fontSize: 22, fontWeight: '900', letterSpacing: 0.5, color: colors.navy },
  cartBtn: { padding: 4 },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.navy,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    marginHorizontal: 16,
    marginTop: 4,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.ink },
  memberBanner: {
    backgroundColor: colors.navyDark,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  memberBannerUpsell: { backgroundColor: colors.tint },
  memberEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#9db6e8' },
  memberEyebrowUpsell: { color: colors.navy },
  memberTitle: { fontSize: 15, fontWeight: '800', color: '#fff', marginTop: 4 },
  memberTitleUpsell: { color: colors.navy },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  categoryRow: { paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  reorderList: { paddingHorizontal: 16, gap: 8 },
});
