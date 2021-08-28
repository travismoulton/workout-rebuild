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

    const {
      getByText,
      getByTestId,
      getAllByTestId,
      getByLabelText,
      getAllByText,
    } = customRender(
      <Router history={history}>
        <RecordWorkout />
      </Router>,
      { preloadedState: { favorites: { activeRoutine } } }
    );

    return {
      getByText,
      getByTestId,
      getAllByTestId,
      getByLabelText,
      getAllByText,
      history,
    };
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

  const adjustForSunday = (dayIndex) => (dayIndex === 0 ? 6 : dayIndex - 1);

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
    const workoutKey = activeRoutine.workouts[adjustForSunday(dayOfWeekIndex)];

    mockFetchWorkoutById.mockReturnValue(Promise.resolve(workouts[workoutKey]));

    const { getByText } = setup(activeRoutine);

    await awaitFetchCalls();

    expect(
      getByText(activeRoutine.workouts[adjustForSunday(dayOfWeekIndex)])
    ).toBeInTheDocument();
  });

  test('if there is a change to the workout, pushUpdateToFirebase is called', async () => {
    const dayOfWeekIndex = new Date().getDay();
    const workoutKey = activeRoutine.workouts[adjustForSunday(dayOfWeekIndex)];

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
    const workoutKey = activeRoutine.workouts[adjustForSunday(dayOfWeekIndex)];

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

  test('when the user clicks record a different workout, the modal appears and switchWorkout is called when the user chooses a workout', async () => {
    const dayOfWeekIndex = new Date().getDay();
    const workoutKey = activeRoutine.workouts[adjustForSunday(dayOfWeekIndex)];

    mockFetchWorkoutById.mockReturnValue(Promise.resolve(workouts[workoutKey]));

    const { getByText, getByLabelText, getAllByText } = setup(activeRoutine);

    await awaitFetchCalls();

    fireEvent.click(getByText('Record a different workout today'));

    const select = getByLabelText('Choose from all your workouts');
    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });
    fireEvent.click(getByText('differentWorkout'));

    const chooseWorkoutBtns = getAllByText('Choose workout');
    await waitFor(() => fireEvent.click(chooseWorkoutBtns[1]));

    // Inside RecordWorkout, check that switchWorkout is being called the correct workoutId
    expect(mockFetchWorkoutById).toBeCalledWith(null, null, 'differentWorkout');
  });

  test('when the user changes the date, the correct workout is populated', async () => {
    const dayOfWeekIndex = new Date().getDay();
    const workoutKey = activeRoutine.workouts[adjustForSunday(dayOfWeekIndex)];

    mockFetchWorkoutById.mockReturnValue(Promise.resolve(workouts[workoutKey]));

    const { getByText, getByTestId } = setup(activeRoutine);

    await awaitFetchCalls();

    fireEvent.click(getByText('Record a workout for a different day'));

    const determineExpectedWorkout = () => {
      const today = new Date();
      const workoutDate = new Date(today.getFullYear(), today.getMonth(), 25);
      const workoutDayOfTheWeekIndex = adjustForSunday(workoutDate.getDay());

      return activeRoutine.workouts[workoutDayOfTheWeekIndex];
    };

    const expectedWorkout = determineExpectedWorkout();

    fireEvent.click(getByTestId('datePicker'));
    fireEvent.click(getByText(25));
    await waitFor(() => fireEvent.click(getByText('Change Date')));

    expect(mockFetchWorkoutById).toBeCalledWith(null, null, expectedWorkout);
  });
});
