// app/(tabs)/orders.tsx – Order history

import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';
import type { Order } from '@/lib/types';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_STYLE: Record<Order['status'], { bg: string; text: string }> = {
  pending: { bg: '#fef9c3', text: '#a16207' },
  paid: { bg: '#dbeafe', text: colors.navy },
  shipped: { bg: '#e0e7ff', text: '#4338ca' },
  delivered: { bg: '#dcfce7', text: '#16a34a' },
  cancelled: { bg: colors.dangerBg, text: colors.danger },
};

function OrderCard({ order }: { order: Order }) {
  const style = STATUS_STYLE[order.status];
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
          <Text style={[styles.statusText, { color: style.text }]}>{order.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.orderTotal}>{formatPrice(order.total_amount)}</Text>
      <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyDesc}>Your past orders will show up here.</Text>
        <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/categories')}>
          <Text style={styles.browseBtnText}>Browse Categories</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: colors.bg },
  list: { padding: 12, backgroundColor: colors.bg, flexGrow: 1 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 14,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  orderDate: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  orderTotal: { fontSize: 18, fontWeight: '900', color: colors.ink },
  orderId: { fontSize: 12, color: colors.mutedLight, marginTop: 2 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.ink, marginBottom: 6 },
  emptyDesc: { fontSize: 14, color: colors.muted, marginBottom: 20, textAlign: 'center' },
  browseBtn: { backgroundColor: colors.navy, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 6 },
  browseBtnText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.3 },
});
