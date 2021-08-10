import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';

import * as workoutSlice from '../../store/workoutSlice';
import { customRender, fireEvent, createSpy } from '../../shared/testUtils';
import { submitWorkoutBtnUtils as utils } from '../../components/SubmitWorkoutBtn/submitWorkoutBtnUtils';
import CreateWorkout from './CreateWorkout';

//1: Test that it renders
//2: Test that if there are favorites, it first loads a spinner
//3: Test that if there are noFavorites, it loads with no favoriteSelectMenu
//4: Test that if there is workout data in the history that the WorkoutDetailsForm populates correctly
//5: Test that after clicking Add Exercise from search that it dispatches enterSearchMode and redirects
//6: Test that if the clearFormData btn is hit, that the form is cleared, resetStore is dispatched, and clearExercises is dispatched
//7: Test that if nameIsTaken error is true, that a change in the workoutName input field removes the error

describe('<CreateWorkout />', () => {
  let dummyDispatch,
    mockUseDispatch,
    mockEnterSearch,
    mockNameTaken,
    mockResetStore,
    mockClearExercises;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockClearExercises = createSpy(workoutSlice, 'clearExercises', null);
    mockResetStore = createSpy(workoutSlice, 'resetWorkoutStore', null);
    mockEnterSearch = createSpy(workoutSlice, 'enterSearchMode', null);
    mockNameTaken = createSpy(
      utils,
      'checkForPreviousNameUse',
      Promise.resolve(true)
    );

    afterEach(() => {
      jest.clearAllMocks();
      mockUseDispatch = null;
      dummyDispatch = null;
      mockEnterSearch = null;
      mockNameTaken = null;
      mockClearExercises = null;
      mockResetStore = null;
    });
  });

  test('renders', () => {});
});
