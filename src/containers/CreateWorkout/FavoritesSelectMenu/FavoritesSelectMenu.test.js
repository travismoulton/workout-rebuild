import * as reactRedux from 'react-redux';

import * as mockActions from '../../../store/workoutSlice';
import {
  customRender,
  findByText,
  fireEvent,
  waitFor,
} from '../../../shared/testUtils';
import FavoritesSelectMenu from './FavoritesSelectMenu';
import { favoriteSelectMenuUtils as utils } from './favoriteSelectMenuUtils';

//3: Test that it's calling addExercise

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

const mockExercises = {
  1: { name: 'mock exercise 1', id: 'id1', category: 10 },
  2: { name: 'mock exercise 2', id: 'id2', category: 8 },
  3: { name: 'mock exercise 3', id: 'id3', category: 10 },
  4: { name: 'mock exercise 4', id: 'id4', category: 9 },
};

describe('<FavoritesSelectMenu />', () => {
  let dummyDispatch,
    mockUseDispatch,
    mockAddExercise,
    mockFetchMaster,
    mockFetchCustom;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockAddExercise = jest
      .spyOn(mockActions, 'addExercise')
      .mockImplementation(jest.fn(() => {}));

    mockFetchMaster = jest
      .spyOn(utils, 'fetchMasterExerciseList')
      .mockImplementation(jest.fn(() => Promise.resolve(mockExercises)));

    mockFetchCustom = jest
      .spyOn(utils, 'fetchCustomExercises')
      .mockImplementation(jest.fn(() => Promise.resolve(null)));
  });

  afterEach(() => {
    jest.clearAllMocks();
    dummyDispatch = null;
    mockUseDispatch = null;
    mockAddExercise = null;
    mockFetchCustom = null;
    mockFetchMaster = null;
  });

  const setup = () => {
    const { getByTestId, findByText, getByLabelText, queryByText } =
      customRender(<FavoritesSelectMenu toggleLoaded={jest.fn()} />, {
        preloadedState: mockState,
      });

    return { getByTestId, findByText, getByLabelText, queryByText };
  };

  const simulateFetch = async () => {
    await waitFor(() => {
      expect(mockFetchMaster).toBeCalled();
      expect(mockFetchCustom).toBeCalled();
    });
  };

  const openSelectMenu = (select) => {
    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });
  };

  test('renders as expected filters duplicate categories, and only adds favorites to the select menu', async () => {
    const { getByLabelText, queryByText, getByTestId } = setup();

    await simulateFetch();

    openSelectMenu(getByLabelText('Add exercise from favorites'));

    expect(queryByText('Arms')).toBeInTheDocument();
    expect(queryByText('mock exercise 1')).toBeInTheDocument();

    expect(queryByText('Abs')).toBeInTheDocument();

    expect(queryByText('Legs')).toBeNull();
    expect(queryByText('mock exercise 4')).toBeNull();

    expect(getByTestId('select-badge-2')).toBeInTheDocument();
  });

  test('calls addExercise when one is clicked', async () => {
    const { getByLabelText, queryByText } = setup();

    await simulateFetch();

    openSelectMenu(getByLabelText('Add exercise from favorites'));

    fireEvent.click(queryByText('mock exercise 1'));

    await waitFor(() => expect(mockAddExercise).toBeCalled());
  });
});
