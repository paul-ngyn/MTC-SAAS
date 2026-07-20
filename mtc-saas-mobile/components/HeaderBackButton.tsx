// components/HeaderBackButton.tsx – Header back button that always does something:
// pops the stack if there's history, otherwise falls back to the Home tab.
// Needed because screens like /membership and /products/[slug] can be the first
// entry in the stack (deep link, page refresh on web), where the native
// back button renders but navigation.goBack() is a no-op.

import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';

export default function HeaderBackButton() {
  const router = useRouter();

  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} hitSlop={10} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
      <Ionicons name="chevron-back" size={26} color={colors.navy} />
    </TouchableOpacity>
  );
}
