import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import * as mockActions from '../../store/workoutSlice';
import {
  customRender,
  fireEvent,
  createSpy,
  waitFor,
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

    mockCreateWorkout = createSpy(
      utils,
      'createWorkout',
      Promise.resolve(null)
    );
    mockUpdateWorkout = createSpy(
      utils,
      'updateWorkout',
      Promise.resolve(null)
    );
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
      ids: ['id1', 'id2', 'id3'],
      entities: { id1: { name: 'exercise', sets: [{ reps: 1, weight: 5 }] } },
      formData: {
        workoutName: 'workout',
        targetArea: { value: 12, label: 'back' },
        secondaryTarget: { value: 8, label: 'arms' },
      },
    },
  };

  function setup() {
    const history = createMemoryHistory();
    const { getByText } = customRender(
      <Router history={history}>
        <SubmitWorkoutBtn {...props} />
      </Router>,
      { preloadedState: mockState }
    );

    return { getByText, history };
  }

  test('renders', () => {
    const { getByText } = customRender(<SubmitWorkoutBtn />);
    expect(getByText('Update Workout')).toBeInTheDocument();
  });

  test('calls create exercise on button click if appropriate', async () => {
    const { getByText } = setup();

    fireEvent.click(getByText('Create Workout'));

    await waitFor(() => expect(mockCreateWorkout).toBeCalled());
  });
});
