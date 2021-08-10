import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';

import * as workoutSlice from '../../../store/workoutSlice';
import { customRender, createSpy, fireEvent } from '../../../shared/testUtils';
import WorkoutDetailsForm from './WorkoutDetailsForm';

describe('<WorkoutDetailsForm />', () => {
  let mockUseDispatch, dummyDispatch, mockSetForm;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);
    mockSetForm = createSpy(workoutSlice, 'setFormData', null);
  });

  afterEach(() => {
    jest.clearAllMocks();
    dummyDispatch = null;
    mockUseDispatch = null;
    mockSetForm = null;
  });

  const mockState = {
    workout: {
      formData: {
        workoutName: 'workout',
        targetArea: { label: 'Arms', value: 10 },
        secondaryTarget: { label: 'Abs', value: 7 },
      },
    },
  };

  function setup() {
    const { getByLabelText, getByText } = customRender(
      <WorkoutDetailsForm setFormIsValid={jest.fn()} />,
      {
        preloadedState: mockState,
      }
    );

    return { getByLabelText, getByText };
  }

  test('properly dispatches setFormData on text input', async () => {
    const { getByLabelText } = setup();

    const nameInput = getByLabelText('Workout Name');

    expect(nameInput).toHaveValue('workout');

    userEvent.clear(nameInput);
    userEvent.type(nameInput, 'new workout');

    expect(nameInput).toHaveValue('new workout');

    expect(mockSetForm).toBeCalledWith(
      expect.objectContaining({
        workoutName: 'new workout',
        targetArea: { label: 'Arms', value: 10 },
        secondaryTarget: { label: 'Abs', value: 7 },
      })
    );
  });

  test('properly calls dispatch on using select menu', () => {
    const { getByLabelText, getByText } = setup();

    const select = getByLabelText('Target Muscle Area');

    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });
    fireEvent.click(getByText('Legs'));

    expect(mockSetForm).toBeCalledWith(
      expect.objectContaining({
        workoutName: 'workout',
        targetArea: { label: 'Legs', value: 9 },
        secondaryTarget: { label: 'Abs', value: 7 },
      })
    );
  });
});
