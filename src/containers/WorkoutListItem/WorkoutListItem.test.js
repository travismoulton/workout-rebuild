import * as reactRedux from 'react-redux';

import * as mockActions from '../../store/workoutSlice';
import WorkoutListItem from './WorkoutListItem';
import { customRender, fireEvent } from '../../shared/testUtils';

const props = {
  focus: 'reps',
  id: 'id1',
  sets: [
    { reps: 2, weight: 55 },
    { reps: 10, weight: 60 },
  ],
  name: 'exercise',
};

describe('<WorkoutListItem />', () => {
  let dummyDispatch, mockAddSet, mockUseDispatch, mockResetFocus;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockAddSet = jest
      .spyOn(mockActions, 'addSetToExercise')
      .mockImplementation(jest.fn(() => {}));

    mockResetFocus = jest
      .spyOn(mockActions, 'resetExerciseFocus')
      .mockImplementation(jest.fn(() => {}));
  });

  afterEach(() => {
    jest.clearAllMocks();
    dummyDispatch = null;
    mockUseDispatch = null;
    mockAddSet = null;
    mockResetFocus = null;
  });

  test('redners the proper amount of sets', () => {
    const { queryByText } = customRender(<WorkoutListItem {...props} />);
    expect(queryByText('Set # 1')).toBeInTheDocument();
    expect(queryByText('Set # 2')).toBeInTheDocument();
    expect(queryByText('Set # 3')).toBeNull();
  });

  test('updates exercise focus on user selection', () => {
    const { getByText, getByLabelText } = customRender(
      <WorkoutListItem {...props} />
    );

    fireEvent.focus(getByLabelText('Exercise focus:'));
    fireEvent.keyDown(getByLabelText('Exercise focus:'), { keyCode: 40 });

    fireEvent.click(getByText('Time'));

    expect(mockResetFocus).toBeCalledWith(
      expect.objectContaining({
        id: 'id1',
        focus: 'time',
      })
    );
  });

  test('adds set when button is clicked', () => {
    const { getByText } = customRender(<WorkoutListItem {...props} />);

    fireEvent.click(getByText('Add another set'));

    expect(mockAddSet).toBeCalledWith(expect.objectContaining({ id: 'id1' }));
  });
});
