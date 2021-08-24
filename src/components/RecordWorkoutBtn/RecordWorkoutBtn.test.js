import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import {
  customRender,
  fireEvent,
  waitFor,
  createSpy,
  getByTestId,
} from '../../shared/testUtils';
import RecordWorkoutBtn from './RecordWorkoutBtn';
import { recordWorkoutBtnUtils as utils } from './recordWorkoutBtnUtils';

// Test that submitRecordWorkout is called with the proper object and that the page is redirected

const mockExercises = [
  {
    focus: 'reps',
    id: 'exerciseId',
    name: 'exercise',
    sets: [{ weight: 50, reps: 10 }],
  },
];

const mockWorkout = {
  firebaseId: 'firebaseId',
  title: 'mock workout',
  exercises: mockExercises,
};

const props = {
  date: new Date(2021, 8, 24),
  updateWorkoutInFirebase: jest.fn(),
  isUpdated: true,
  workout: mockWorkout,
};

describe('RecordWorkoutBtn', () => {
  let mockRecordWorkout;

  beforeEach(() => {
    mockRecordWorkout = createSpy(
      utils,
      'submitRecordedWorkout',
      Promise.resolve({})
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockRecordWorkout = null;
  });

  function setup(props) {
    const history = createMemoryHistory();

    const { getByText, getByTestId } = customRender(
      <Router history={history}>
        <RecordWorkoutBtn {...props} />
      </Router>
    );

    return { getByText, getByTestId, history };
  }

  const expectedObject = {
    date: { day: 24, year: 2021, month: 8 },
    exercises: mockExercises,
    title: 'mock workout',
  };

  test('submitRecordWorkout is called with the proper object, the page is redirected, and updateWorkoutInFirebase is called when isUpdated is true', async () => {
    const { history, getByText, getByTestId } = setup(props);

    fireEvent.click(getByText('Record workout'));

    expect(getByTestId('Modal')).toBeInTheDocument();

    fireEvent.click(getByText('Yes'));

    expect(props.updateWorkoutInFirebase).toBeCalled();
    await waitFor(() =>
      expect(mockRecordWorkout).toBeCalledWith(
        null,
        null,
        expect.objectContaining(expectedObject)
      )
    );
    expect(history.location.pathname).toBe('/my-profile');
  });

  test('submitRecordWorkout is called without updating the workout in firebase if isUdated is false', async () => {
    const { getByText, history } = setup({ ...props, isUpdated: false });

    fireEvent.click(getByText('Record workout'));
    expect(props.updateWorkoutInFirebase).not.toBeCalled();

    await waitFor(() =>
      expect(mockRecordWorkout).toBeCalledWith(
        null,
        null,
        expect.objectContaining(expectedObject)
      )
    );

    expect(history.location.pathname).toBe('/my-profile');
  });
});
