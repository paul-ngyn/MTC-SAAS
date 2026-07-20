// __tests__/components/ProductRow.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ProductRow from '../../components/ProductRow';
import { useCartStore } from '../../lib/cart-store';
import type { Product } from '../../lib/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockProduct: Product = {
  id: 'prod-1',
  name: '32 oz Round Container with Lid, Case of 150',
  slug: 'round-container-32oz',
  description: null,
  price: 4299, // $42.99
  image_url: null,
  category_id: 'cat-1',
  stock: 20,
  unit: 'case',
  sku: 'TD-C32-150',
  brand_code: 'TD',
};

describe('ProductRow', () => {
  beforeEach(() => {
    mockPush.mockClear();
    useCartStore.setState({ items: [] });
  });

  it('renders the product name', async () => {
    await render(<ProductRow product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeTruthy();
  });

  it('renders the list-tier unit price', async () => {
    await render(<ProductRow product={mockProduct} />);
    expect(screen.getByText('$42.99')).toBeTruthy();
  });

  it('renders the brand tag and SKU when present', async () => {
    await render(<ProductRow product={mockProduct} />);
    expect(screen.getByText('TD')).toBeTruthy();
    expect(screen.getByText('TD-C32-150')).toBeTruthy();
  });

  it('omits the meta row when brand/SKU are absent', async () => {
    await render(<ProductRow product={{ ...mockProduct, brand_code: null, sku: null }} />);
    expect(screen.queryByText('TD-C32-150')).toBeNull();
  });

  it('renders the 50+ bulk-tier hint (20% off list)', async () => {
    await render(<ProductRow product={mockProduct} />);
    expect(screen.getByText(/50\+ at \$34\.39/)).toBeTruthy();
  });

  it('adds the product to the cart when Add is pressed, without navigating', async () => {
    await render(<ProductRow product={mockProduct} />);
    await fireEvent.press(screen.getByText('Add'));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates to the product detail screen when the row is pressed', async () => {
    await render(<ProductRow product={mockProduct} />);
    await fireEvent.press(screen.getByText(mockProduct.name));
    expect(mockPush).toHaveBeenCalledWith('/products/round-container-32oz');
  });

  it('shows a disabled "—" Add control when out of stock', async () => {
    await render(<ProductRow product={{ ...mockProduct, stock: 0 }} />);
    expect(screen.getByText('—')).toBeTruthy();
    expect(screen.queryByText('Add')).toBeNull();
  });

  it('does not add to cart when out of stock', async () => {
    await render(<ProductRow product={{ ...mockProduct, stock: 0 }} />);
    await fireEvent.press(screen.getByText('—'));
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
