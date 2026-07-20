// app/products/[slug].tsx – Product detail with tiered pricing

import { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';
import { useCartStore } from '@/lib/cart-store';
import { getTiers, getTierForQty, getLineTotal } from '@/lib/pricing';
import type { Product } from '@/lib/types';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setProduct(data ?? null);
        setLoading(false);
      });
  }, [slug]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: product?.sku ? () => <Text style={styles.headerSku}>{product.sku}</Text> : undefined,
    });
  }, [navigation, product?.sku]);

  const handleAdd = useCallback(() => {
    if (!product) return;
    addItem(product, qty);
    router.back();
  }, [addItem, product, qty, router]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Product not found.</Text>
      </View>
    );
  }

  const tiers = getTiers(product.price, product.unit);
  const activeTier = getTierForQty(product.price, product.unit, qty);
  const inStock = product.stock > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>Product photo</Text>
        </View>
      )}

      <View style={styles.tagRow}>
        {product.brand_code && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{product.brand_code}</Text>
          </View>
        )}
        <View style={[styles.tag, inStock ? styles.tagInStock : styles.tagOutStock]}>
          <Text style={[styles.tagText, inStock ? styles.tagTextInStock : styles.tagTextOutStock]}>
            {inStock ? 'In stock' : 'Out of stock'}
          </Text>
        </View>
      </View>

      <Text style={styles.name}>{product.name}</Text>
      {product.description && <Text style={styles.description}>{product.description}</Text>}

      <Text style={styles.tiersLabel}>Tiered pricing</Text>
      <View style={styles.tiersBox}>
        {tiers.map((tier, i) => {
          const active = tier.minQty === activeTier.minQty;
          return (
            <View key={tier.label} style={[styles.tierRow, i > 0 && styles.tierRowBorder, active && styles.tierRowActive]}>
              <Text style={[styles.tierLabel, active && styles.tierLabelActive]}>{tier.label}</Text>
              <Text style={[styles.tierPrice, active && styles.tierPriceActive]}>{formatPrice(tier.unitPrice)}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => q + 1)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.addBtn, !inStock && styles.addBtnDisabled]}
        onPress={handleAdd}
        disabled={!inStock}
      >
        <Text style={styles.addBtnText}>
          {inStock ? `Add ${qty} · ${formatPrice(getLineTotal(product.price, product.unit, qty))}` : 'Out of stock'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.muted, fontSize: 15 },
  headerSku: { fontSize: 12, color: colors.muted, marginRight: 4 },
  photo: { width: '100%', height: 260, borderRadius: 8 },
  photoPlaceholder: {
    width: '100%',
    height: 260,
    borderRadius: 8,
    backgroundColor: colors.tint,
    borderWidth: 1,
    borderColor: colors.tintBorder,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: { color: colors.navy, fontWeight: '700', fontSize: 13 },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  tag: { backgroundColor: colors.tint, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '800', color: colors.navy },
  tagInStock: { backgroundColor: '#dcfce7' },
  tagOutStock: { backgroundColor: colors.dangerBg },
  tagTextInStock: { color: '#16a34a' },
  tagTextOutStock: { color: colors.danger },
  name: { fontSize: 19, fontWeight: '800', color: colors.ink, marginTop: 10, lineHeight: 25 },
  description: { fontSize: 13, color: colors.muted, marginTop: 6, lineHeight: 19 },
  tiersLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 22,
    marginBottom: 8,
  },
  tiersBox: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, overflow: 'hidden' },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  tierRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  tierRowActive: { backgroundColor: colors.tint },
  tierLabel: { fontSize: 14, color: '#374151' },
  tierLabelActive: { fontWeight: '800', color: colors.navy },
  tierPrice: { fontSize: 14, fontWeight: '700', color: colors.ink },
  tierPriceActive: { color: colors.navy, fontWeight: '900' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20, alignSelf: 'flex-start' },
  qtyBtn: {
    width: 40, height: 40,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#374151' },
  qtyValue: { fontSize: 18, fontWeight: '800', color: colors.ink, minWidth: 28, textAlign: 'center' },
  addBtn: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addBtnDisabled: { backgroundColor: colors.mutedLight },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
