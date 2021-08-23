import * as reactRedux from 'react-redux';
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

//1: Test that noRoutineName error is cleared after a routine name is put in -- CREATEROUTINE
//2: Test that if the routine title changes and the nameTaken error is present, that it is removed -- CREATEROUTINE
//3: Test that noWorkouts error is cleared if a workout is added -- CREATEROTUINE

//3: Test that if yourine data is passed through history that the page populates correctly

describe('<CreateRoutine />', () => {
  let mockFetchWorkouts, mockCreateRotuine, mockUpdateRoutine;

  beforeEach(() => {
    createSpy(btnUtils, 'checkForPreviousNameUse', Promise.resolve(false));
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
  });

  function setup(mockHistory) {
    const history = createMemoryHistory();
    history.location.state = mockHistory || null;

    const { getByText, getByLabelText } = customRender(
      <Router history={history}>
        <CreateRoutine history={history} />
      </Router>,
      // Put an active routine in the state so SubmitActiveRoutine doesn't dispatch fetchActiveRoutine
      { preloadedState: { favorites: { activeRoutine: {} } } }
    );

    return { history, getByLabelText, getByText };
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

    const expectedObject = {
      title: 'mock routine',
      workouts: [
        'workout1',
        'workout2',
        'Rest',
        'Rest',
        'Rest',
        'Rest',
        'Rest',
      ],
      activeRoutine: false,
    };

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

    expect(getByText('historyWorkout')).toBeInTheDocument();
  });
});
