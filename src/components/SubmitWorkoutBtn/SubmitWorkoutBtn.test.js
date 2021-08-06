import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import * as mockActions from '../../store/workoutSlice';
import {
  customRender,
  fireEvent,
  createSpy,
  waitFor,
  screen,
} from '../../shared/testUtils';
import { submitWorkoutBtnUtils as utils } from './submitWorkoutBtnUtils';
import SubmitWorkoutBtn from './SubmitWorkoutBtn';

describe('<SubmitWorkoutBtn />', () => {
  let dummyDispatch,
    mockUseDispatch,
    mockCreateWorkout,
    mockUpdateWorkout,
    mockClearExercises,
    mockResetStore,
    mockNameTaken;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockCreateWorkout = createSpy(utils, 'createWorkout', Promise.resolve(''));
    mockUpdateWorkout = createSpy(utils, 'updateWorkout', Promise.resolve(''));
    mockNameTaken = createSpy(
      utils,
      'checkForPreviousNameUse',
      Promise.resolve(false)
    );
    mockResetStore = createSpy(mockActions, 'resetWorkoutStore', null);
    mockClearExercises = createSpy(mockActions, 'clearExercises', null);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockUseDispatch = null;
    mockCreateWorkout = null;
    mockUpdateWorkout = null;
    mockClearExercises = null;
    mockResetStore = null;
    mockNameTaken = null;
  });

  const props = {
    formIsValid: true,
    shouldCreateNewWorkout: true,
    firebaseId: 'id1',
  };

  const mockState = {
    workout: {
      ids: ['id1'],
      entities: { id1: { name: 'exercise', sets: [{ reps: 1, weight: 5 }] } },
      formData: {
        workoutName: 'workout',
        targetArea: { value: 12, label: 'back' },
        secondaryTarget: { value: 8, label: 'arms' },
      },
    },
  };

  function setup(props) {
    const history = createMemoryHistory();
    const { getByText } = customRender(
      <Router history={history}>
        <SubmitWorkoutBtn {...props} />
      </Router>,
      { preloadedState: mockState }
    );

    return { getByText, history };
  }

  const expectedObject = {
    title: 'workout',
    targetAreaCode: 12,
    targetArea: 'back',
    secondaryTargetCode: 8,
    secondaryTargetArea: 'arms',
    exercises: [{ name: 'exercise', sets: [{ reps: 1, weight: 5 }] }],
  };

  test('renders', () => {
    const { getByText } = customRender(<SubmitWorkoutBtn />);
    expect(getByText('Update Workout')).toBeInTheDocument();
  });

  test('calls create exercise on button click if passed createNewExercise prop', async () => {
    const { getByText, history } = setup(props);

    fireEvent.click(getByText('Create Workout'));

    await waitFor(() =>
      expect(mockCreateWorkout).toBeCalledWith(
        null,
        null,
        expect.objectContaining(expectedObject)
      )
    );

    await waitFor(() => expect(history.location.pathname).toBe('/my-profile'));
  });

  test('calls updateExercise when not passed shouldCreateNewExercise prop', async () => {
    const { getByText } = setup({ ...props, shouldCreateNewWorkout: false });

    fireEvent.click(getByText('Update Workout'));

    await waitFor(() =>
      expect(mockUpdateWorkout).toBeCalledWith(
        null,
        null,
        'id1',
        expect.objectContaining(expectedObject)
      )
    );
  });

  test('displays an error message when the name of that workout is taken', async () => {
    const { getByText } = setup(props);

    mockNameTaken.mockImplementation(jest.fn(() => Promise.resolve(true)));

    fireEvent.click(getByText('Create Workout'));

    await waitFor(() => expect(mockNameTaken).toBeCalled());

    expect(
      getByText('That name is already taken, please try a different name')
    ).toBeInTheDocument();

    expect(mockCreateWorkout).not.toBeCalled();
  });
});
