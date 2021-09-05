import { customRender } from '../../../shared/testUtils';
import ExerciseListItem from './ExerciseListItem';

describe('<ExerciseListItem />', () => {
  test('renders with the proper title and the correct amount of sets', () => {
    const props = {
      sets: [
        { reps: 0, weight: 0, index: 1 },
        { reps: 0, weight: 0, index: 2 },
        { reps: 0, weight: 0, index: 3 },
        { reps: 0, weight: 0, index: 4 },
      ],
      title: 'exercise',
    };

    const { getByText, getByTestId } = customRender(
      <ExerciseListItem {...props} />
    );

    expect(getByText('exercise')).toBeInTheDocument();
    expect(getByTestId('SetDetails').childNodes).toHaveLength(4);
  });
});
