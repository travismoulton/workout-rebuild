import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import CreateRoutine from './CreateRoutine';
import {
  customRender,
  waitFor,
  userEvent,
  fireEvent,
  createSpy,
} from '../../shared/testUtils';
import { workouts, mockHistory } from './mock';
import { submitRoutineBtnUtils as btnUtils } from '../../components/SubmitRoutineBtn/submitRoutineBtnUtils';
import { createRoutineUtils as utils } from './createRoutineUtils';

//1: Test that noRoutineName error is cleared after a routine name is put in -- CREATEROUTINE
//2: Test that if the routine title changes and the nameTaken error is present, that it is removed -- CREATEROUTINE
//3: Test that noWorkouts error is cleared if a workout is added -- CREATEROTUINE

//1: Test that it builds the workout select menu as expected
//2: Test that if workouts are selected added to the routine, the correct props are passed to SubmitRoutineBtn
//   ===> Also test that the title is passed
//3: Test that if yourine data is passed through history that the page populates correctly

describe('<CreateRoutine />', () => {
  let mockFetchWorkouts;

  beforeEach(() => {
    createSpy(btnUtils, 'checkForPreviousNameUse', Promise.resolve(false));
    createSpy(btnUtils, 'createRoutine', Promise.resolve({}));
    createSpy(btnUtils, 'updateRoutine', Promise.resolve({}));
    mockFetchWorkouts = createSpy(
      utils,
      'fetchWorkouts',
      Promise.resolve({ data: workouts })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockFetchWorkouts = null;
  });

  function setup(mockHistory) {
    const history = createMemoryHistory();
    history.location.state = mockHistory || null;

    const { getByText, getByLabelText, queryByText } = customRender(
      <Router history={history}>
        <CreateRoutine history={history} />
      </Router>
    );

    return { history, getByLabelText, getByText, queryByText };
  }

  test('builds the workout menu as expected', async () => {
    const { getByText, getByLabelText, queryByText } = setup(null);

    await waitFor(() => expect(mockFetchWorkouts).toBeCalled());

    fireEvent.focus(getByLabelText('Monday'));
    fireEvent.keyDown(getByText('Monday', { keyCode: 40 }));

    expect(getByText('workout1')).toBeInTheDocument();
  });
});
