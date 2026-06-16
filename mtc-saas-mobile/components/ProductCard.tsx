// components/ProductCard.tsx

import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { Product } from '@/lib/types';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const inStock = product.stock > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/products/${product.slug}`)}
      activeOpacity={0.85}
    >
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderIcon}>📦</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.unit}>per {product.unit}</Text>
        {!inStock && (
          <View style={styles.outBadge}>
            <Text style={styles.outBadgeText}>Out of stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: { width: '100%', height: 110 },
  imagePlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderIcon: { fontSize: 30 },
  info: { padding: 10 },
  name: { fontSize: 13, fontWeight: '600', color: '#111827', lineHeight: 18, marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '800', color: '#1c51a3' },
  unit: { fontSize: 11, color: '#9ca3af' },
  outBadge: {
    marginTop: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outBadgeText: { fontSize: 10, color: '#dc2626', fontWeight: '600' },
});
