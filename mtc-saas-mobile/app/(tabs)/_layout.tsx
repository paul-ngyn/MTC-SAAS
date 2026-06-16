// app/(tabs)/_layout.tsx – Bottom tab navigator

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/lib/cart-store';

export default function TabLayout() {
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1c51a3',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { borderTopColor: '#e5e7eb' },
        headerTintColor: '#1c51a3',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: itemCount > 0 ? (itemCount > 99 ? '99+' : itemCount) : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
