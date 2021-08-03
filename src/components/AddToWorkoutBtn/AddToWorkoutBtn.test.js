import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import * as mockActions from '../../store/workoutSlice';
import { customRender, fireEvent, waitFor } from '../../shared/testUtils';
import AddToWorkoutBtn from './AddToWorkoutBtn';

describe('<AddToWorkoutBtn />', () => {
  let dummyDispatch, mockUseDispatch, mockAddExercise;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockAddExercise = jest
      .spyOn(mockActions, 'addExercise')
      .mockImplementation(jest.fn(() => {}));
  });

  afterEach(() => {
    jest.clearAllMocks();
    dummyDispatch = null;
    mockUseDispatch = null;
    mockAddExercise = null;
  });

  test('renders', () => {
    const { getByText } = customRender(<AddToWorkoutBtn />);
    expect(getByText('Add to workout')).toBeInTheDocument();
  });

  test('dispatches addExercise and changes route on click', async () => {
    const history = createMemoryHistory();
    const { getByText } = customRender(
      <Router history={history}>
        <AddToWorkoutBtn name="name" id="id" />
      </Router>
    );

    fireEvent.click(getByText('Add to workout'));

    await waitFor(() =>
      expect(mockAddExercise).toBeCalledWith(
        expect.objectContaining({
          name: 'name',
          id: expect.any(String),
          sets: [{ weight: 0, reps: 0 }],
          focus: 'reps',
        })
      )
    );

    expect(history.location.pathname).toBe('/create-workout');
  });
});
