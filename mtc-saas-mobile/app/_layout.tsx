// app/_layout.tsx – Root layout: session tracking + navigation stack
//
// The storefront (Home/Browse/Product/Cart) is browsable as a guest, matching
// the public web hub — sign-in is only needed for account/checkout actions. We
// therefore render immediately and never block the UI on the session lookup
// (which is important while Supabase is being wired up: getSession can be slow
// or unreachable). Signed-in users opening the auth screens are bounced to the
// tabs once the session resolves.

import { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';
import HeaderBackButton from '@/components/HeaderBackButton';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session))
      .catch(() => setSession(null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    // Guests may browse; only bounce a signed-in user out of the auth screens.
    if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, segments]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerTintColor: '#1c51a3', headerTitleStyle: { fontWeight: '700' } }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="categories/[slug]"
            options={{ title: 'Products', headerBackTitle: 'Back', headerLeft: () => <HeaderBackButton /> }}
          />
          <Stack.Screen
            name="products/[slug]"
            options={{ title: 'Product Details', headerBackTitle: 'Back', headerLeft: () => <HeaderBackButton /> }}
          />
          <Stack.Screen
            name="membership"
            options={{ title: 'Membership Plans', headerBackTitle: 'Back', headerLeft: () => <HeaderBackButton /> }}
          />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
