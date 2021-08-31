import { createMemoryHistory } from 'history';

import { Router } from 'react-router-dom';

import { customRender, fireEvent } from '../../../../shared/testUtils';
import RoutineLink from './RoutineLink';

function setup(isActiveRoutine) {
  const history = createMemoryHistory();

  const props = {
    title: 'title',
    setActiveRoutine: jest.fn(),
    numberOfWorkouts: 2,
    isActiveRoutine,
    deleteRoutine: jest.fn(),
    routine: 'routine',
    setModalContent: jest.fn(),
    toggleModal: jest.fn(),
  };

  const { getByText } = customRender(
    <Router history={history}>
      <RoutineLink {...props} />
    </Router>
  );

  return { props, getByText, history };
}

describe('<RoutineLink />', () => {
  test('renders with the correct title and proper number of workouts, and current routine message if current routine', () => {
    const { getByText } = setup(true);
    expect(getByText('title')).toBeInTheDocument();
    expect(getByText('Number of workouts: 2')).toBeInTheDocument();
    expect(getByText('This is your current routine')).toBeInTheDocument();
  });

  test('calls setActiveRoutine when the button is clicked', () => {
    const { getByText, props } = setup(false);

    const btn = getByText('Set as current routine');
    fireEvent.click(btn);

    expect(props.setActiveRoutine).toBeCalled();
  });

  test('calls set modal content and toggle modal when Delete routine button is clicked', () => {
    const { getByText, props } = setup(true);
    const btn = getByText('Delete routine');
    fireEvent.click(btn);

    expect(props.setModalContent).toBeCalled();
    expect(props.toggleModal).toBeCalled();
  });
});
