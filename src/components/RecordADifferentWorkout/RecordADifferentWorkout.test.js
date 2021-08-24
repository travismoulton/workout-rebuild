import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import {
  customRender,
  fireEvent,
  waitFor,
  createSpy,
} from '../../shared/testUtils';
import RecordADifferentWorkout from './RecordADifferentWorkout';
import { recordADifferentWorkoutUtils as utils } from './recordADifferentWorkoutUtils';

const workouts = {
  data: {
    workout1: { title: 'workout1', firebaseId: 'workout1' },
    workout2: { title: 'workout2', firebaseId: 'workout2' },
  },
};

const routineWorkouts = {
  routineWorkout1: { title: 'routineWorkout1', firebaseId: 1 },
  routineWorkout2: { title: 'routineWorkout2', firebaseId: 2 },
};

describe('<RecordADifferentWorkout />', () => {
  let mockFetchAllWorkouts, mockFetchWorkoutById;

  beforeEach(() => {
    mockFetchAllWorkouts = createSpy(
      utils,
      'fetchAllWorkouts',
      Promise.resolve({})
    );
    mockFetchWorkoutById = createSpy(
      utils,
      'fetchWorkoutById',
      Promise.resolve({})
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockFetchAllWorkouts = null;
    mockFetchWorkoutById = null;
  });

  function setup(activeRoutine) {
    const { getByText, getByLabelText } = customRender(
      <Router history={createMemoryHistory()}>
        <RecordADifferentWorkout show={true} />
      </Router>,
      {
        preloadedState: {
          favorites: { activeRoutine },
        },
      }
    );

    return { getByText, getByLabelText };
  }

  function openSelectMenu(select) {
    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });
  }

  test('displays no workouts message when there are no workouts', async () => {
    const { getByText } = setup(null);
    await waitFor(() => expect(mockFetchAllWorkouts).toBeCalled());

    expect(
      getByText('You have no workouts available.', { exact: false })
    ).toBeInTheDocument();
  });

  test('loads select menus correctly when workouts are available', async () => {
    const activeRoutine = { workouts: [1, 2] };
    mockFetchAllWorkouts.mockImplementation(
      jest.fn(() => Promise.resolve(workouts))
    );

    mockFetchWorkoutById
      .mockImplementationOnce(
        jest.fn(() =>
          Promise.resolve({ data: routineWorkouts.routineWorkout1 })
        )
      )
      .mockImplementationOnce(
        jest.fn(() =>
          Promise.resolve({ data: routineWorkouts.routineWorkout2 })
        )
      );

    const { getByText, getByLabelText } = setup(activeRoutine);

    await waitFor(() => {
      expect(mockFetchAllWorkouts).toBeCalled();
      expect(mockFetchWorkoutById).toBeCalledTimes(2);
    });

    openSelectMenu(getByLabelText('Choose from active routine'));
    expect(getByText('routineWorkout1')).toBeInTheDocument();

    openSelectMenu(getByLabelText('Choose from all your workouts'));
    expect(getByText('workout1')).toBeInTheDocument();
  });
});
