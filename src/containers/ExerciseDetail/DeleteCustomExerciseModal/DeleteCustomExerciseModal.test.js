import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { customRender, fireEvent } from '../../../shared/testUtils';
import DeleteCustomExerciseModal from './DeleteCustomExerciseModal';
import { exerciseDetailUtils as utils } from '../exerciseDetailUtils';
import * as mockActions from '../../../store/favoritesSlice';

const mockState = {
  favorites: {
    ids: [1],
    entities: { 1: { id: 1, exerciseId: 'id1', firebaseId: 1 } },
  },
};

const props = {
  exerciseId: 'id1',
  show: true,
  closeModal: jest.fn(),
};

describe('<DeleteCustomExerciseModal />', () => {
  let mockUseDispatch,
    dummyDispatch,
    mockRemoveFavorite,
    mockDeleteExercise,
    history;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);
    history = createMemoryHistory();

    mockRemoveFavorite = jest
      .spyOn(mockActions, 'removeFavorite')
      .mockImplementation(jest.fn(() => {}));

    mockDeleteExercise = jest
      .spyOn(utils, 'deleteCustomExercise')
      .mockImplementation(jest.fn(() => {}));
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockUseDispatch = null;
    dummyDispatch = null;
    mockRemoveFavorite = null;
    mockDeleteExercise = null;
    history = null;
  });

  function setup() {
    const { getByTestId } = customRender(
      <Router history={history}>
        <DeleteCustomExerciseModal {...props} />
      </Router>,
      { preloadedState: mockState }
    );

    return getByTestId;
  }

  test('renders when show is set to true', () => {
    const getByTestId = setup();

    expect(getByTestId('deleteExerciseModal')).toBeInTheDocument();
  });

  test('dispatches removeFavorite if exercise is a favorite', () => {
    const getByTestId = setup();

    fireEvent.click(getByTestId('deleteExerciseBtn'));
    expect(mockRemoveFavorite).toHaveBeenCalled();
  });

  test('calls deleteExercise when button is clicked', () => {
    const getByTestId = setup();

    fireEvent.click(getByTestId('deleteExerciseBtn'));
    expect(mockDeleteExercise).toHaveBeenCalled();
  });

  test('closes the modal and pushes the history after deleting an exercise', () => {
    const getByTestId = setup();

    fireEvent.click(getByTestId('deleteExerciseBtn'));
    expect(props.closeModal).toHaveBeenCalled();
    expect(history.location.pathname).toBe('/search');
  });

  test('closes the modal on the cancel button', () => {
    const getByTestId = setup();

    fireEvent.click(getByTestId('cancelBtn'));
    expect(props.closeModal).toHaveBeenCalled();
  });
});
