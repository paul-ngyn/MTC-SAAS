// components/CategoryCard.tsx

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { Category } from '@/lib/types';

// Simple color palette for category cards without images
const BG_COLORS = ['#dbeafe', '#dcfce7', '#fef9c3', '#fce7f3', '#ede9fe', '#ffedd5'];

function hashIndex(str: string, len: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % len;
  return h;
}

export default function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  const bg = BG_COLORS[hashIndex(category.slug, BG_COLORS.length)];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bg }]}
      onPress={() => router.push(`/categories/${category.slug}`)}
      activeOpacity={0.85}
    >
      <View style={styles.inner}>
        <Text style={styles.name}>{category.name}</Text>
        {category.description && (
          <Text style={styles.desc} numberOfLines={2}>{category.description}</Text>
        )}
        <Text style={styles.arrow}>Browse →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 100,
  },
  inner: { padding: 14, flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  desc: { fontSize: 11, color: '#374151', lineHeight: 15, flex: 1, marginBottom: 6 },
  arrow: { fontSize: 12, fontWeight: '600', color: '#1c51a3' },
});
