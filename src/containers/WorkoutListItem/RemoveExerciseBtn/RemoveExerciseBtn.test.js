import * as reactRedux from 'react-redux';

import * as mockActions from '../../../store/workoutSlice';
import { customRender, fireEvent } from '../.././../shared/testUtils';
import RemoveExerciseBtn from './RemoveExerciseBtn';

const props = { id: 'id1', exerciseName: 'exercise' };

describe('<RemoveExerciseBtn />', () => {
  let dummyDispatch, mockUseDispatch, mockRemoveExercise;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockRemoveExercise = jest
      .spyOn(mockActions, 'removeExercise')
      .mockImplementation(jest.fn(() => {}));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockUseDispatch = null;
    dummyDispatch = null;
    mockRemoveExercise = null;
  });

  test('renders and shows tooltip when hovered on', () => {
    const { getByTestId, getByText } = customRender(
      <RemoveExerciseBtn {...props} />
    );
    expect(getByTestId('removeExerciseBtn')).toBeInTheDocument();

    fireEvent.mouseOver(getByTestId('removeExerciseBtn'));
    expect(getByText('Remove exercise from workout')).toBeInTheDocument();
  });

  test('calls removeExercise when clicked', () => {
    const { getByTestId } = customRender(<RemoveExerciseBtn {...props} />);

    fireEvent.click(getByTestId('removeExerciseBtn'));
    expect(mockRemoveExercise).toBeCalledWith('id1');
  });
});
