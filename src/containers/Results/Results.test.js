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

  test('renders', async () => {
    const { category, subCategory, id, custom, wger, random } =
      props.location.state;

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

    customRender(
      <MemoryRouter>
        <Results {...props} />
      </MemoryRouter>,
      { preloadedState: mockState }
    );

    await simulateFetch();
  });
});
