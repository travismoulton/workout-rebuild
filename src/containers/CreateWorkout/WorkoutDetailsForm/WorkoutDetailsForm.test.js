import userEvent from '@testing-library/user-event';

import { customRender } from '../../../shared/testUtils';
import WorkoutDetailsForm from './WorkoutDetailsForm';

//1: Test that if there is existing workout data, the form populates correctly
//2 Test that filling out form fields calls the dispatch function

describe('<WorkoutDetailsForm />', () => {
  test('properly dispatches setFormData', async () => {
    const mockState = {
      workout: {
        formData: {
          workoutName: 'workout',
          targetArea: 'Arms',
          secondaryTarget: 'Abs',
        },
      },
    };

    const { getByLabelText } = customRender(
      <WorkoutDetailsForm setFormIsValid={jest.fn()} />,
      {
        preloadedState: mockState,
      }
    );

    const nameInput = getByLabelText('Workout Name');

    expect(nameInput).toHaveValue('workout');

    userEvent.clear(nameInput);
    userEvent.type(nameInput, 'new workout');

    expect(nameInput).toHaveValue('new workout');
  });
});
