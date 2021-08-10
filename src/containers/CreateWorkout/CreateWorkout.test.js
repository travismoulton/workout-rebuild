import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';

import * as workoutSlice from '../../store/workoutSlice';
import {
  customRender,
  fireEvent,
  createSpy,
  waitFor,
} from '../../shared/testUtils';
import { submitWorkoutBtnUtils as utils } from '../../components/SubmitWorkoutBtn/submitWorkoutBtnUtils';
import CreateWorkout from './CreateWorkout';

//1: Test that it renders

//4: Test that if there is workout data in the history that the WorkoutDetailsForm populates correctly
//5: Test that after clicking Add Exercise from search that it dispatches enterSearchMode and redirects
//6: Test that if the clearFormData btn is hit, that the form is cleared, resetStore is dispatched, and clearExercises is dispatched
//7: Test that if nameIsTaken error is true, that a change in the workoutName input field removes the error

describe('<CreateWorkout />', () => {
  let dummyDispatch,
    mockUseDispatch,
    mockEnterSearch,
    mockNameTaken,
    mockResetStore,
    mockClearExercises,
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
  });

  test('if there are favorites, it loads a spinner', () => {
    const history = { location: { state: null } };

    const { getByTestId } = customRender(<CreateWorkout history={history} />);
    expect(getByTestId('Spinner')).toBeInTheDocument();
  });

  test('if there are no favorites, it does not load the select menu', async () => {
    const history = { location: { state: null } };
    const mockState = { favorites: { noFavorites: true } };

    const { queryByLabelText } = customRender(
      <CreateWorkout history={history} />,
      {
        preloadedState: mockState,
      }
    );

    expect(queryByLabelText('Add exercise from favorites')).toBeNull();

    expect(queryByLabelText('Workout Name')).toBeInTheDocument();
  });

  test('if there is workout data inside history the details form populates correctly', () => {
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

    const history = { location: { state: { workout } } };

    const mockState = {
      favorites: {
        entities: { fav1: { id: 'fav1', exericseId: 1, firebaseId: 1 } },
        ids: ['fav1'],
      },
    };

    const { getByLabelText } = customRender(
      <CreateWorkout history={history} />,
      {
        preloadedState: mockState,
      }
    );

    expect(getByLabelText('Workout Name')).toHaveValue('exercise');
  });
});
