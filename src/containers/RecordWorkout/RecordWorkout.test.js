import * as reactRedux from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import RecordWorkout from './RecordWorkout';
import {
  customRender,
  fireEvent,
  waitFor,
  createSpy,
} from '../../shared/testUtils';
import { recordWorkoutUtils as utils } from './recordWorkoutUtils';
import * as workoutSlice from '../../store/workoutSlice';
import { mockWorkout1, mockWorkout2 } from './mock';

//2: Test that getWorkoutBasedOnDay is functioning
//3: Terst that the page is loading the proper workout based on day of the week
//4: Test that if a workout is removed or modified, that an update to Firebase is called
// This might involve a ton of mocking
//5: Test that the record a different workout btn brings up the modal.
// -> Also test the functionality? May not be necesary?
//6: Test with a call to change the date, that the suggested workout is updated

describe('<RecordWorkout />', () => {
  let mockFetchWorkoutById,
    mockPushUpdate,
    dummyDispatch,
    mockResetStore,
    mockClearExercises;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    createSpy(reactRedux, 'useDispatch', dummyDispatch);
    mockFetchWorkoutById = createSpy(
      utils,
      'fetchWorkoutById',
      Promise.resolve(mockWorkout1)
    );
    mockPushUpdate = createSpy(utils, 'pushUpdateToFirebase', null);
    mockResetStore = createSpy(workoutSlice, 'resetWorkoutStore', null);
    mockClearExercises = createSpy(workoutSlice, 'clearExercises', null);
  });

  afterEach(() => {
    jest.clearAllMocks();
    dummyDispatch = null;
    mockFetchWorkoutById = null;
    mockPushUpdate = null;
    mockResetStore = null;
    mockClearExercises = null;
  });

  function setup(activeRoutine) {
    const history = createMemoryHistory();

    const { getByText, getByTestId } = customRender(
      <Router history={history}>
        <RecordWorkout />
      </Router>,
      { preloadedState: { favorites: { activeRoutine } } }
    );

    return { getByText, getByTestId, history };
  }

  const activeRoutine = {
    workouts: [
      'workout1',
      'workout2',
      'workout3',
      'workout4',
      'workout5',
      'workout6',
      'workout7',
    ],
  };

  test('if the page is redirected, resetStore and clearExercises are dispatched', async () => {
    const { history, getByText } = setup();
    expect(getByText('Rest')).toBeInTheDocument();

    history.push('/');

    expect(mockResetStore).toBeCalled();
    expect(mockClearExercises).toBeCalled();
  });

  test('if a workout in activeRoutine exists for the current day of the week, it is displayed by fault', async () => {
    const { getByText } = setup(activeRoutine);

    await waitFor(() => expect(mockFetchWorkoutById).toBeCalled());
    expect(getByText('workout1')).toBeInTheDocument();
  });
});
