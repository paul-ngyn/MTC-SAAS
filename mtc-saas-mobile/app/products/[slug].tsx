// app/products/[slug].tsx – Product detail screen

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cart-store';
import type { Product } from '@/lib/types';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setProduct(data);
        if (data) navigation.setOptions({ title: data.name });
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1c51a3" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    Alert.alert('Added to cart', `${quantity}× ${product.name} added.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Image */}
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderIcon}>📦</Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.unit}>/ {product.unit}</Text>
        </View>

        {/* Stock badge */}
        <View style={[styles.stockBadge, !inStock && styles.stockBadgeOut]}>
          <Text style={[styles.stockText, !inStock && styles.stockTextOut]}>
            {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </Text>
        </View>

        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}

        {/* Quantity selector */}
        {inStock && (
          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtotalHint}>
              Subtotal: {formatPrice(product.price * quantity)}
            </Text>
          </View>
        )}

        {/* Add to cart */}
        <TouchableOpacity
          style={[styles.addBtn, !inStock && styles.addBtnDisabled]}
          onPress={handleAddToCart}
          disabled={!inStock}
        >
          <Text style={styles.addBtnText}>
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  errorText: { color: '#6b7280', fontSize: 16 },
  image: { width: '100%', height: 260 },
  imagePlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderIcon: { fontSize: 64 },
  info: { padding: 20 },
  name: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  price: { fontSize: 26, fontWeight: '900', color: '#1c51a3' },
  unit: { fontSize: 14, color: '#6b7280', marginLeft: 4 },
  stockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  stockBadgeOut: { backgroundColor: '#fee2e2' },
  stockText: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  stockTextOut: { color: '#dc2626' },
  description: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 20 },
  qtySection: { marginBottom: 20 },
  qtyLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 36, height: 36,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 20, fontWeight: '600', color: '#374151' },
  qtyValue: { fontSize: 18, fontWeight: '700', color: '#111827', minWidth: 28, textAlign: 'center' },
  subtotalHint: { fontSize: 13, color: '#6b7280', marginTop: 10 },
  addBtn: {
    backgroundColor: '#1c51a3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnDisabled: { backgroundColor: '#d1d5db' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
