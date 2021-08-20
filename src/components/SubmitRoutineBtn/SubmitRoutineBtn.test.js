import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import SubmitRoutineBtn from './SubmitRoutineBtn';
import { submitRoutineBtnUtils as utils } from './submitRoutineBtnUtils';
import * as favoritesSlice from '../../store/favoritesSlice';
import {
  customRender,
  waitFor,
  fireEvent,
  createSpy,
} from '../../shared/testUtils';

//1: Test that noRoutineName error is cleared after a routine name is put in -- CREATEROUTINE
//2: Test that if the routine title changes and the nameTaken error is present, that it is removed -- CREATEROUTINE
//3: Test that noWorkouts error is cleared if a workout is added -- CREATEROTUINE

describe('<SubmitRoutineBtn />', () => {
  let dummyDispatch,
    mockUseDispatch,
    mockFetchActiveRoutine,
    mockNameTaken,
    mockCreateRoutine,
    mockUpdateRoutine;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);
    mockFetchActiveRoutine = createSpy(
      favoritesSlice,
      'fetchActiveRoutine',
      Promise.resolve(null)
    );
    mockNameTaken = createSpy(
      utils,
      'checkForPreviousNameUse',
      Promise.resolve(false)
    );
    mockCreateRoutine = createSpy(utils, 'createRoutine', Promise.resolve({}));
    mockUpdateRoutine = createSpy(utils, 'updateRoutine', Promise.resolve({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
    dummyDispatch = null;
    mockUseDispatch = null;
    mockFetchActiveRoutine = null;
    mockNameTaken = null;
    mockCreateRoutine = null;
    mockUpdateRoutine = null;
  });

  test('if there are no workouts, the noWorkoutError is displayed', () => {
    const { getByText } = customRender(<SubmitRoutineBtn />);

    fireEvent.click(getByText('Edit routine'));

    expect(
      getByText('A routine must contain at least one workout')
    ).toBeInTheDocument();

    expect(mockFetchActiveRoutine).not.toBeCalled();
  });

  test('if there is no routine name, the noRoutineName error is displayed', () => {
    const { getByText } = customRender(<SubmitRoutineBtn containsWorkout />);

    fireEvent.click(getByText('Edit routine'));

    expect(getByText('A routine must have a title')).toBeInTheDocument();

    expect(mockFetchActiveRoutine).not.toBeCalled();
  });

  test('if the name is taken, display the name taken error', async () => {
    mockNameTaken.mockImplementation(jest.fn(() => Promise.resolve(true)));

    const props = {
      containsWorkout: true,
      valid: true,
      shouldCreateNewRoutine: true,
    };

    const { getByText } = customRender(<SubmitRoutineBtn {...props} />);

    fireEvent.click(getByText('Create new routine'));

    await waitFor(() => expect(mockNameTaken).toBeCalled());

    expect(
      getByText(
        'That routine name is already taken, please try a different name'
      )
    ).toBeInTheDocument();
  });

  const props = {
    containsWorkout: true,
    valid: true,
    shouldCreateNewRoutine: true,
    isActiveRoutine: true,
    workouts: [1, 2, 3],
    title: 'title',
  };

  test('It calls createRoutine with the expected object if all checks pass, redirects the page, and dispatches fetchActiveRoutine', async () => {
    const history = createMemoryHistory();

    const { getByText } = customRender(
      <Router history={history}>
        <SubmitRoutineBtn {...props} />
      </Router>
    );

    fireEvent.click(getByText('Create new routine'));

    const expectedObject = {
      title: 'title',
      workouts: [1, 2, 3],
      activeRoutine: true,
    };

    await waitFor(() =>
      expect(mockCreateRoutine).toBeCalledWith(
        expect.objectContaining(expectedObject),
        null,
        null
      )
    );

    await waitFor(() => expect(mockFetchActiveRoutine).toBeCalled());

    expect(history.location.pathname).toBe('/my-profile');
  });

  test('It calls updateRoutine with the expected object if all checks pass, redirects the page, and does not dispatch fetchActiveRoutine', async () => {
    const history = createMemoryHistory();
    const newProps = {
      ...props,
      isActiveRoutine: false,
      shouldCreateNewRoutine: false,
      firebaseId: 'firebaseId',
    };

    const mockState = {
      favorites: {
        activeRoutine: {},
      },
    };

    const { getByText } = customRender(
      <Router history={history}>
        <SubmitRoutineBtn {...newProps} />
      </Router>,
      { preloadedState: mockState }
    );

    fireEvent.click(getByText('Edit routine'));

    const expectedObject = {
      title: 'title',
      workouts: [1, 2, 3],
      activeRoutine: false,
    };

    await waitFor(() =>
      expect(mockUpdateRoutine).toBeCalledWith(
        expect.objectContaining(expectedObject),
        null,
        null,
        'firebaseId'
      )
    );

    await waitFor(() => expect(mockFetchActiveRoutine).not.toBeCalled());

    expect(history.location.pathname).toBe('/my-profile');
  });
});
