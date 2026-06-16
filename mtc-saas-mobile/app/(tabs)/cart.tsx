// app/(tabs)/cart.tsx – Shopping cart screen

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCartStore } from '@/lib/cart-store';
import { useState } from 'react';
import type { CartItem } from '@/lib/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <View style={styles.itemRow}>
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
          <Text style={styles.itemImagePlaceholderText}>📦</Text>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(product.price)} / {product.unit}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(product.id, quantity - 1)}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(product.id, quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(product.id)}>
            <Text style={styles.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemTotal}>{formatPrice(product.price * quantity)}</Text>
    </View>
  );
}

export default function CartScreen() {
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image_url,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Checkout failed');
      // Open Stripe Checkout in the device browser
      const result = await WebBrowser.openBrowserAsync(data.url);
      if (result.type === 'dismiss') {
        // User may have completed or cancelled — clear cart optimistically
        Alert.alert(
          'Order placed?',
          'If your payment was successful, your order is confirmed.',
          [
            { text: 'Clear Cart', onPress: () => clearCart() },
            { text: 'Keep Cart', style: 'cancel' },
          ]
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Checkout error', message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyDesc}>Browse categories to add products.</Text>
        <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/categories')}>
          <Text style={styles.browseBtnText}>Browse Categories</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        renderItem={({ item }) => <CartItemRow item={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</Text>
          <Text style={styles.summaryValue}>{formatPrice(total())}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, loading && styles.checkoutBtnDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 12, paddingBottom: 8 },
  separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 4 },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'flex-start',
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  itemImagePlaceholder: { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  itemImagePlaceholderText: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 3 },
  itemPrice: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28, height: 28,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  qtyValue: { fontSize: 15, fontWeight: '700', color: '#111827', minWidth: 20, textAlign: 'center' },
  removeBtn: { marginLeft: 8 },
  removeBtnText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  itemTotal: { fontSize: 14, fontWeight: '700', color: '#1c51a3', marginLeft: 8 },
  summary: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryLabel: { fontSize: 15, color: '#374151' },
  summaryValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
  checkoutBtn: {
    backgroundColor: '#1c51a3',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutBtnDisabled: { opacity: 0.6 },
  checkoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  browseBtn: { backgroundColor: '#1c51a3', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
