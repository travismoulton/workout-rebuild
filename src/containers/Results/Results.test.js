import { MemoryRouter } from 'react-router-dom';

import { customRender, waitFor } from '../../shared/testUtils';
import mockResults from './mockResults';
import { resultsUtils as utils } from './resultsUtils';
import Results from './Results';

describe('<ExerciseResult />', () => {
  let fetchWgerExercises;
  beforeEach(() => {
    fetchWgerExercises = jest
      .spyOn(utils, 'fetchWgerExercises')
      .mockImplementation(jest.fn(() => Promise.resolve(mockResults)));
  });

  afterEach(() => {
    jest.resetAllMocks();
    fetchWgerExercises = null;
  });

  const simulateFetch = async () => {
    await waitFor(() => {
      expect(fetchWgerExercises).toHaveBeenCalledTimes(1);
    });
  };

  const props = {
    location: {
      state: {
        category: 'mockCategory',
        subCategory: 'mockSubCategory',
        id: 'mockId',
        custom: 'mockCustom',
        wger: true,
      },
    },
  };

  const mockState = {
    favorites: {
      ids: [1, 2, 3],
      entities: {
        1: { id: 1, exerciseId: 'id1', firebaseId: 1 },
        2: { id: 2, exerciseId: 'id2', firebaseId: 2 },
        3: { id: 3, exerciseId: 'id3', firebaseId: 3 },
      },
    },
  };

  test('renders with correct doucment title and list size', async () => {
    const { getByTestId } = customRender(
      <MemoryRouter>
        <Results {...props} />
      </MemoryRouter>,
      { preloadedState: mockState }
    );

    await simulateFetch();

    const results = getByTestId('ResultsUL');
    expect(results.childNodes).toHaveLength(4);
    expect(document.title).toBe('My Custom Exercises');

    const exerciseResult = getByTestId('ExerciseResult__mock4');
    expect(exerciseResult).toBeInTheDocument();
  });
});
