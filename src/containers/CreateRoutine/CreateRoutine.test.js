import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import CreateRoutine from './CreateRoutine';
import {
  customRender,
  waitFor,
  fireEvent,
  createSpy,
} from '../../shared/testUtils';
import { workouts, mockHistory } from './mock';
import { submitRoutineBtnUtils as btnUtils } from '../../components/SubmitRoutineBtn/submitRoutineBtnUtils';
import { createRoutineUtils as utils } from './createRoutineUtils';

describe('<CreateRoutine />', () => {
  let mockFetchWorkouts, mockCreateRotuine, mockUpdateRoutine, mockCheckNameUse;

  beforeEach(() => {
    mockCheckNameUse = createSpy(
      btnUtils,
      'checkForPreviousNameUse',
      Promise.resolve(false)
    );
    mockCreateRotuine = createSpy(
      btnUtils,
      'createRoutine',
      Promise.resolve({})
    );
    mockUpdateRoutine = createSpy(
      btnUtils,
      'updateRoutine',
      Promise.resolve({})
    );
    mockFetchWorkouts = createSpy(
      utils,
      'fetchWorkouts',
      Promise.resolve({ data: workouts })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockFetchWorkouts = null;
    mockCreateRotuine = null;
    mockUpdateRoutine = null;
    mockCheckNameUse = null;
  });

  function setup(mockHistory) {
    const history = createMemoryHistory();
    history.location.state = mockHistory || null;

    const { getByText, getByLabelText, queryByText } = customRender(
      <Router history={history}>
        <CreateRoutine history={history} />
      </Router>,
      // Put an active routine in the state so SubmitActiveRoutine doesn't dispatch fetchActiveRoutine
      { preloadedState: { favorites: { activeRoutine: {} } } }
    );

    return { history, getByLabelText, getByText, queryByText };
  }

  function openSelectMenu(select) {
    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });
  }

  test('builds the workout menu as expected', async () => {
    const { getByText, getByLabelText } = setup(null);

    await waitFor(() => expect(mockFetchWorkouts).toBeCalled());

    openSelectMenu(getByLabelText('Monday'));

    expect(getByText('workout1')).toBeInTheDocument();
  });

  // Object the call to create / edit routine should be called with
  const expectedObject = {
    title: 'mock routine',
    workouts: ['workout1', 'workout2', 'Rest', 'Rest', 'Rest', 'Rest', 'Rest'],
    activeRoutine: false,
  };

  test('Passes the proper props to SubmitRoutineBtn', async () => {
    const { getByText, getByLabelText } = setup(null);
    await waitFor(() => expect(mockFetchWorkouts).toBeCalled());

    openSelectMenu(getByLabelText('Monday'));
    fireEvent.click(getByText('workout1'));

    openSelectMenu(getByLabelText('Tuesday'));
    fireEvent.click(getByText('workout2'));

    const titleInput = getByLabelText('Routine name');
    userEvent.type(titleInput, 'mock routine');

    fireEvent.click(getByText('Create new routine'));

    await waitFor(() =>
      expect(mockCreateRotuine).toBeCalledWith(
        expect.objectContaining(expectedObject),
        null,
        null
      )
    );
  });

  test('If routine data is passed through history the page populates correctly', async () => {
    const { getByText, getByLabelText } = setup(mockHistory);
    await waitFor(() => expect(mockFetchWorkouts).toBeCalled());

    expect(getByLabelText('Routine name')).toHaveValue('historyWorkout');

    fireEvent.click(getByText('Edit routine'));

    await waitFor(() =>
      expect(mockUpdateRoutine).toBeCalledWith(
        expect.objectContaining({ ...expectedObject, title: 'historyWorkout' }),
        null,
        null,
        'firebaseId'
      )
    );
  });

  test('noRoutineName error is cleared after a routine name is put in', async () => {
    const { getByText, getByLabelText, queryByText } = setup();
    await waitFor(() => expect(mockFetchWorkouts).toBeCalled());

    openSelectMenu(getByLabelText('Monday'));
    fireEvent.click(getByText('workout1'));

    fireEvent.click(getByText('Create new routine'));

    expect(getByText('A routine must have a title')).toBeInTheDocument();

    const titleInput = getByLabelText('Routine name');
    userEvent.type(titleInput, 'title');

    expect(queryByText('A routine must have a title')).not.toBeInTheDocument();
  });

  test('nameTakenError is cleared if the title is changed', async () => {
    mockCheckNameUse.mockImplementation(jest.fn(() => Promise.resolve(true)));

    const { getByText, queryByText, getByLabelText } = setup();
    await waitFor(() => expect(mockFetchWorkouts).toBeCalled());

    // Add a workout to the routine to avoid the lack of workout error
    openSelectMenu(getByLabelText('Monday'));
    fireEvent.click(getByText('workout1'));

    // Give the routine a title to avoid the noTitle error
    const titleInput = getByLabelText('Routine name');
    userEvent.type(titleInput, 'title');

    fireEvent.click(getByText('Create new routine'));

    const nameTakenMsg =
      'That routine name is already taken, please try a different name';

    await waitFor(() => expect(mockCheckNameUse).toBeCalled());
    expect(getByText(nameTakenMsg)).toBeInTheDocument();

    userEvent.clear(titleInput);

    expect(queryByText(nameTakenMsg)).not.toBeInTheDocument();
  });

  test('noWorkouts error is cleared if a workout is added', async () => {
    const { getByText, queryByText, getByLabelText } = setup();
    await waitFor(() => expect(mockFetchWorkouts).toBeCalled());

    const titleInput = getByLabelText('Routine name');
    userEvent.type(titleInput, 'title');

    fireEvent.click(getByText('Create new routine'));

    const errorMessage = 'A routine must contain at least one workout';
    expect(getByText(errorMessage)).toBeInTheDocument();

    openSelectMenu(getByLabelText('Monday'));
    fireEvent.click(getByText('workout1'));

    expect(queryByText(errorMessage)).not.toBeInTheDocument();
  });
});
