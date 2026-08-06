// components/StatusChip.tsx – Small status badge used across account sub-screens.

import { View, Text, StyleSheet } from 'react-native';
import { STATUS_COLORS } from '@/lib/account-data';

export default function StatusChip({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { fg: '#6b7280', bg: '#f3f4f6', border: '#e5e7eb' };
  return (
    <View style={[styles.chip, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.text, { color: c.fg }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 11, fontWeight: '700' },
});
