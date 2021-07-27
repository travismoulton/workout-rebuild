import userEvent from '@testing-library/user-event';

import { customRender, fireEvent } from '../../shared/testUtils';
import CreateExercise from './CreateExercise';
import { createExerciseUtils as createUtils } from './createExerciseUtils';
import { submitExerciseBtnUtils as submitUtils } from './SubmitExerciseBtn/submitExerciseBtnUtils';

//1: Test that the checkboxes update the state
//2: Test form is valid?
//5: Test that if there are no errors there is a call to submit exercise
//6: Test that it renders

describe('<CreateExercise />', () => {
  let mockSubmitExercise, mockNameTaken;

  beforeEach(() => {
    mockSubmitExercise = jest
      .spyOn(submitUtils, 'submitExercise')
      .mockImplementation(jest.fn(() => {}));

    mockNameTaken = jest
      .spyOn(submitUtils, 'checkForPreviousNameUse')
      .mockImplementation(jest.fn(() => {}));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockSubmitExercise = null;
    mockNameTaken = null;
  });

  test('renders', () => {
    const { getByText } = customRender(<CreateExercise />);

    expect(getByText('Select all needed equipment')).toBeInTheDocument();
  });

  test('if the form is not filled out, clicking submit exercise should do nothing', () => {
    const { getByText } = customRender(<CreateExercise />);
    fireEvent.click(getByText('Submit Exercise'));
    expect(mockSubmitExercise).not.toHaveBeenCalled();
  });

  test('renders the correct amount of muscle and equipment checkboxes', () => {
    const { getByTestId } = customRender(<CreateExercise />);
    expect(getByTestId('equipmentCheckBoxes').childNodes).toHaveLength(10);
    expect(getByTestId('primaryMuscleCheckBoxes').childNodes).toHaveLength(15);
    expect(getByTestId('secondaryMuscleCheckBoxes').childNodes).toHaveLength(
      15
    );
  });

  test();
});
