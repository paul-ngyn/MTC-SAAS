// app/account/addresses.tsx – Saved addresses

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';
import { DEMO_ADDRESSES } from '@/lib/account-data';

export default function AddressesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add address</Text>
      </TouchableOpacity>
      {DEMO_ADDRESSES.map((addr) => (
        <View key={addr.id} style={styles.card}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{addr.label}</Text>
          </View>
          <Text style={styles.company}>{addr.company}</Text>
          {addr.lines.map((line) => (
            <Text key={line} style={styles.line}>{line}</Text>
          ))}
          <TouchableOpacity>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  addBtn: { alignSelf: 'flex-end', marginBottom: 12 },
  addBtnText: { fontSize: 13, fontWeight: '700', color: colors.navy },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  tag: { alignSelf: 'flex-start', backgroundColor: colors.tint, borderWidth: 1, borderColor: colors.tintBorder, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 12 },
  tagText: { fontSize: 10, fontWeight: '800', color: colors.navy, textTransform: 'uppercase', letterSpacing: 0.3 },
  company: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 2 },
  line: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  editLink: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 12 },
});
