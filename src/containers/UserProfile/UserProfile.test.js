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

// userProfile --> Workouts

//4: Test that when deleting a workout, if it belings to a routine, the warning modal pops update
// --> Test that when clicking yes, removeWorkoutFromRoutine is called once for every routine the workout was in, and clearRoutines is dispatched
//5: If it doesn't belong to a routine, the regular modal pops up. dleteWorkout is called, and removeWorkout is dispatched

// userProfile --> Routines

//6: the this is your active routine message is displayed if active
//7: setCurrentRoutine btn makes changeActiveRoutine api call and dispatches setActiveRoutine in favoritesSlice
//8: deleteRoutine btn calls deleteRoutine, dispatches removeRoutine, and if the acticeRoutine, dispatches setActiveRoutine to null

// userProfile --> recordedWorkouts

//9: clicking the deleteRecord btn calls deleteRecord and dispatches removeRecord

function setup(activeRoutine, isActiveRoutine, message) {
  const history = createMemoryHistory();

  if (message) history.location.state = message;

  const preloadedState = generateMockState(activeRoutine, isActiveRoutine);

  const { getByText } = customRender(
    <Router history={history}>
      <UserProfile history={history} />
    </Router>,
    { preloadedState }
  );

  return { history, getByText };
}

describe('<UserProfile />', () => {
  let mockDeleteWorkout,
    mockRemoveWorkout,
    mockClearRoutines,
    mockFetchRoutines;

  beforeEach(() => {
    createSpy(reactRedux, 'useDispatch', jest.fn());
    mockDeleteWorkout = createSpy(
      utils.workouts,
      'deleteWorkout',
      Promise.resolve({})
    );
    mockRemoveWorkout = createSpy(
      utils.workouts,
      'removeWorkoutFromRoutine',
      Promise.resolve({})
    );
    mockClearRoutines = createSpy(userProfileSlice, 'clearRoutines', null);

    // Come back to this. Will need to determine return value
    mockFetchRoutines = createSpy(
      userProfileSlice,
      'fetchRoutines',
      Promise.resolve({})
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockDeleteWorkout = null;
    mockRemoveWorkout = null;
    mockClearRoutines = null;
    mockFetchRoutines = null;
  });

  test('message displays if passed', async () => {
    const { getByText } = setup(null, false, { message: 'test message' });
    expect(getByText('test message')).toBeInTheDocument();
  });

  test('when deleting a workout that does not belong to a routine, delete workout is called and remove from routine is not', () => {
    const { getByText } = setup(null, false, null);
    fireEvent.click(getByText('workouts'));
  });
});
