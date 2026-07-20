// __tests__/components/CategoryCard.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CategoryCard from '../../components/CategoryCard';
import type { Category } from '../../lib/types';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockCategory: Category = {
  id: 'cat-1',
  name: 'Refrigeration',
  slug: 'refrigeration',
  description: 'Reach-in coolers, walk-ins, and refrigerated display cases.',
  image_url: null,
};

describe('CategoryCard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the category name', async () => {
    await render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText('Refrigeration')).toBeTruthy();
  });

  it('renders the description when present', async () => {
    await render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText(mockCategory.description!)).toBeTruthy();
  });

  it('omits the description when absent', async () => {
    await render(<CategoryCard category={{ ...mockCategory, description: null }} />);
    expect(screen.queryByText(mockCategory.description!)).toBeNull();
  });

  it('navigates to the category listing on press', async () => {
    await render(<CategoryCard category={mockCategory} />);
    await fireEvent.press(screen.getByText('Refrigeration'));
    expect(mockPush).toHaveBeenCalledWith('/categories/refrigeration');
  });
});
