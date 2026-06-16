// app/(auth)/_layout.tsx – Auth group: no tab bar, simple stack

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
