import { customRender, waitFor } from '../../shared/testUtils';
import { exerciseDetailUtils as utils } from './exerciseDetailUtils';
import {
  mockState,
  customExercise,
  customLocation,
  wgerLocation,
  wgerExercise,
} from './mock';
import ExerciseDetail from './ExerciseDetail';

//1: Test that it fetching the correct exercise based on isCustom
//2: Test that is is displaying the delete exercise btn based off isCustom
//3: Test that the showModal button shows the modal
//4: Test that it is rendering the favorite btn

//5: Test that is properly display subcomponents?

describe('<ExerciseDetail />', () => {
  let mockFetchCustom, mockFetchWger;

  beforeEach(() => {
    mockFetchCustom = jest
      .spyOn(utils, 'fetchWgerExercise')
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
    const { getByTestId } = customRender(
      <ExerciseDetail location={location} />,
      { preloadedState: mockState }
    );

    return getByTestId;
  }

  test('fetches wger exercise when is custom is false', async () => {
    setup(wgerLocation);

    await waitFor(() => expect(mockFetchWger).toHaveBeenCalled());
  });
});
