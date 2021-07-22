import * as reactRedux from 'react-redux';
import * as mockActions from '../../store/favoritesSlice';

import { customRender, fireEvent } from '../../shared/testUtils';
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
  let mockUseDispatch, dummyDispatch, mockAddFavorite, mockRemoveFavorite;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockAddFavorite = jest
      .spyOn(mockActions, 'addFavorite')
      .mockImplementation(jest.fn(() => {}));

    mockRemoveFavorite = jest
      .spyOn(mockActions, 'removeFavorite')
      .mockImplementation(jest.fn(() => {}));
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockUseDispatch = null;
    dummyDispatch = null;
    mockAddFavorite = null;
    mockRemoveFavorite = null;
  });

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

  test('calls dispatch on button click', () => {
    const { getByRole } = customRender(<FavoriteBtn exerciseId={'id1'} />, {
      preloadedState: mockState,
    });

    fireEvent.click(getByRole('button'));

    expect(dummyDispatch).toBeCalled();
  });

  test('calls addFavorite if the exercise is not a favorite', () => {
    const { getByRole } = customRender(<FavoriteBtn exerciseId={'id4'} />, {
      preloadedState: mockState,
    });

    fireEvent.click(getByRole('button'));

    expect(mockAddFavorite).toBeCalled();
  });

  test('calls removeFavorite if the exercise is a favorite', () => {
    const { getByRole } = customRender(<FavoriteBtn exerciseId={'id1'} />, {
      preloadedState: mockState,
    });

    fireEvent.click(getByRole('button'));

    expect(mockRemoveFavorite).toBeCalled();
  });
});
