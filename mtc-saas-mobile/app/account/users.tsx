// app/account/users.tsx – Users & approvals

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme';
import { DEMO_USERS } from '@/lib/account-data';
import StatusChip from '@/components/StatusChip';

export default function UsersScreen() {
  return (
    <FlatList
      style={styles.container}
      data={DEMO_USERS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <TouchableOpacity style={styles.inviteBtn}>
          <Text style={styles.inviteBtnText}>Invite user →</Text>
        </TouchableOpacity>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <StatusChip status={item.status} />
          </View>
          <Text style={styles.role}>{item.role}</Text>
          <Text style={styles.limit}>Approval limit: {item.approvalLimit}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  inviteBtn: { alignSelf: 'flex-end', marginBottom: 12 },
  inviteBtnText: { fontSize: 13, fontWeight: '700', color: colors.navy },
  separator: { height: 10 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { fontSize: 14, fontWeight: '700', color: colors.ink },
  role: { fontSize: 12, color: colors.muted },
  limit: { fontSize: 12, color: colors.mutedLight, marginTop: 4 },
});
