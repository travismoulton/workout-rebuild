import { customRender, waitFor, fireEvent } from '../../shared/testUtils';
import { exerciseDetailUtils as utils } from './exerciseDetailUtils';
import {
  mockState,
  customExercise,
  customLocation,
  wgerLocation,
  wgerExercise,
} from './mock';
import ExerciseDetail from './ExerciseDetail';

describe('<ExerciseDetail />', () => {
  let mockFetchCustom, mockFetchWger;

  beforeEach(() => {
    mockFetchCustom = jest
      .spyOn(utils, 'fetchCustomExercise')
      .mockImplementation(jest.fn(() => Promise.resolve(customExercise)));

    mockFetchWger = jest
      .spyOn(utils, 'fetchWgerExercise')
      .mockImplementation(jest.fn(() => Promise.resolve(wgerExercise)));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockFetchCustom = null;
    mockFetchWger = null;
  });

  function setup(location) {
    const { getByTestId, getByText, queryByText, queryByTestId } = customRender(
      <ExerciseDetail location={location} />,
      { preloadedState: mockState }
    );

    return { getByTestId, getByText, queryByText, queryByTestId };
  }

  test('fetches wger exercise when is custom is false', async () => {
    setup(wgerLocation);
    await waitFor(() => expect(mockFetchWger).toHaveBeenCalled());
  });

  test('fetches customExercise when isCustom is true', async () => {
    setup(customLocation);
    await waitFor(() => expect(mockFetchCustom).toHaveBeenCalled());
  });

  test('displays delete exercise btn when displaying a custom exercise and opens modal when clicked', async () => {
    const { getByText, getByTestId } = setup(customLocation);
    await waitFor(() => expect(mockFetchCustom).toHaveBeenCalled());

    expect(getByText('Delete exercise')).toBeInTheDocument();

    fireEvent.click(getByText('Delete exercise'));

    expect(getByTestId('deleteExerciseModal')).toBeInTheDocument();
  });

  test('displays favorite button if there is a user and the exercise is not a favorite', async () => {
    const { getByText } = setup(wgerLocation);
    await waitFor(() => expect(mockFetchWger).toHaveBeenCalled());

    expect(getByText('Favorite')).toBeInTheDocument();
  });

  test('displays unfavorite button if there is a user and the exercise is not a favorite', async () => {
    const { getByText } = setup(customLocation);
    await waitFor(() => expect(mockFetchCustom).toHaveBeenCalled());

    expect(getByText('Unfavorite')).toBeInTheDocument();
  });

  test('displays appropriate exercise details when in the exercise', async () => {
    const { getByText, getByTestId } = setup(wgerLocation);
    await waitFor(() => expect(mockFetchWger).toHaveBeenCalled());

    expect(getByText('Description')).toBeInTheDocument();
    expect(getByTestId('equipmentList').childNodes).toHaveLength(1);
    expect(getByText('Main Muscles')).toBeInTheDocument();
    expect(getByTestId('primaryMuscleList').childNodes).toHaveLength(2);
    expect(getByTestId('secondaryMuscleList').childNodes).toHaveLength(3);
  });

  test('displays only category name if no other items in the exercise', async () => {
    const { queryByTestId, queryByText } = setup(customLocation);
    await waitFor(() => expect(mockFetchCustom).toHaveBeenCalled());

    expect(queryByText('Description')).toBeNull();
    expect(queryByTestId('equipmentList')).toBeNull();
    expect(queryByText('Main Muscles')).toBeNull();
    expect(queryByTestId('primaryMuscleList')).toBeNull();
    expect(queryByTestId('secondaryMuscleList')).toBeNull();
  });
});
