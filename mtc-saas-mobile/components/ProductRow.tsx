// components/ProductRow.tsx – Horizontal product list item
// Used on the Home "Reorder in one tap" section and the Browse listing.

import { memo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { Product } from '@/lib/types';
import { colors } from '@/lib/theme';
import { useCartStore } from '@/lib/cart-store';
import { getTiers, getEffectiveUnitPrice } from '@/lib/pricing';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const inStock = product.stock > 0;
  const bulkTier = getTiers(product.price, product.unit).at(-1)!;
  const unitPrice = getEffectiveUnitPrice(product.price, product.unit, 1);

  const handlePress = useCallback(() => {
    router.push(`/products/${product.slug}`);
  }, [product.slug, router]);
  const handleAdd = useCallback(() => {
    addItem(product);
  }, [addItem, product]);

  return (
    <TouchableOpacity style={styles.row} onPress={handlePress} activeOpacity={0.7}>
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Photo</Text>
        </View>
      )}

      <View style={styles.info}>
        {(product.brand_code || product.sku) && (
          <View style={styles.metaRow}>
            {product.brand_code && (
              <View style={styles.brandTag}>
                <Text style={styles.brandTagText}>{product.brand_code}</Text>
              </View>
            )}
            {product.sku && <Text style={styles.sku}>{product.sku}</Text>}
          </View>
        )}
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(unitPrice)}</Text>
          <Text style={styles.unit}>/{product.unit}</Text>
          <Text style={styles.hint}>  {bulkTier.minQty}+ at {formatPrice(bulkTier.unitPrice)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addBtn, !inStock && styles.addBtnDisabled]}
        onPress={handleAdd}
        disabled={!inStock}
        activeOpacity={0.85}
      >
        <Text style={styles.addBtnText}>{inStock ? 'Add' : '—'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default memo(ProductRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 10,
    gap: 10,
  },
  image: { width: 52, height: 52, borderRadius: 4 },
  imagePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 4,
    backgroundColor: colors.tint,
    borderWidth: 1,
    borderColor: colors.tintBorder,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: { fontSize: 9, fontWeight: '700', color: colors.navy },
  info: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  brandTag: { backgroundColor: colors.tint, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1 },
  brandTagText: { fontSize: 10, fontWeight: '800', color: colors.navy },
  sku: { fontSize: 10, color: colors.mutedLight },
  name: { fontSize: 13, fontWeight: '600', color: colors.ink, lineHeight: 17 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', marginTop: 2 },
  price: { fontSize: 14, fontWeight: '900', color: colors.navy },
  unit: { fontSize: 11, color: colors.mutedLight },
  hint: { fontSize: 10, color: colors.muted },
  addBtn: {
    backgroundColor: colors.navy,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBtnDisabled: { backgroundColor: colors.mutedLight },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
