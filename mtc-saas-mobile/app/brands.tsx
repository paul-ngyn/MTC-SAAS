// app/brands.tsx – Brands directory

import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/lib/theme';
import { BRANDS } from '@/lib/catalog';

export default function BrandsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        Six lines under one roof — two house brands and four manufacturing partners, all stocked in the hub
        and priced on the same tier structure.
      </Text>

      {BRANDS.map((brand) => (
        <View key={brand.code} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.code}>{brand.name}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.tag, brand.isHouse ? styles.tagHouse : styles.tagPartner]}>
                <Text style={[styles.tagText, brand.isHouse && styles.tagTextHouse]}>
                  {brand.isHouse ? 'House brand' : 'Partner'}
                </Text>
              </View>
              <Text style={styles.skuCount}>{brand.skuCount} SKUs stocked</Text>
            </View>
          </View>
          <Text style={styles.blurb}>{brand.blurb}</Text>
          <Text style={styles.description}>{brand.description}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
            <Text style={styles.link}>Shop {brand.code} →</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  subtitle: { fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: { marginBottom: 6 },
  code: { fontSize: 20, fontWeight: '900', color: colors.ink, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagHouse: { backgroundColor: colors.tint, borderColor: colors.tintBorder },
  tagPartner: { borderColor: colors.border },
  tagText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3, color: colors.muted },
  tagTextHouse: { color: colors.navy },
  skuCount: { fontSize: 11, color: colors.mutedLight },
  blurb: { fontSize: 14, fontWeight: '700', color: colors.ink, marginTop: 4 },
  description: { fontSize: 13, color: colors.muted, lineHeight: 19, marginTop: 4 },
  link: { fontSize: 13, fontWeight: '700', color: colors.navy, marginTop: 10 },
});
