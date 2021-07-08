import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SearchSubCategoryList from './SearchSubCategoryList';

describe('<SearchSubCategoryList />', () => {
  const mockCategories = [
    {
      name: 'Mock Category 1',
      id: 1,
      category: 'Mock',
    },
    {
      name: 'Mock Category 2',
      id: 2,
      category: 'Mock',
    },
    {
      name: 'Mock Category 3',
      id: 3,
      category: 'Mock',
    },
  ];

  const props = { subCategories: mockCategories, category: 'Mock' };

  test('renders the correct amount of categories given a list', () => {
    render(
      <MemoryRouter>
        <SearchSubCategoryList {...props} />
      </MemoryRouter>
    );

    const list = screen.getByTestId('Search-SubCategoryList');

    expect(list).toBeInTheDocument();
    expect(list.childNodes).toHaveLength(3);
  });

  test('renders the correct subcategories', () => {
    render(
      <MemoryRouter>
        <SearchSubCategoryList {...props} />
      </MemoryRouter>
    );

    const subCategory = screen.getByTestId('SearchSubCategory-Mock Category 1');

    expect(subCategory).toBeInTheDocument();
  });
});
