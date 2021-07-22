import { customRender } from '../../../shared/testUtils';
import ExerciseDetailDescription from './ExerciseDetailDescription';

describe('<ExerciseDetailDescription />', () => {
  test('renders', () => {
    const description = '<p data-testid="description">Mock Descprtion</p>';

    const { getByTestId } = customRender(
      <ExerciseDetailDescription description={description} />
    );

    expect(getByTestId('description')).toBeInTheDocument();
  });
});
