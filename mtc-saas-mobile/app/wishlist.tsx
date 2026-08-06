// app/wishlist.tsx – Wishlist: favorited products

import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';
import { DEMO_PRODUCTS } from '@/lib/catalog';
import { DEMO_WISHLIST_PRODUCT_IDS } from '@/lib/wishlist';
import ProductRow from '@/components/ProductRow';

export default function WishlistScreen() {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>(DEMO_WISHLIST_PRODUCT_IDS);
  const products = ids
    .map((id) => DEMO_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <FlatList
      style={styles.container}
      data={products}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => <ProductRow product={item} />}
      ListHeaderComponent={<Text style={styles.subtitle}>Products you've favorited to buy later.</Text>}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={40} color={colors.mutedLight} />
          <Text style={styles.emptyText}>Your wishlist is empty.</Text>
          <Text style={styles.emptyLink} onPress={() => router.push('/(tabs)/categories')}>
            Browse the catalog →
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: 12, paddingBottom: 32 },
  subtitle: { fontSize: 13, color: colors.muted, marginBottom: 12, paddingHorizontal: 2 },
  separator: { height: 8 },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyText: { fontSize: 14, color: colors.muted, marginTop: 12 },
  emptyLink: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 14 },
});
