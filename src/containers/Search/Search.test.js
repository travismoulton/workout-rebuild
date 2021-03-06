import {
  customRender,
  screen,
  waitFor,
  fireEvent,
} from '../../shared/testUtils';

import { MemoryRouter } from 'react-router-dom';

import Search from './Search';
import { searchUtils as utils } from './searchUtils';
import mock from './mock';

describe('<Search /> without data fetch', () => {
  test('loads the spinner before data is fetched', async () => {
    jest
      .spyOn(utils, 'fetchCategories')
      .mockImplementation(jest.fn(() => Promise.resolve(null)));

    jest
      .spyOn(utils, 'fetchMuscles')
      .mockImplementation(jest.fn(() => Promise.resolve(null)));

    jest
      .spyOn(utils, 'fetchEquipment')
      .mockImplementation(jest.fn(() => Promise.resolve(null)));

    customRender(<Search />);

    const spinner = screen.getByTestId('Spinner');

    expect(spinner).toBeInTheDocument();
  });
});

describe('<Search /> with data fetch', () => {
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

  const simulateFetch = async () => {
    await waitFor(() => {
      expect(fetchCategories).toBeCalledTimes(1);
      expect(fetchMuscles).toBeCalledTimes(1);
      expect(fetchEquipment).toBeCalledTimes(1);
    });
  };

  test('calls the wger api 3 times', async () => {
    customRender(<Search />);

    await waitFor(() => {
      expect(fetchCategories).toBeCalledTimes(1);
      expect(fetchMuscles).toBeCalledTimes(1);
      expect(fetchEquipment).toBeCalledTimes(1);
    });
  });

  test('renders Exercise Category Div', async () => {
    customRender(<Search />);

    await simulateFetch();

    const exerciseCategories = screen.getByTestId('Exercise Category');

    await waitFor(() => expect(exerciseCategories).toBeInTheDocument());
  });

  test('has the title Search For Exercises', async () => {
    customRender(<Search />);
    const title = document.title;
    await waitFor(() => expect(title).toBe('Search For Exercises'));
  });

  test('has the correct subcategories after a category is selected', async () => {
    customRender(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    await simulateFetch();

    const exerciseCategoryDiv = screen.getByTestId('Exercise Category');
    const muscleDiv = screen.getByTestId('Muscle');

    fireEvent.click(exerciseCategoryDiv);

    const exampleCategory = screen.getByTestId(
      'SearchSubCategory-Example Category 1'
    );

    const subCategories = screen.getByTestId('Search-SubCategoryList');

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
