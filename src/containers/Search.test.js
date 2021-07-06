import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Search from './Search/Search';
import { searchUtils as utils } from './Search/searchUtils';
import mock from './Search/mock';

describe('<Search>', () => {
  let fetchCategories, fetchMuscles, fetchEquipment;

  beforeEach(() => {
    const { mockCategories, mockMuscles, mockEquipment } = mock;

    fetchCategories = jest
      .spyOn(utils, 'fetchCategories')
      .mockImplementation(jest.fn(() => Promise.resolve(mockCategories)));

    fetchMuscles = jest
      .spyOn(utils, 'fetchMuscles')
      .mockImplementation(jest.fn(() => Promise.resolve(mockMuscles)));

    fetchEquipment = jest
      .spyOn(utils, 'fetchEquipment')
      .mockImplementation(jest.fn(() => Promise.resolve(mockEquipment)));
  });

  afterEach(() => {
    jest.resetAllMocks();

    fetchCategories = null;
    fetchMuscles = null;
    fetchEquipment = null;
  });

  test('calls the wger api 3 times', async () => {
    render(<Search />);

    await waitFor(() => {
      expect(fetchCategories).toBeCalledTimes(1);
      expect(fetchMuscles).toBeCalledTimes(1);
      expect(fetchEquipment).toBeCalledTimes(1);
    });
  });

  test('renders Exercise Category Div', async () => {
    render(<Search />);

    const exerciseCategories = screen.getByTestId('Exercise Category');

    await waitFor(() => expect(exerciseCategories).toBeInTheDocument());
  });

  test('has the title Search For Exercises', async () => {
    render(<Search />);
    const title = document.title;
    await waitFor(() => expect(title).toBe('Search For Exercises'));
  });

  test('has the correct subcategories after a category is selected', async () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const div = screen.getByTestId('Exercise Category');

    await waitFor(() => {
      fireEvent.click(div);
    });

    await waitFor(() => {
      expect(screen.getByTestId('Search-SubCategoryList')).toBeInTheDocument();
    });
  });
});
