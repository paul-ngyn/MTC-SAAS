// app/account/tax-exempt.tsx – Tax-exempt certificates

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';
import { DEMO_TAX_CERTS } from '@/lib/account-data';
import StatusChip from '@/components/StatusChip';

export default function TaxExemptScreen() {
  return (
    <FlatList
      style={styles.container}
      data={DEMO_TAX_CERTS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Upload certificate →</Text>
        </TouchableOpacity>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.state}>{item.state}</Text>
            <StatusChip status={item.status} />
          </View>
          <Text style={styles.certNumber}>{item.certNumber}</Text>
          <Text style={styles.expires}>Expires {item.expires}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  uploadBtn: { alignSelf: 'flex-end', marginBottom: 12 },
  uploadBtnText: { fontSize: 13, fontWeight: '700', color: colors.navy },
  separator: { height: 10 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  state: { fontSize: 14, fontWeight: '700', color: colors.ink },
  certNumber: { fontSize: 12, color: colors.muted },
  expires: { fontSize: 12, color: colors.mutedLight, marginTop: 4 },
});
