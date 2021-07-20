import { customRender } from '../../shared/testUtils';
import FavoriteBtn from './FavoriteBtn';

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

describe('<FavoriteBtn />', () => {
  test('renders when passed an exercise in favorites', () => {
    const { getByText } = customRender(<FavoriteBtn exerciseId={'id1'} />, {
      preloadedState: mockState,
    });

    expect(getByText('Unfavorite')).toBeInTheDocument();
  });

  test('renders when passed an exercise not in favorites', () => {
    const { getByText } = customRender(<FavoriteBtn exerciseId={'id4'} />, {
      preloadedState: mockState,
    });

    expect(getByText('Favorite')).toBeInTheDocument();
  });
});
