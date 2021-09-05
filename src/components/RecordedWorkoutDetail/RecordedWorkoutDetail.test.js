import { customRender } from '../../shared/testUtils';
import RecordedWorkoutDetail from './RecordedWorkoutDetail';

describe('<RecordedWorkoutDetail />', () => {
  const preloadedState = {
    userProfile: {
      ids: ['record-firebaseId'],
      entities: {
        'record-firebaseId': {
          id: 'record-firebaseId',
          firebaseId: 'firebaseId',
          date: { month: 8, day: 4, year: 2021 },
          exercises: [
            {
              name: 'exercise',
              sets: [{ reps: 1, weight: 1 }],
            },
            {
              name: 'exercise 2',
              sets: [{ reps: 1, weight: 1 }],
            },
          ],
          title: 'workout',
        },
      },
    },
  };

  test('selects the correct record from the store, and displays the workout title, date, and correct amount of exercises', () => {
    const props = {
      location: { state: { firebaseId: 'firebaseId' } },
    };

    const { getByText, getByTestId } = customRender(
      <RecordedWorkoutDetail {...props} />,
      { preloadedState }
    );

    expect(getByText('workout')).toBeInTheDocument();

    const dateStr = 'Sat Sep 04 2021';
    expect(getByText(dateStr)).toBeInTheDocument();

    expect(getByTestId('Exercises').childNodes).toHaveLength(2);
  });

  test('if there is no workout it displays the error message', () => {
    const props = { location: { state: { firebaseId: 'noId' } } };
    const { getByText } = customRender(<RecordedWorkoutDetail {...props} />, {
      preloadedState,
    });

    const errorMsg =
      "We're having trouble loading your workout. Please refresh the page or try again later";

    expect(getByText(errorMsg)).toBeInTheDocument();
  });
});
