// __tests__/screens/cart.test.tsx – "cart status" coverage: empty state, tiered totals

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CartScreen from '../../app/(tabs)/cart';
import { useCartStore } from '../../lib/cart-store';
import type { Product } from '../../lib/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockProduct: Product = {
  id: 'prod-1',
  name: '32 oz Round Container with Lid, Case of 150',
  slug: 'round-container-32oz',
  description: null,
  price: 4299, // $42.99/case
  image_url: null,
  category_id: 'cat-1',
  stock: 100,
  unit: 'case',
};

describe('Cart screen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    useCartStore.setState({ items: [] });
  });

  it('shows the empty state when there are no items', async () => {
    await render(<CartScreen />);
    expect(screen.getByText('Your cart is empty')).toBeTruthy();
  });

  it('navigates to Browse from the empty state', async () => {
    await render(<CartScreen />);
    await fireEvent.press(screen.getByText('Browse Categories'));
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/categories');
  });

  it('shows the item count in the header', async () => {
    useCartStore.getState().addItem(mockProduct, 3);
    await render(<CartScreen />);
    expect(screen.getByText('Cart · 3 items')).toBeTruthy();
  });

  it('shows list-price subtotal and no bulk savings below the discount threshold', async () => {
    useCartStore.getState().addItem(mockProduct, 5); // below the 10-unit tier
    await render(<CartScreen />);
    // No discount applies, so the line total, cart subtotal, and grand total all match.
    expect(screen.getAllByText('$214.95')).toHaveLength(3); // 5 × $42.99
    expect(screen.queryByText('Bulk-tier savings')).toBeNull();
  });

  it('applies the bulk tier and shows savings once quantity crosses the threshold', async () => {
    useCartStore.getState().addItem(mockProduct, 10); // hits the 10-49 tier (10% off)
    await render(<CartScreen />);

    // Tiered line total: 10 × $38.69 = $386.90 (line-item total + cart total, same for a single item)
    expect(screen.getAllByText('$386.90')).toHaveLength(2);
    expect(screen.getByText('Bulk-tier savings')).toBeTruthy();
    // Savings: (4299 - 3869) * 10 = 4300 cents = $43.00
    expect(screen.getByText('−$43.00')).toBeTruthy();
  });

  it('marks freight free once the tiered total clears $250', async () => {
    useCartStore.getState().addItem(mockProduct, 10); // tiered total $386.90 > $250
    await render(<CartScreen />);
    expect(screen.getByText('Free')).toBeTruthy();
  });

  it('shows "At checkout" for freight below the free-shipping threshold', async () => {
    useCartStore.getState().addItem(mockProduct, 2); // tiered total $85.98 < $250
    await render(<CartScreen />);
    expect(screen.getByText('At checkout')).toBeTruthy();
  });
});
