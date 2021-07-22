import { customRender } from '../../../shared/testUtils';
import ExerciseDetailCategory from './ExerciseDetailCategory';

describe('<ExerciseDetailCategory />', () => {
  test('renders with props', () => {
    const { getByText } = customRender(
      <ExerciseDetailCategory category="Mock Category" />
    );

    expect(getByText('Mock Category')).toBeInTheDocument();
  });
});
