// app/_layout.tsx – Root layout: session guard + navigation stack

import { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1c51a3" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerTintColor: '#1c51a3', headerTitleStyle: { fontWeight: '700' } }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="categories/[slug]"
          options={{ title: 'Products', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="products/[slug]"
          options={{ title: 'Product Details', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="membership"
          options={{ title: 'Membership Plans', headerBackTitle: 'Back' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
