// __tests__/lib/cart-store.test.ts

import { useCartStore } from '../../lib/cart-store';
import type { Product } from '../../lib/types';

// Mock AsyncStorage used by the zustand persist middleware
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Commercial Fryer',
  slug: 'commercial-fryer',
  description: null,
  price: 49900,
  image_url: null,
  category_id: 'cat-1',
  stock: 20,
  unit: 'each',
};

describe('Cart Store (mobile)', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts empty', () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('adds a product', () => {
    useCartStore.getState().addItem(mockProduct);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('increments quantity for duplicate product', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct, 2);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('removes a product', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem('prod-1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calculates total correctly', () => {
    useCartStore.getState().addItem(mockProduct, 3); // 3 × 49900 = 149700
    expect(useCartStore.getState().total()).toBe(149700);
  });

  it('counts total item quantity', () => {
    useCartStore.getState().addItem(mockProduct, 4);
    expect(useCartStore.getState().itemCount()).toBe(4);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
