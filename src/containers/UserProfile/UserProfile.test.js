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

//
// Test this in UserProfile or in each sub component?
//2: Test that clicking on Workouts / Routines / Recorded Workouts card displays the appropriate items
// --> Test that if there aren't any, the link is displayed

//3: Test that clicking edit Routine / Workout pushes the correct path and state
//

// userProfile --> Routines

//6: the this is your active routine message is displayed if active
//7: setCurrentRoutine btn makes changeActiveRoutine api call and dispatches setActiveRoutine in favoritesSlice

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

  return { history, getByText, getAllByText };
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
    mockRemoveRecord;

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
