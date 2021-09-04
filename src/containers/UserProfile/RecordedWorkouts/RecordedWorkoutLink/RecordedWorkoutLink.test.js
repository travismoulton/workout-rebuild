import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { customRender, fireEvent } from '../../../../shared/testUtils';
import RecordedWorkoutLink from './RecordedWorkoutLink';

describe('<RecordedWorkoutLink />', () => {
  function setup() {
    const history = createMemoryHistory();

    const props = {
      firebaseId: 'firebaseId',
      deleteRecordedWorkout: jest.fn(),
      title: 'mock title',
      recordDate: {
        year: 2021,
        month: 7,
        day: 31,
      },
    };

    const { getByText } = customRender(
      <Router history={history}>
        <RecordedWorkoutLink {...props} />
      </Router>
    );

    return { history, getByText, props };
  }

  test('redirects with state when the link is clicked', () => {
    const { getByText, history } = setup();

    const link = getByText('View details');
    fireEvent.click(link);

    expect(history.location.pathname).toBe(
      '/recorded-workout-detail/firebaseId'
    );

    expect(history.location.state).toStrictEqual(
      expect.objectContaining({ firebaseId: 'firebaseId' })
    );
  });

  test('renders with the proper title in the header, and correct date string', () => {
    const { getByText } = setup();

    expect(getByText('mock title')).toBeInTheDocument();
    expect(getByText('Tue Aug 31 2021')).toBeInTheDocument();
  });

  test('clicking the delete record btn calls deleteRecordedWorkout', () => {
    const { getByText, props } = setup();
    const btn = getByText('Delete this record');
    fireEvent.click(btn);
    expect(props.deleteRecordedWorkout).toBeCalled();
  });
});
