// app/account/payment.tsx – Payment & Net-30 Terms

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';
import { DEMO_NET30, DEMO_PAYMENT_METHOD } from '@/lib/account-data';
import StatusChip from '@/components/StatusChip';

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function PaymentScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Net-30 terms</Text>
          <StatusChip status={DEMO_NET30.status} />
        </View>
        <Text style={styles.creditLimit}>{formatPrice(DEMO_NET30.creditLimit)}</Text>
        <Text style={styles.eyebrow}>Credit limit</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Terms</Text>
          <Text style={styles.detailValue}>{DEMO_NET30.terms}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Next statement</Text>
          <Text style={styles.detailValue}>{DEMO_NET30.nextStatementDate}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment method on file</Text>
        <Text style={styles.cardBig}>
          {DEMO_PAYMENT_METHOD.brand} ending {DEMO_PAYMENT_METHOD.last4}
        </Text>
        <Text style={styles.cardSub}>Expires {DEMO_PAYMENT_METHOD.expiry}</Text>
        <TouchableOpacity>
          <Text style={styles.updateLink}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  creditLimit: { fontSize: 24, fontWeight: '900', color: colors.navy },
  eyebrow: { fontSize: 11, fontWeight: '700', color: colors.mutedLight, textTransform: 'uppercase', marginTop: 2, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  detailLabel: { fontSize: 13, color: colors.muted },
  detailValue: { fontSize: 13, fontWeight: '700', color: colors.ink },
  cardBig: { fontSize: 17, fontWeight: '700', color: colors.ink, marginTop: 12 },
  cardSub: { fontSize: 13, color: colors.mutedLight, marginTop: 4 },
  updateLink: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 14 },
});
