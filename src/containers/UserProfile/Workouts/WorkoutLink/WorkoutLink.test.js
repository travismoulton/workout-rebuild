import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { customRender, fireEvent } from '../../../../shared/testUtils';
import WorkoutLink from './WorkoutLink';

function setup(belongsToRoutine) {
  const history = createMemoryHistory();

  const props = {
    title: 'title',
    targetArea: 'Arms',
    secondaryTarget: 'Legs',
    exerciseCount: 5,
    workout: 'workout',
    belongsToRoutine,
    deleteWorkoutAndRemove: jest.fn(),
    deleteWorkout: jest.fn(),
    setModalContent: jest.fn(),
    toggleModal: jest.fn(),
  };

  const { getByText } = customRender(
    <Router history={history}>
      <WorkoutLink {...props} />
    </Router>
  );

  return { history, props, getByText };
}

describe('<WorkoutLink />', () => {
  test('renders with the proper title, target areas, and exercise count', () => {
    const { getByText } = setup(true);

    expect(getByText('title')).toBeInTheDocument();
    expect(getByText('Target Area: Arms')).toBeInTheDocument();
    expect(getByText('Secondary Target: Legs')).toBeInTheDocument();
    expect(getByText('Exercise Count: 5')).toBeInTheDocument();
  });

  test('calls toggleModal and setModalContent when the delete workout btn is clicked', () => {
    const { getByText, props } = setup(true);

    const btn = getByText('Delete workout');
    fireEvent.click(btn);

    expect(props.setModalContent).toBeCalled();
    expect(props.toggleModal).toBeCalled();
  });
});
