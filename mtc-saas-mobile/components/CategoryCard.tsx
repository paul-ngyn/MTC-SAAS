// components/CategoryCard.tsx

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { Category } from '@/lib/types';
import { colors } from '@/lib/theme';

export default function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/categories/${category.slug}`)}
      activeOpacity={0.7}
    >
      <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
      {category.description ? (
        <Text style={styles.desc} numberOfLines={2}>{category.description}</Text>
      ) : null}
      <Text style={styles.arrow}>Browse →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 14,
    minHeight: 96,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: colors.ink,
    marginBottom: 4,
  },
  desc: { fontSize: 11, color: colors.muted, lineHeight: 15, flex: 1, marginBottom: 6 },
  arrow: { fontSize: 11, fontWeight: '700', color: colors.navy },
});
