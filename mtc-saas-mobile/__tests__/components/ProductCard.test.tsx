// __tests__/components/ProductCard.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ProductCard from '../../components/ProductCard';
import type { Product } from '../../lib/types';

// Mock expo-router navigation
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Commercial Fryer',
  slug: 'commercial-fryer',
  description: 'Heavy duty commercial fryer',
  price: 49900, // $499.00
  image_url: null,
  category_id: 'cat-1',
  stock: 20,
  unit: 'each',
};

describe('ProductCard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Commercial Fryer')).toBeTruthy();
  });

  it('renders formatted price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$499.00')).toBeTruthy();
  });

  it('renders unit', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('per each')).toBeTruthy();
  });

  it('does not show out-of-stock badge when in stock', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText('Out of stock')).toBeNull();
  });

  it('shows out-of-stock badge when stock is 0', () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />);
    expect(screen.getByText('Out of stock')).toBeTruthy();
  });

  it('navigates to product detail on press', () => {
    render(<ProductCard product={mockProduct} />);
    fireEvent.press(screen.getByText('Commercial Fryer'));
    expect(mockPush).toHaveBeenCalledWith('/products/commercial-fryer');
  });
});
