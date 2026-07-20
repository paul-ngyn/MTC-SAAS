// __tests__/screens/account.test.tsx – "membership status" coverage

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AccountScreen from '../../app/(tabs)/account';
import { useReorderStore } from '../../lib/reorder-store';
import type { Profile } from '../../lib/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

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

let mockUser: { id: string; email: string } | null = { id: 'u1', email: 'owner@maplebistro.com' };
let mockProfile: Profile | null = null;

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'profiles') return mockMakeChain({ data: mockProfile });
      if (table === 'orders') return mockMakeChain({ data: [] });
      if (table === 'order_items') return mockMakeChain({ data: [] });
      return mockMakeChain({ data: null });
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: mockUser } }),
      signOut: () => Promise.resolve({ error: null }),
    },
  },
}));

describe('Account screen — membership status', () => {
  beforeEach(() => {
    useReorderStore.setState({ schedules: [] });
    mockUser = { id: 'u1', email: 'owner@maplebistro.com' };
    mockProfile = null;
  });

  it('shows "No active plan" and an upgrade prompt when there is no membership', async () => {
    await render(<AccountScreen />);
    await waitFor(() => expect(screen.getByText('No active plan')).toBeTruthy());
    expect(screen.getByText('Upgrade to a Plan')).toBeTruthy();
  });

  it('shows the MTC+ status card with tier and company once membership is active', async () => {
    mockProfile = {
      id: 'u1',
      email: 'owner@maplebistro.com',
      full_name: 'Pat Owner',
      company_name: 'Maple Bistro Inc.',
      membership_tier: 'pro',
      stripe_customer_id: 'cus_123',
    };

    await render(<AccountScreen />);

    await waitFor(() => expect(screen.getByText('MTC+ Pro · Active')).toBeTruthy());
    expect(screen.getByText('Maple Bistro Inc.')).toBeTruthy();
    expect(screen.getByText('Saved via tiers')).toBeTruthy();
    expect(screen.getByText('Auto-reorders')).toBeTruthy();
  });

  it('reflects the real schedule count from the reorder store in the stats row', async () => {
    mockProfile = {
      id: 'u1', email: 'owner@maplebistro.com', full_name: null,
      company_name: null, membership_tier: 'basic', stripe_customer_id: null,
    };
    useReorderStore.getState().addSchedule({
      productId: 'demo-1', productName: 'Round Container', unit: 'case', quantity: 10, cadence: 'weekly',
    });

    await render(<AccountScreen />);

    await waitFor(() => expect(screen.getByText('Round Container · 10 case')).toBeTruthy());
    expect(screen.getByText('Weekly')).toBeTruthy();
  });

  it('reveals the add-schedule form when "+ Put a SKU on a schedule" is pressed', async () => {
    await render(<AccountScreen />);
    await fireEvent.press(screen.getByText('+ Put a SKU on a schedule'));
    expect(screen.getByText('Add schedule')).toBeTruthy();
  });

  it('adds a schedule to the store when the inline form is confirmed', async () => {
    await render(<AccountScreen />);
    await fireEvent.press(screen.getByText('+ Put a SKU on a schedule'));
    await fireEvent.press(screen.getByText('Add schedule'));

    expect(useReorderStore.getState().schedules).toHaveLength(1);
  });
});
