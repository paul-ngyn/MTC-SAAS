// app/membership.tsx – Membership / Pricing screen

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

type BillingCycle = 'monthly' | 'yearly';

const PLANS = [
  {
    id: 'basic',
    name: 'Starter',
    description: 'Perfect for small operations just getting started.',
    monthly: 4900,
    yearly: 47000,
    priceIdMonthly: process.env.EXPO_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY ?? '',
    priceIdYearly: process.env.EXPO_PUBLIC_STRIPE_PRICE_BASIC_YEARLY ?? '',
    features: [
      'Access to all product categories',
      'Standard wholesale pricing',
      'Up to 10 orders / month',
      'Email support',
    ],
    highlighted: false,
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing restaurants and foodservice operators.',
    monthly: 9900,
    yearly: 95000,
    priceIdMonthly: process.env.EXPO_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? '',
    priceIdYearly: process.env.EXPO_PUBLIC_STRIPE_PRICE_PRO_YEARLY ?? '',
    features: [
      'Everything in Starter',
      'Pro wholesale pricing (5–15% off)',
      'Unlimited orders / month',
      'Priority email + phone support',
      'Early access to new products',
      'Bulk order discounts',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom pricing for large chains and distributors.',
    monthly: 24900,
    yearly: 239000,
    priceIdMonthly: process.env.EXPO_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY ?? '',
    priceIdYearly: process.env.EXPO_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY ?? '',
    features: [
      'Everything in Pro',
      'Enterprise pricing (15–30% off)',
      'Dedicated account manager',
      'Custom invoicing & NET-30 terms',
      'API access for ERP integration',
      'White-glove onboarding',
    ],
    highlighted: false,
    badge: null,
  },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function MembershipScreen() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: (typeof PLANS)[0]) => {
    const priceId = cycle === 'monthly' ? plan.priceIdMonthly : plan.priceIdYearly;
    if (!priceId) {
      Alert.alert('Not configured', 'This plan is not yet configured. Set up Stripe Price IDs first.');
      return;
    }
    setLoadingPlan(plan.id);
    try {
      const res = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Subscribe failed');
      await WebBrowser.openBrowserAsync(data.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Error', message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Membership Plans</Text>
        <Text style={styles.headerSub}>Save up to 30% with wholesale membership pricing</Text>
      </View>

      {/* Billing toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, cycle === 'monthly' && styles.toggleBtnActive]}
          onPress={() => setCycle('monthly')}
        >
          <Text style={[styles.toggleText, cycle === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, cycle === 'yearly' && styles.toggleBtnActive]}
          onPress={() => setCycle('yearly')}
        >
          <Text style={[styles.toggleText, cycle === 'yearly' && styles.toggleTextActive]}>
            Yearly {'  '}
            <Text style={styles.saveBadge}>Save ~20%</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Plans */}
      {PLANS.map((plan) => (
        <View
          key={plan.id}
          style={[styles.planCard, plan.highlighted && styles.planCardHighlighted]}
        >
          {plan.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{plan.badge}</Text>
            </View>
          )}
          <Text style={[styles.planName, plan.highlighted && styles.planNameHighlighted]}>
            {plan.name}
          </Text>
          <Text style={styles.planDesc}>{plan.description}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.planPrice, plan.highlighted && styles.planPriceHighlighted]}>
              {formatPrice(cycle === 'monthly' ? plan.monthly : plan.yearly)}
            </Text>
            <Text style={styles.planPeriod}>/{cycle === 'monthly' ? 'mo' : 'yr'}</Text>
          </View>

          {plan.features.map((feat) => (
            <View key={feat} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.subscribeBtn, plan.highlighted && styles.subscribeBtnHighlighted, loadingPlan === plan.id && styles.subscribeBtnDisabled]}
            onPress={() => handleSubscribe(plan)}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === plan.id ? (
              <ActivityIndicator color={plan.highlighted ? '#1c51a3' : '#fff'} />
            ) : (
              <Text style={[styles.subscribeBtnText, plan.highlighted && styles.subscribeBtnTextHighlighted]}>
                Get Started
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { paddingBottom: 48 },
  header: { padding: 24, paddingBottom: 8, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 6 },
  headerSub: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  toggleRow: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  toggleText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  toggleTextActive: { color: '#111827', fontWeight: '700' },
  saveBadge: { color: '#16a34a', fontWeight: '700', fontSize: 11 },
  planCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  planCardHighlighted: { borderColor: '#1c51a3', borderWidth: 2 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1c51a3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  planName: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 },
  planNameHighlighted: { color: '#1c51a3' },
  planDesc: { fontSize: 13, color: '#6b7280', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 16 },
  planPrice: { fontSize: 34, fontWeight: '900', color: '#111827' },
  planPriceHighlighted: { color: '#1c51a3' },
  planPeriod: { fontSize: 14, color: '#6b7280', marginLeft: 3 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  featureCheck: { color: '#16a34a', fontWeight: '700', marginRight: 8, fontSize: 14 },
  featureText: { fontSize: 13, color: '#374151', flex: 1, lineHeight: 18 },
  subscribeBtn: {
    backgroundColor: '#1c51a3',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  subscribeBtnHighlighted: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#1c51a3' },
  subscribeBtnDisabled: { opacity: 0.6 },
  subscribeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  subscribeBtnTextHighlighted: { color: '#1c51a3' },
});
