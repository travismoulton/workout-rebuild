import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Search from './Search';
import { searchUtils as utils } from './searchUtils';
import mock from './mock';

describe('<Search>', () => {
  let fetchCategories, fetchMuscles, fetchEquipment;
  const { mockCategories, mockMuscles, mockEquipment } = mock;

  beforeEach(() => {
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

    await waitFor(() => {
      expect(fetchCategories).toBeCalledTimes(1);
      expect(fetchMuscles).toBeCalledTimes(1);
      expect(fetchEquipment).toBeCalledTimes(1);
    });

    const exerciseCategoryDiv = screen.getByTestId('Exercise Category');
    const muscleDiv = screen.getByTestId('Muscle');

    fireEvent.click(exerciseCategoryDiv);

    const exampleCategory = screen.getByTestId(
      'SearchSubCategory-Example Category 1'
    );

    const subCategories = screen.getByTestId('Search-SubCategoryList');

    // After clicking on the Category div, the subcategories should be displayed, and have a length of 3
    // based on the mock
    expect(subCategories).toBeInTheDocument();
    expect(subCategories.childNodes).toHaveLength(3);

    fireEvent.click(muscleDiv);

    const exampleMuscle = screen.getByTestId(
      'SearchSubCategory-Example Muscle 1'
    );

    const muscleSubCategories = screen.getByTestId('Search-SubCategoryList');

    expect(muscleSubCategories.childNodes).toHaveLength(2);
    expect(exampleMuscle).toBeInTheDocument();
    expect(exampleCategory).not.toBeInTheDocument();
    expect(subCategories).not.toBeInTheDocument();
  });
});
