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
import type { Profile } from '@/lib/types';

const TIER_LABEL: Record<string, string> = {
  basic: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export default function AccountScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1c51a3" />
      </View>
    );
  }

  const tier = profile?.membership_tier;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar placeholder */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? profile?.email?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name ?? 'User'}</Text>
        {profile?.company_name && (
          <Text style={styles.company}>{profile.company_name}</Text>
        )}
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      {/* Membership */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Membership</Text>
        {tier ? (
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{TIER_LABEL[tier] ?? tier}</Text>
          </View>
        ) : (
          <Text style={styles.noTier}>No active plan</Text>
        )}
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() => router.push('/membership')}
        >
          <Text style={styles.manageBtnText}>
            {tier ? 'Manage Membership' : 'Upgrade to a Plan'}
          </Text>
        </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#fff', marginBottom: 16 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#1c51a3',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: { fontSize: 32, fontWeight: '700', color: '#fff' },
  name: { fontSize: 20, fontWeight: '700', color: '#111827' },
  company: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  email: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  tierText: { color: '#1c51a3', fontWeight: '700', fontSize: 13 },
  noTier: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  manageBtn: {
    borderWidth: 1.5,
    borderColor: '#1c51a3',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  manageBtnText: { color: '#1c51a3', fontWeight: '700', fontSize: 14 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  actionText: { fontSize: 15, color: '#111827' },
  actionChevron: { fontSize: 20, color: '#9ca3af' },
  cardDivider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
  signOutBtn: {
    marginHorizontal: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ef4444',
  },
  signOutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
});
