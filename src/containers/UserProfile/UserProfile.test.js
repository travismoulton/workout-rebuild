import * as reactRedux from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  customRender,
  fireEvent,
  waitFor,
  createSpy,
} from '../../shared/testUtils';
import { utils, generateMockState, activeRoutine } from './testUtils';
import * as userProfileSlice from '../../store/userProfileSlice';
import * as favoritesSlice from '../../store/favoritesSlice';
import UserProfile from './UserProfile';

function setup(activeRoutine, isActiveRoutine, message) {
  const history = createMemoryHistory();

  if (message) history.location.state = message;

  const preloadedState = generateMockState(activeRoutine, isActiveRoutine);

  const { getByText, getAllByText } = customRender(
    <Router history={history}>
      <UserProfile history={history} />
    </Router>,
    { preloadedState }
  );

  return { history, getByText, getAllByText, state: preloadedState };
}

describe('<UserProfile />', () => {
  const { routines, workouts, records } = utils;

  let mockDeleteWorkout,
    mockRemoveWorkoutApiCall,
    mockClearRoutines,
    mockFetchRoutines,
    mockRemoveWorkoutFromStore,
    mockSetActiveRoutine,
    mockDeleteRoutine,
    mockRemoveRoutineFromStore,
    mockDeleteRecord,
    mockRemoveRecord,
    mockChangeActiveRoutine;

  beforeEach(() => {
    createSpy(reactRedux, 'useDispatch', jest.fn());
    mockDeleteWorkout = createSpy(
      workouts,
      'deleteWorkout',
      Promise.resolve({})
    );
    mockRemoveWorkoutApiCall = createSpy(
      workouts,
      'removeWorkoutFromRoutine',
      Promise.resolve({})
    );
    mockRemoveWorkoutFromStore = createSpy(
      userProfileSlice,
      'removeWorkout',
      null
    );
    mockClearRoutines = createSpy(userProfileSlice, 'clearRoutines', null);
    mockFetchRoutines = createSpy(
      userProfileSlice,
      'fetchRoutines',
      Promise.resolve({})
    );
    mockSetActiveRoutine = createSpy(favoritesSlice, 'setActiveRoutine', null);
    mockDeleteRoutine = createSpy(
      routines,
      'deleteRoutine',
      Promise.resolve({})
    );
    mockRemoveRoutineFromStore = createSpy(
      userProfileSlice,
      'removeRoutine',
      null
    );
    mockDeleteRecord = createSpy(records, 'deleteRecord', Promise.resolve({}));
    mockRemoveRecord = createSpy(userProfileSlice, 'removeRecord', {});
    mockChangeActiveRoutine = createSpy(
      routines,
      'changeActiveRoutineStatus',
      Promise.resolve({})
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockDeleteWorkout = null;
    mockRemoveWorkoutApiCall = null;
    mockClearRoutines = null;
    mockFetchRoutines = null;
    mockRemoveWorkoutFromStore = null;
    mockSetActiveRoutine = null;
    mockDeleteRoutine = null;
    mockChangeActiveRoutine = null;
  });

  test('message displays if passed', async () => {
    const { getByText } = setup(null, false, { message: 'test message' });
    expect(getByText('test message')).toBeInTheDocument();
  });

  test('when deleting a workout that does not belong to a routine, delete workout is called and remove from routine is not', () => {
    const { getByText, getAllByText } = setup(null, false, null);
    fireEvent.click(getByText('My Workouts'));

    // Open the delete workout modal by clicking the delete workout btn
    const deleteWorkoutBtns = getAllByText('Delete workout');
    fireEvent.click(deleteWorkoutBtns[0]);

    // On the modal, click yes to delete workout
    fireEvent.click(getByText('Yes'));

    expect(mockDeleteWorkout).toBeCalled();
    expect(mockRemoveWorkoutApiCall).not.toBeCalled();
    expect(mockRemoveWorkoutFromStore).toBeCalled();
  });

  test('when deleting a workout that does belong to a routine, remove workout should be called, and clear routines and fetch routines should be dispathced', async () => {
    const { getByText, getAllByText } = setup(null, false, null);
    fireEvent.click(getByText('My Workouts'));

    // Open the delete workout modal by clicking the delete workout btn
    const deleteWorkoutBtns = getAllByText('Delete workout');
    fireEvent.click(deleteWorkoutBtns[1]);

    // On the modal, click yes to delete workout
    fireEvent.click(getByText('Yes'));

    expect(mockDeleteWorkout).toBeCalled();
    await waitFor(() => expect(mockRemoveWorkoutApiCall).toBeCalledTimes(2));
    expect(mockClearRoutines).toBeCalled();
    expect(mockFetchRoutines).toBeCalled();
  });

  test('when displaying workouts, displays the correct amount', () => {
    const { getByText, getAllByText } = setup(null, false, null);
    fireEvent.click(getByText('My Workouts'));

    const workoutLinks = getAllByText('Workout name:');
    expect(workoutLinks).toHaveLength(2);
  });

  test('if there are no workouts, displays the no workout link', () => {
    const history = createMemoryHistory();
    const { getByText } = customRender(
      <Router history={history}>
        <UserProfile history={history} />
      </Router>
    );
    fireEvent.click(getByText('My Workouts'));

    const noWorkoutMsg =
      'No workouts available, click here to create a workout';
    expect(getByText(noWorkoutMsg)).toBeInTheDocument();
  });

  test('when clicking edit workout, the pathname is changed and the corerct state is pushed', () => {
    const { getByText, getAllByText, history, state } = setup(
      null,
      false,
      null
    );
    fireEvent.click(getByText('My Workouts'));

    const editWorkoutBtns = getAllByText('Edit workout');
    fireEvent.click(editWorkoutBtns[0]);

    const workout = { workout: state.userProfile.entities['workout-w1'] };

    expect(history.location.pathname).toBe('/workout-detail/workout-1');
    expect(history.location.state).toStrictEqual(
      expect.objectContaining(workout)
    );
  });

  test('when clicking edit routine, the pathname is changed and the correct state is puched', () => {
    const { getByText, getAllByText, history, state } = setup(
      null,
      false,
      null
    );
    fireEvent.click(getByText('My Routines'));

    const editRoutineBtns = getAllByText('Edit routine');
    fireEvent.click(editRoutineBtns[0]);

    const routine = { routine: state.userProfile.entities['routine-r1'] };

    expect(history.location.pathname).toBe('/routine-detail/routine-1');
    expect(history.location.state).toStrictEqual(
      expect.objectContaining(routine)
    );
  });

  test('when displaying routines, displays the correct amount', () => {
    const { getByText, getAllByText } = setup(null, false, null);
    fireEvent.click(getByText('My Routines'));

    const routineLinks = getAllByText('Number of workouts', { exact: false });
    expect(routineLinks).toHaveLength(2);
  });

  test('if there are no routines, displays the no workout link', () => {
    const history = createMemoryHistory();
    const { getByText } = customRender(
      <Router history={history}>
        <UserProfile history={history} />
      </Router>
    );
    fireEvent.click(getByText('My Routines'));

    const noRoutinesMsg =
      'No routines available, click here to create a routine';
    expect(getByText(noRoutinesMsg)).toBeInTheDocument();
  });

  test('if displaying the activeRoutine, the messgae is displayed', () => {
    const { getByText } = setup(activeRoutine, true, null);
    fireEvent.click(getByText('My Routines'));

    expect(getByText('This is your current routine')).toBeInTheDocument();
  });

  test('if you click set as active routine button, changeActive routine status is called twice', async () => {
    const { getByText } = setup(activeRoutine, true, null);
    fireEvent.click(getByText('My Routines'));

    const btn = getByText('Set as current routine');
    fireEvent.click(btn);

    await waitFor(() => expect(mockChangeActiveRoutine).toBeCalledTimes(2));
  });

  test('if deleteing the activeRoutine, setActiveRoutine is dispatched', () => {
    const { getByText, getAllByText } = setup(activeRoutine, true, null);
    fireEvent.click(getByText('My Routines'));

    // Open the delete workout modal by clicking the delete workout btn
    const deleteRoutineBtns = getAllByText('Delete routine');
    fireEvent.click(deleteRoutineBtns[0]);

    fireEvent.click(getByText('Yes'));

    expect(mockDeleteRoutine).toBeCalled();
    expect(mockRemoveRoutineFromStore).toBeCalled();
    expect(mockSetActiveRoutine).toBeCalled();
  });

  test('if deleteing a non active routine, setActiveRoutine is not dispatched', () => {
    const { getByText, getAllByText } = setup(activeRoutine, true, null);
    fireEvent.click(getByText('My Routines'));

    // Open the delete workout modal by clicking the delete workout btn
    const deleteRoutineBtns = getAllByText('Delete routine');
    fireEvent.click(deleteRoutineBtns[1]);

    fireEvent.click(getByText('Yes'));

    expect(mockDeleteRoutine).toBeCalled();
    expect(mockRemoveRoutineFromStore).toBeCalled();
    expect(mockSetActiveRoutine).not.toBeCalled();
  });

  test('deleteRecord and removeRecord are dispatched when a record is deleted', () => {
    const { getByText, getAllByText } = setup(activeRoutine, true, null);
    fireEvent.click(getByText('My Recorded Workouts'));

    // Open the delete workout modal by clicking the delete workout btn
    const deleteRecordBtns = getAllByText('Delete this record');
    fireEvent.click(deleteRecordBtns[1]);

    expect(mockDeleteRecord).toBeCalled();
    expect(mockRemoveRecord).toBeCalled();
  });
});
