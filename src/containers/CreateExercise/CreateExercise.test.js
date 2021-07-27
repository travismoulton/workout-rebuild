import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { customRender, fireEvent } from '../../shared/testUtils';
import CreateExercise from './CreateExercise';
import { createExerciseUtils as createUtils } from './createExerciseUtils';
import { submitExerciseBtnUtils as submitUtils } from './SubmitExerciseBtn/submitExerciseBtnUtils';

//1: Test that the checkboxes update the state
//2: Test form is valid?
//5: Test that if there are no errors there is a call to submit exercise
//6: Test that it renders

describe('<CreateExercise />', () => {
  let mockSubmitExercise, mockNameTaken, mockRandom;

  beforeEach(() => {
    mockSubmitExercise = jest
      .spyOn(submitUtils, 'submitExercise')
      .mockImplementation(jest.fn(() => Promise.resolve(123)));

    mockNameTaken = jest
      .spyOn(submitUtils, 'checkForPreviousNameUse')
      .mockImplementation(jest.fn(() => Promise.resolve(false)));

    mockRandom = jest
      .spyOn(submitUtils, 'randomFunc')
      .mockImplementation(jest.fn(() => Promise.resolve('randomFunc')));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockSubmitExercise = null;
    mockNameTaken = null;
    mockRandom = null;
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

  test('calls submit exercise with the appropriate data when the form is filled out', async () => {
    const history = createMemoryHistory();
    const { getByTestId, getByLabelText, findByText, getByText } = customRender(
      <Router history={history}>
        <CreateExercise />
      </Router>
    );
    const select = getByLabelText('Exercise Category');
    const nameInput = getByTestId('exerciseName');

    userEvent.type(nameInput, 'mock exercise');

    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });

    fireEvent.click(await findByText('Arms'));

    fireEvent.click(getByText('Submit Exercise'));

    expect(mockNameTaken).toBeCalled();

    expect(mockRandom).toBeCalled();
    // expect(mockSubmitExercise).toBeCalled();
  });
});
