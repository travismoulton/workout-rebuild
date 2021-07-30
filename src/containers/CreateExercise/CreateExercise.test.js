import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { customRender, fireEvent, waitFor } from '../../shared/testUtils';
import CreateExercise from './CreateExercise';
import { submitExerciseBtnUtils as submitUtils } from './SubmitExerciseBtn/submitExerciseBtnUtils';

describe('<CreateExercise />', () => {
  let mockSubmitExercise, mockNameTaken;

  beforeEach(() => {
    mockSubmitExercise = jest
      .spyOn(submitUtils, 'submitExercise')
      .mockImplementation(jest.fn(() => Promise.resolve(123)));

    mockNameTaken = jest.spyOn(submitUtils, 'checkForPreviousNameUse');
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

  test('calls submit exercise with the appropriate data when the form is filled out', async () => {
    const history = createMemoryHistory();
    const { getByTestId, getByLabelText, findByText, getByText } = customRender(
      <Router history={history}>
        <CreateExercise />
      </Router>
    );

    mockNameTaken.mockImplementation(jest.fn(() => Promise.resolve(false)));

    const select = getByLabelText('Exercise Category');
    const nameInput = getByTestId('exerciseName');
    const descriptionInput = getByTestId('description');

    userEvent.type(nameInput, 'mock exercise');
    userEvent.type(descriptionInput, 'mock description');
    fireEvent.click(getByLabelText('Barbell'));
    fireEvent.click(getByTestId('secondary-Soleus'));
    fireEvent.click(getByTestId('primary-Brachialis'));

    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });

    fireEvent.click(await findByText('Arms'));

    fireEvent.click(getByText('Submit Exercise'));

    expect(mockNameTaken).toBeCalled();

    await waitFor(() =>
      expect(mockSubmitExercise).toBeCalledWith(
        null,
        null,
        expect.objectContaining({
          category: 8,
          description: 'mock description',
          equipment: ['15'],
          id: expect.any(String),
          muscles: ['13'],
          muscles_secondary: ['1'],
          name: 'mock exercise',
        })
      )
    );
  });

  test('if the name is taken, it throws an error', async () => {
    const { getByTestId, getByLabelText, findByText, getByText } = customRender(
      <CreateExercise />
    );

    mockNameTaken.mockImplementation(jest.fn(() => Promise.resolve(true)));

    const select = getByLabelText('Exercise Category');
    const nameInput = getByTestId('exerciseName');

    userEvent.type(nameInput, 'mock exercise');

    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });
    fireEvent.click(await findByText('Arms'));

    fireEvent.click(getByText('Submit Exercise'));

    await waitFor(() => expect(mockNameTaken).toBeCalled());

    const nameTakenMsg = getByText(
      'That name is already taken, please try a different name'
    );

    expect(nameTakenMsg).toBeInTheDocument();
  });
});
