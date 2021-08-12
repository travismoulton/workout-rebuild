import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import * as workoutSlice from '../../store/workoutSlice';
import {
  customRender,
  fireEvent,
  createSpy,
  waitFor,
} from '../../shared/testUtils';
import { submitWorkoutBtnUtils as utils } from '../../components/SubmitWorkoutBtn/submitWorkoutBtnUtils';
import CreateWorkout from './CreateWorkout';

//7: Test that if nameIsTaken error is true, that a change in the workoutName input field removes the error

describe('<CreateWorkout />', () => {
  let dummyDispatch,
    mockUseDispatch,
    mockEnterSearch,
    mockNameTaken,
    mockResetStore,
    mockClearExercises,
    mockSetForm,
    mockSetFirebaseId,
    mockSetExercises;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockSetExercises = createSpy(workoutSlice, 'setExercises', null);
    mockClearExercises = createSpy(workoutSlice, 'clearExercises', null);
    mockResetStore = createSpy(workoutSlice, 'resetWorkoutStore', null);
    mockEnterSearch = createSpy(workoutSlice, 'enterSearchMode', null);
    mockSetFirebaseId = createSpy(workoutSlice, 'setFirebaseId', null);
    mockSetForm = createSpy(workoutSlice, 'setFormData', null);

    mockNameTaken = createSpy(
      utils,
      'checkForPreviousNameUse',
      Promise.resolve(true)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockUseDispatch = null;
    dummyDispatch = null;
    mockEnterSearch = null;
    mockNameTaken = null;
    mockClearExercises = null;
    mockResetStore = null;
    mockSetFirebaseId = null;
    mockSetExercises = null;
    mockSetForm = null;
  });

  function setup(workout, state) {
    const mockState = state || { favorites: { noFavorites: true } };
    const history = createMemoryHistory();

    if (workout) history.location.state = { workout };

    const {
      getByLabelText,
      getByText,
      getByTestId,
      queryByLabelText,
      queryByText,
    } = customRender(
      <Router history={history}>
        <CreateWorkout history={history} />
      </Router>,
      { preloadedState: mockState }
    );

    return {
      getByText,
      queryByLabelText,
      getByLabelText,
      getByTestId,
      queryByText,
      history,
    };
  }

  test('if there are favorites, it loads a spinner', () => {
    const { getByTestId } = setup();
    expect(getByTestId('Spinner')).toBeInTheDocument();
  });

  test('if there are no favorites, it does not load the select menu', async () => {
    const { queryByLabelText } = setup();

    expect(queryByLabelText('Add exercise from favorites')).toBeNull();

    expect(queryByLabelText('Workout Name')).toBeInTheDocument();
  });

  test('if there is workout data inside history the details form populates correctly', async () => {
    const workout = {
      exercises: [
        {
          name: 'exercise',
          id: 'exerciseId',
          firebaseId: 'firebaseId',
          focus: 'reps',
          sets: [{ reps: 10, weight: 100 }],
        },
      ],
      title: 'workout',
      targetAreaCode: 8,
      secondaryTargetCode: 9,
    };

    const { getByLabelText, getByText } = setup(workout);

    await waitFor(() => {
      expect(getByLabelText('Workout Name')).toHaveValue('workout');
      expect(getByText('Arms')).toBeInTheDocument();
      expect(getByText('Legs')).toBeInTheDocument();
    });
  });

  test('dispatches enter search mode and redirects the page on clicking the add from search menu button', async () => {
    const { getByText, history } = setup();

    const btn = getByText('Add from exercise search menu');

    fireEvent.click(btn);

    await waitFor(() => expect(mockEnterSearch).toBeCalled());
    expect(history.location.pathname).toBe('/search');
  });

  const mockState = {
    favorites: {
      noFavorites: true,
    },
    workout: {
      formData: {
        workoutName: 'mock workout',
        targetArea: 'Arms',
        secondaryTarget: 'Abs',
      },
      entities: {
        exerciseId: {
          id: 'exerciseId',
          focus: 'reps',
          sets: [{ reps: 10, weight: 50 }],
        },
      },
      ids: ['exerciseId'],
    },
  };

  test('clears form data when clear form button is clicked', () => {
    const { getByText, getByLabelText } = setup(null, mockState);

    const input = getByLabelText('Workout Name');
    expect(input).toHaveValue('mock workout');

    const btn = getByText('Clear form');
    fireEvent.click(btn);

    expect(mockClearExercises).toBeCalled();
    expect(mockResetStore).toBeCalled();

    expect(input).toHaveValue('');
  });

  test('that if the name taken error is true, that a change to workout name input removes the error message', async () => {
    const { getByText, queryByText, getByLabelText } = setup(null, mockState);

    fireEvent.click(getByText('Update Workout'));

    await waitFor(() => expect(mockNameTaken).toBeCalled());

    const errorMsg = 'That name is already taken, please try a different name';

    expect(queryByText(errorMsg)).toBeInTheDocument();

    userEvent.clear(getByLabelText('Workout Name'));

    await waitFor(() => expect(mockSetForm).toBeCalled());

    await waitFor(() => expect(queryByText(errorMsg)).toBeNull());
  });
});
