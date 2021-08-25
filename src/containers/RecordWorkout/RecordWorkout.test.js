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
import { recordADifferentWorkoutUtils as diffUtils } from '../../components/RecordADifferentWorkout/recordADifferentWorkoutUtils';
import { recordWorkoutBtnUtils as btnUtils } from '../../components/RecordWorkoutBtn/recordWorkoutBtnUtils';
import * as workoutSlice from '../../store/workoutSlice';
import { differentWorkout, workouts } from './mock';

//5: Test that the record a different workout btn brings up the modal.
// -> Also test the functionality? May not be necesary?
//6: Test with a call to change the date, that the suggested workout is updated

describe('<RecordWorkout />', () => {
  let mockFetchWorkoutById,
    mockPushUpdate,
    mockResetStore,
    mockClearExercises,
    mockFetchAllWorkouts,
    mockFetchDiffWorkoutById,
    mockSubmitRecord;

  beforeEach(() => {
    mockFetchWorkoutById = createSpy(
      utils,
      'fetchWorkoutById',
      Promise.resolve(null)
    );
    mockPushUpdate = createSpy(
      utils,
      'pushUpdateToFirebase',
      Promise.resolve({})
    );
    mockResetStore = createSpy(workoutSlice, 'resetWorkoutStore', {
      type: 'workoutSlice/resetWorkoutStore',
    });
    mockClearExercises = createSpy(workoutSlice, 'clearExercises', {
      type: 'workoutSlice/clearExercises',
    });
    mockFetchAllWorkouts = createSpy(
      diffUtils,
      'fetchAllWorkouts',
      Promise.resolve(differentWorkout)
    );
    mockFetchDiffWorkoutById = createSpy(
      diffUtils,
      'fetchWorkoutById',
      Promise.resolve(differentWorkout)
    );
    mockSubmitRecord = createSpy(
      btnUtils,
      'submitRecordedWorkout',
      Promise.resolve(null)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockFetchWorkoutById = null;
    mockPushUpdate = null;
    mockResetStore = null;
    mockClearExercises = null;
    mockFetchAllWorkouts = null;
    mockFetchDiffWorkoutById = null;
    mockSubmitRecord = null;
  });

  function setup(activeRoutine) {
    const history = createMemoryHistory();

    const { getByText, getByTestId, getAllByTestId, getByLabelText } =
      customRender(
        <Router history={history}>
          <RecordWorkout />
        </Router>,
        { preloadedState: { favorites: { activeRoutine } } }
      );

    return { getByText, getByTestId, getAllByTestId, getByLabelText, history };
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

  const awaitFetchCalls = async () =>
    await waitFor(() => {
      expect(mockFetchWorkoutById).toBeCalled();
      expect(mockFetchAllWorkouts).toBeCalled();
      expect(mockFetchDiffWorkoutById).toBeCalledTimes(7);
    });

  test('if the page is redirected, resetStore and clearExercises are dispatched', async () => {
    const { history, getByText } = setup();

    await waitFor(() => expect(mockFetchAllWorkouts).toBeCalled());

    expect(getByText('Rest')).toBeInTheDocument();

    history.push('/');

    expect(mockResetStore).toBeCalled();
    expect(mockClearExercises).toBeCalled();
  });

  test('if a workout in activeRoutine exists for the current day of the week, it is displayed by fault', async () => {
    const dayOfWeekIndex = new Date().getDay();
    const workoutKey = activeRoutine.workouts[dayOfWeekIndex];

    mockFetchWorkoutById.mockReturnValue(Promise.resolve(workouts[workoutKey]));

    const { getByText } = setup(activeRoutine);

    await awaitFetchCalls();

    expect(
      getByText(activeRoutine.workouts[dayOfWeekIndex])
    ).toBeInTheDocument();
  });

  test('if there is a change to the workout, pushUpdateToFirebase is called', async () => {
    const dayOfWeekIndex = new Date().getDay();
    const workoutKey = activeRoutine.workouts[dayOfWeekIndex];

    mockFetchWorkoutById.mockReturnValue(Promise.resolve(workouts[workoutKey]));

    const { getAllByTestId, getByText } = setup(activeRoutine);

    await awaitFetchCalls();

    const deleteExerciseBtns = getAllByTestId('removeExerciseBtn');

    fireEvent.click(deleteExerciseBtns[0]);

    fireEvent.click(getByText('Record workout'));

    // When the modal pops up asking if you would like to save changes to the workout, click yes
    fireEvent.click(getByText('Yes'));
    await waitFor(() => expect(mockPushUpdate).toBeCalled());
    await waitFor(() => expect(mockSubmitRecord).toBeCalled());
  });

  test('if there is a change to the workout, pushUpdateToFirebase is not called if the user clicks no on the popup', async () => {
    const dayOfWeekIndex = new Date().getDay();
    const workoutKey = activeRoutine.workouts[dayOfWeekIndex];

    mockFetchWorkoutById.mockReturnValue(Promise.resolve(workouts[workoutKey]));

    const { getAllByTestId, getByText } = setup(activeRoutine);

    await awaitFetchCalls();

    const deleteExerciseBtns = getAllByTestId('removeExerciseBtn');

    fireEvent.click(deleteExerciseBtns[0]);

    fireEvent.click(getByText('Record workout'));

    // When the modal pops up asking if you would like to save changes to the workout, click yes
    fireEvent.click(getByText('No'));
    await waitFor(() => expect(mockPushUpdate).not.toBeCalled());
    await waitFor(() => expect(mockSubmitRecord).toBeCalled());
  });

  test('when the user clicks record a different workout, the modal appears', async () => {
    const dayOfWeekIndex = new Date().getDay();
    const workoutKey = activeRoutine.workouts[dayOfWeekIndex];

    mockFetchWorkoutById.mockReturnValue(Promise.resolve(workouts[workoutKey]));

    const { getByText, getByLabelText } = setup(activeRoutine);

    await awaitFetchCalls();

    fireEvent.click(getByText('Record a different workout today'));

    const select = getByLabelText('Choose from active routine');

    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCoode: 40 });
    fireEvent.click(getByText('differentWorkout'));
  });
});
