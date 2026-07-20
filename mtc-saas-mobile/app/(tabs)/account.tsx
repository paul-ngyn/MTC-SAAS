// app/(tabs)/account.tsx – Account / profile screen

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';
import { useReorderStore, CADENCE_LABEL, type Cadence } from '@/lib/reorder-store';
import type { Profile, Product } from '@/lib/types';

const TIER_LABEL: Record<string, string> = {
  basic: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const REORDER_CANDIDATES: Pick<Product, 'id' | 'name' | 'unit'>[] = [
  { id: 'demo-1', name: '32 oz Round Container, Case of 150', unit: 'case' },
  { id: 'demo-2', name: '18" Food Film Wrap, 2000 ft Roll', unit: 'roll' },
  { id: 'demo-3', name: 'Degreaser 5 gal', unit: 'pail' },
];
const CADENCES: Cadence[] = ['weekly', 'biweekly', 'monthly'];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AccountScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedViaTiers, setSavedViaTiers] = useState(0);
  const [addingSchedule, setAddingSchedule] = useState(false);
  const [pickedProduct, setPickedProduct] = useState(REORDER_CANDIDATES[0]);
  const [pickedCadence, setPickedCadence] = useState<Cadence>('weekly');

  const schedules = useReorderStore((s) => s.schedules);
  const addSchedule = useReorderStore((s) => s.addSchedule);
  const skipNext = useReorderStore((s) => s.skipNext);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(
        data ?? {
          id: user.id,
          email: user.email ?? '',
          full_name: user.user_metadata?.full_name ?? null,
          company_name: user.user_metadata?.company_name ?? null,
          membership_tier: null,
          stripe_customer_id: null,
        }
      );

      // Real lifetime savings: sum of (current list price − price actually paid) across past orders.
      const { data: orders } = await supabase.from('orders').select('id').eq('user_id', user.id);
      if (orders && orders.length > 0) {
        const { data: items } = await supabase
          .from('order_items')
          .select('quantity, unit_price, products(price)')
          .in('order_id', orders.map((o) => o.id));
        const total = (items ?? []).reduce((sum, item) => {
          const currentPrice = (item as unknown as { products: { price: number } | null }).products?.price;
          if (currentPrice == null) return sum;
          return sum + Math.max(0, currentPrice - item.unit_price) * item.quantity;
        }, 0);
        setSavedViaTiers(total);
      }

      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          // Root layout redirects to sign-in
        },
      },
    ]);
  };

  const handleAddSchedule = () => {
    addSchedule({ productId: pickedProduct.id, productName: pickedProduct.name, unit: pickedProduct.unit, quantity: 1, cadence: pickedCadence });
    setAddingSchedule(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  const tier = profile?.membership_tier;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? profile?.email?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name ?? 'User'}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      {/* MTC+ status card */}
      {tier ? (
        <View style={styles.memberCard}>
          <Text style={styles.memberEyebrow}>MTC+ {TIER_LABEL[tier] ?? tier} · Active</Text>
          <Text style={styles.memberCompany}>{profile?.company_name ?? profile?.full_name ?? 'Your account'}</Text>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatPrice(savedViaTiers)}</Text>
              <Text style={styles.statLabel}>Saved via tiers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>Free</Text>
              <Text style={styles.statLabel}>Freight over $250</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{schedules.length}</Text>
              <Text style={styles.statLabel}>Auto-reorders</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Membership</Text>
          <Text style={styles.noTier}>No active plan</Text>
          <TouchableOpacity style={styles.manageBtn} onPress={() => router.push('/membership')}>
            <Text style={styles.manageBtnText}>Upgrade to a Plan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Auto-reorder schedules */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Auto-reorder schedules</Text>
        {schedules.length === 0 && <Text style={styles.noTier}>No schedules yet.</Text>}
        {schedules.map((s) => (
          <View key={s.id} style={styles.scheduleRow}>
            <View style={styles.scheduleInfo}>
              <View style={styles.scheduleTitleRow}>
                <Text style={styles.scheduleName} numberOfLines={1}>
                  {s.productName} · {s.quantity} {s.unit}
                </Text>
                <View style={styles.cadenceBadge}>
                  <Text style={styles.cadenceBadgeText}>{CADENCE_LABEL[s.cadence]}</Text>
                </View>
              </View>
              <Text style={styles.scheduleNext}>Next delivery {formatDate(s.nextDate)}</Text>
            </View>
            <TouchableOpacity onPress={() => skipNext(s.id)}>
              <Text style={styles.skipLink}>Skip next</Text>
            </TouchableOpacity>
          </View>
        ))}

        {addingSchedule ? (
          <View style={styles.addForm}>
            <Text style={styles.addFormLabel}>Product</Text>
            <View style={styles.chipRow}>
              {REORDER_CANDIDATES.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.pickChip, pickedProduct.id === p.id && styles.pickChipActive]}
                  onPress={() => setPickedProduct(p)}
                >
                  <Text style={[styles.pickChipText, pickedProduct.id === p.id && styles.pickChipTextActive]} numberOfLines={1}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.addFormLabel}>Cadence</Text>
            <View style={styles.chipRow}>
              {CADENCES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.pickChip, pickedCadence === c && styles.pickChipActive]}
                  onPress={() => setPickedCadence(c)}
                >
                  <Text style={[styles.pickChipText, pickedCadence === c && styles.pickChipTextActive]}>
                    {CADENCE_LABEL[c]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleAddSchedule}>
              <Text style={styles.confirmBtnText}>Add schedule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setAddingSchedule(true)}>
            <Text style={styles.addScheduleLink}>+ Put a SKU on a schedule</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Actions */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/membership')}>
          <Text style={styles.actionText}>View Membership Plans</Text>
          <Text style={styles.actionChevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.cardDivider} />
        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/(tabs)/cart')}>
          <Text style={styles.actionText}>My Cart</Text>
          <Text style={styles.actionChevron}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: colors.surface, marginBottom: 16 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.navy,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: { fontSize: 32, fontWeight: '700', color: '#fff' },
  name: { fontSize: 20, fontWeight: '700', color: colors.ink },
  email: { fontSize: 13, color: colors.mutedLight, marginTop: 4 },
  memberCard: {
    backgroundColor: colors.navyDark,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
  },
  memberEyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, color: '#9db6e8', textTransform: 'uppercase' },
  memberCompany: { fontSize: 19, fontWeight: '900', color: '#fff', marginTop: 4, marginBottom: 16 },
  statRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 14 },
  stat: { flex: 1 },
  statValue: { fontSize: 16, fontWeight: '900', color: '#fff' },
  statLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase', color: '#9db6e8', marginTop: 3 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  cardLabel: { fontSize: 12, fontWeight: '800', color: colors.mutedLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  noTier: { fontSize: 14, color: colors.muted, marginBottom: 12 },
  manageBtn: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  manageBtnText: { color: colors.navy, fontWeight: '700', fontSize: 14 },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scheduleInfo: { flex: 1, marginRight: 8 },
  scheduleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scheduleName: { fontSize: 13, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  cadenceBadge: { backgroundColor: colors.tint, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  cadenceBadgeText: { fontSize: 10, fontWeight: '800', color: colors.navy },
  scheduleNext: { fontSize: 12, color: colors.muted, marginTop: 2 },
  skipLink: { fontSize: 12, fontWeight: '700', color: colors.navy },
  addScheduleLink: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 10 },
  addForm: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  addFormLabel: { fontSize: 11, fontWeight: '700', color: colors.mutedLight, textTransform: 'uppercase', marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  pickChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, maxWidth: 200 },
  pickChipActive: { borderColor: colors.navy, backgroundColor: colors.tint },
  pickChipText: { fontSize: 12, color: '#374151' },
  pickChipTextActive: { color: colors.navy, fontWeight: '700' },
  confirmBtn: { backgroundColor: colors.navy, borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  actionText: { fontSize: 15, color: colors.ink },
  actionChevron: { fontSize: 20, color: colors.mutedLight },
  cardDivider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  signOutBtn: {
    marginHorizontal: 16,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  signOutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
});
