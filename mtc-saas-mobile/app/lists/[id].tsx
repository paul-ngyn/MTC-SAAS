// app/lists/[id].tsx – Saved list detail: items + add-all-to-cart

import { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';
import { getList, resolveListItems } from '@/lib/lists';
import { useCartStore } from '@/lib/cart-store';
import { getLineTotal } from '@/lib/pricing';
import type { Product } from '@/lib/types';

function unslugify(id: string) {
  return id.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const list = getList(id ?? '');
  const initialItems = useMemo(() => (list ? resolveListItems(list) : []), [list]);
  const [items, setItems] = useState(initialItems);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const listName = list?.name ?? unslugify(id ?? '');

  useMemo(() => {
    navigation.setOptions({ title: listName });
  }, [listName, navigation]);

  const updateQty = (productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleAddAll = () => {
    items.forEach((i) => addItem(i.product, i.quantity));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const total = items.reduce((sum, i) => sum + getLineTotal(i.product.price, i.product.unit, i.quantity), 0);

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(i) => i.product.id}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <ListRow item={item} onUpdateQty={updateQty} onRemove={removeItem} />
      )}
      ListHeaderComponent={
        items.length > 0 ? (
          <TouchableOpacity style={styles.addAllBtn} onPress={handleAddAll}>
            <Text style={styles.addAllBtnText}>
              {added ? '✓ Added' : `Add all to cart · ${formatPrice(total)}`}
            </Text>
          </TouchableOpacity>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>This list has no items yet.</Text>
          <Text style={styles.emptyLink} onPress={() => router.push('/(tabs)/categories')}>
            Browse the catalog →
          </Text>
        </View>
      }
    />
  );
}

function ListRow({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: { product: Product; quantity: number };
  onUpdateQty: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  const { product, quantity } = item;
  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        {product.brand_code && (
          <View style={styles.brandTag}>
            <Text style={styles.brandTagText}>{product.brand_code}</Text>
          </View>
        )}
        <Text style={styles.rowName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.rowTotal}>{formatPrice(getLineTotal(product.price, product.unit, quantity))}</Text>
      </View>
      <View style={styles.rowActions}>
        <View style={styles.qtyControl}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onUpdateQty(product.id, quantity - 1)}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onUpdateQty(product.id, quantity + 1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => onRemove(product.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={colors.mutedLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 12, paddingBottom: 32 },
  separator: { height: 8 },
  addAllBtn: { backgroundColor: colors.navy, borderRadius: 8, paddingVertical: 13, alignItems: 'center', marginBottom: 12 },
  addAllBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  rowInfo: { marginBottom: 10 },
  brandTag: { alignSelf: 'flex-start', backgroundColor: colors.tint, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1, marginBottom: 4 },
  brandTagText: { fontSize: 10, fontWeight: '800', color: colors.navy },
  rowName: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  rowTotal: { fontSize: 13, fontWeight: '900', color: colors.navy },
  rowActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 6 },
  qtyBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  qtyBtnText: { fontWeight: '800', color: colors.muted, fontSize: 15 },
  qtyValue: { fontWeight: '700', color: colors.ink, fontSize: 13, borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: colors.muted },
  emptyLink: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 12 },
});
