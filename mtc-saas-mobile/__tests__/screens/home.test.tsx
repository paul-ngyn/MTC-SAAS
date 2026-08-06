// __tests__/screens/home.test.tsx – "homepage status" coverage: categories, cart badge, membership banner

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';
import { useCartStore } from '../../lib/cart-store';
import type { Category, Profile } from '../../lib/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Minimal chainable query-builder mock matching how index.tsx calls supabase.
function mockMakeChain(result: unknown) {
  const chain: any = {
    select: () => chain,
    limit: () => chain,
    order: () => chain,
    eq: () => chain,
    in: () => chain,
    single: () => chain,
    then: (resolve: (v: unknown) => void) => Promise.resolve(result).then(resolve),
  };
  return chain;
}

let mockUser: { id: string; email: string } | null = null;
let mockProfile: Profile | null = null;
const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Refrigeration', slug: 'refrigeration', description: null, image_url: null },
];

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'categories') return mockMakeChain({ data: mockCategories });
      if (table === 'profiles') return mockMakeChain({ data: mockProfile });
      if (table === 'orders') return mockMakeChain({ data: [] });
      if (table === 'order_items') return mockMakeChain({ data: [] });
      return mockMakeChain({ data: null });
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: mockUser } }),
    },
  },
}));

describe('Home screen', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    mockUser = null;
    mockProfile = null;
  });

  it('renders fetched categories', async () => {
    await render(<HomeScreen />);
    await waitFor(() => expect(screen.getByText('Refrigeration')).toBeTruthy());
  });

  it('shows a cart badge with the current item count', async () => {
    useCartStore.getState().addItem(
      { id: 'p1', name: 'Test', slug: 'test', description: null, price: 100, image_url: null, category_id: 'c1', stock: 5, unit: 'each' },
      2
    );
    await render(<HomeScreen />);
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('shows the upsell banner for a signed-out / non-member visitor', async () => {
    await render(<HomeScreen />);
    expect(screen.getByText('GO MTC+')).toBeTruthy();
    expect(screen.getByText('Unlock free freight & tiered pricing')).toBeTruthy();
  });

  it('shows the active-member banner once the profile loads with a membership tier', async () => {
    mockUser = { id: 'u1', email: 'owner@maplebistro.com' };
    mockProfile = {
      id: 'u1',
      email: 'owner@maplebistro.com',
      full_name: 'Owner',
      company_name: 'Maple Bistro Inc.',
      membership_tier: 'pro',
      stripe_customer_id: null,
    };

    await render(<HomeScreen />);

    await waitFor(() => expect(screen.getByText('MTC+ MEMBER')).toBeTruthy());
    expect(screen.getByText('Free freight over $500 — Active')).toBeTruthy();
  });

  it('reorder shortcuts fall back to the demo products when there is no order history', async () => {
    await render(<HomeScreen />);
    expect(screen.getByText('32 oz Round Container with Lid, Case of 150')).toBeTruthy();
    expect(screen.getByText('18" Food Film Wrap, 2000 ft Roll')).toBeTruthy();
  });
});
