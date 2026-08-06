// app/(tabs)/cart.tsx – Cart & checkout, with tiered bulk pricing

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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useCartStore } from '@/lib/cart-store';
import { memo, useMemo, useState } from 'react';
import { colors } from '@/lib/theme';
import { getEffectiveUnitPrice, getLineTotal, getLineSavings, getNextTier } from '@/lib/pricing';
import { FREE_FREIGHT_THRESHOLD, FLAT_FREIGHT } from '@/lib/catalog';
import type { CartItem } from '@/lib/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const CartItemRow = memo(function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { product, quantity } = item;
  const savings = getLineSavings(product.price, product.unit, quantity);
  const nextTier = getNextTier(product.price, product.unit, quantity);

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
        {savings > 0 ? (
          <Text style={styles.tierNote}>
            Bulk tier — {formatPrice(savings)} off / {product.unit}
          </Text>
        ) : nextTier ? (
          <Text style={styles.tierHint}>
            Add {nextTier.minQty - quantity} more for {formatPrice(nextTier.unitPrice)}/{product.unit}
          </Text>
        ) : null}
      </View>
      <Text style={styles.itemTotal}>{formatPrice(getLineTotal(product.price, product.unit, quantity))}</Text>
    </View>
  );
});

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const listSubtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );
  const tieredTotal = useMemo(
    () => items.reduce((sum, item) => sum + getLineTotal(item.product.price, item.product.unit, item.quantity), 0),
    [items]
  );
  const bulkSavings = listSubtotal - tieredTotal;
  const freightFree = tieredTotal >= FREE_FREIGHT_THRESHOLD;
  const freight = freightFree ? 0 : FLAT_FREIGHT;
  const total = tieredTotal + freight;

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
            price: getEffectiveUnitPrice(product.price, product.unit, quantity),
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

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Cart · {itemCount} item{itemCount === 1 ? '' : 's'}</Text>
        <View style={{ width: 24 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>Browse categories to add products.</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/categories')}>
            <Text style={styles.browseBtnText}>Browse Categories</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            renderItem={({ item }) => <CartItemRow item={item} />}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            removeClippedSubviews
            initialNumToRender={8}
            windowSize={7}
            maxToRenderPerBatch={8}
          />
          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(listSubtotal)}</Text>
            </View>
            {bulkSavings > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelSavings}>Bulk-tier savings</Text>
                <Text style={styles.summaryValueSavings}>−{formatPrice(bulkSavings)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Freight</Text>
              <Text style={styles.summaryValue}>{freightFree ? 'Free' : formatPrice(freight)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.checkoutBtn, loading && styles.checkoutBtnDisabled]}
              onPress={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkoutBtnText}>Checkout</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  topBarTitle: { fontSize: 15, fontWeight: '800', letterSpacing: 0.3, textTransform: 'uppercase', color: colors.ink },
  list: { padding: 12, paddingBottom: 8 },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: 'flex-start',
  },
  itemImage: { width: 60, height: 60, borderRadius: 6, marginRight: 12 },
  itemImagePlaceholder: { backgroundColor: colors.tint, justifyContent: 'center', alignItems: 'center' },
  itemImagePlaceholderText: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28, height: 28,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  qtyValue: { fontSize: 15, fontWeight: '700', color: colors.ink, minWidth: 20, textAlign: 'center' },
  removeBtn: { marginLeft: 8 },
  removeBtnText: { fontSize: 12, color: colors.danger, fontWeight: '600' },
  tierNote: { fontSize: 11, fontWeight: '700', color: colors.navy, marginTop: 6 },
  tierHint: { fontSize: 11, color: colors.muted, marginTop: 6 },
  itemTotal: { fontSize: 14, fontWeight: '800', color: colors.navy, marginLeft: 8 },
  summary: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 20,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#374151' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: colors.ink },
  summaryLabelSavings: { fontSize: 14, color: colors.navy, fontWeight: '600' },
  summaryValueSavings: { fontSize: 14, fontWeight: '700', color: colors.navy },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 2, marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.ink },
  totalValue: { fontSize: 18, fontWeight: '900', color: colors.ink },
  checkoutBtn: {
    backgroundColor: colors.navy,
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutBtnDisabled: { opacity: 0.6 },
  checkoutBtnText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: colors.ink, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.muted, marginBottom: 24, textAlign: 'center' },
  browseBtn: { backgroundColor: colors.navy, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 6 },
  browseBtnText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.3 },
});
