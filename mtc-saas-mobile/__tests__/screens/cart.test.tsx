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
    // No discount applies, so the line total and cart subtotal match...
    expect(screen.getAllByText('$214.95')).toHaveLength(2); // 5 × $42.99
    // ...and the grand total adds flat freight, since $214.95 is under the $500
    // free-freight threshold.
    expect(screen.getByText('$239.94')).toBeTruthy(); // $214.95 + $24.99
    expect(screen.queryByText('Bulk-tier savings')).toBeNull();
  });

  it('applies the bulk tier and shows savings once quantity crosses the threshold', async () => {
    useCartStore.getState().addItem(mockProduct, 10); // hits the 10-49 tier (10% off)
    await render(<CartScreen />);

    // Tiered line total: 10 × $38.69 = $386.90
    expect(screen.getByText('$386.90')).toBeTruthy();
    expect(screen.getByText('Bulk-tier savings')).toBeTruthy();
    // Savings: (4299 - 3869) * 10 = 4300 cents = $43.00
    expect(screen.getByText('−$43.00')).toBeTruthy();
    // Still under $500, so freight is added: $386.90 + $24.99
    expect(screen.getByText('$411.89')).toBeTruthy();
  });

  it('marks freight free once the tiered total clears $500', async () => {
    useCartStore.getState().addItem(mockProduct, 15); // tiered total $580.35 > $500
    await render(<CartScreen />);
    expect(screen.getByText('Free')).toBeTruthy();
    // Freight is waived, so the grand total equals the tiered line total —
    // hence the same figure renders twice (line item + total row).
    expect(screen.getAllByText('$580.35')).toHaveLength(2);
  });

  it('charges flat freight below the free-shipping threshold', async () => {
    useCartStore.getState().addItem(mockProduct, 2); // tiered total $85.98 < $500
    await render(<CartScreen />);
    expect(screen.getByText('$24.99')).toBeTruthy();
  });
});
