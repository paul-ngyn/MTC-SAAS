// app/lists/index.tsx – My Lists: saved product lists for quick reordering

import { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/lib/theme';
import { DEMO_LISTS, type SavedList } from '@/lib/lists';

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ListsScreen() {
  const router = useRouter();
  const [lists, setLists] = useState<SavedList[]>(DEMO_LISTS);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const id = slugify(name) || `list-${lists.length + 1}`;
    setLists((prev) => [...prev, { id, name, items: [] }]);
    setNewName('');
    setCreating(false);
  };

  return (
    <FlatList
      style={styles.container}
      data={lists}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push({ pathname: '/lists/[id]', params: { id: item.id } })}
        >
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardCount}>{item.items.length} item{item.items.length === 1 ? '' : 's'}</Text>
          <Text style={styles.cardLink}>View →</Text>
        </TouchableOpacity>
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.subtitle}>Saved product lists for one-click reordering.</Text>
          {creating ? (
            <View style={styles.createForm}>
              <TextInput
                autoFocus
                style={styles.input}
                placeholder="e.g. Weekend Catering Order"
                placeholderTextColor={colors.mutedLight}
                value={newName}
                onChangeText={setNewName}
                onSubmitEditing={handleCreate}
              />
              <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <Text style={styles.createBtnText}>Create</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setCreating(true)}>
              <Text style={styles.newLink}>+ Create new list</Text>
            </TouchableOpacity>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 12, paddingBottom: 32 },
  header: { paddingHorizontal: 4, marginBottom: 12 },
  subtitle: { fontSize: 13, color: colors.muted, marginBottom: 10 },
  newLink: { fontSize: 13, fontWeight: '700', color: colors.navy },
  createForm: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  createBtn: { backgroundColor: colors.navy, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 10 },
  createBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  row: { gap: 8 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  cardName: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  cardCount: { fontSize: 12, color: colors.muted, marginBottom: 10 },
  cardLink: { fontSize: 12, fontWeight: '700', color: colors.navy },
});
