import { customRender } from '../../../shared/testUtils';
import ExerciseDetailMuscles from './ExerciseDetailMuscles';

describe('<ExerciseDetailMuscles />', () => {
  const props = {
    muscles: [
      { name: 'mock primary 1' },
      { name: 'mock primary 2' },
      { name: 'mock primary 3' },
    ],
    secondary: [
      { name: 'mock secondary 1' },
      { name: 'mock secondary 2' },
      { name: 'mock secondary 3' },
      { name: 'mock secondary 4' },
    ],
  };

  test('returns an empty fragment if not passed any muscles', () => {
    const { container } = customRender(
      <ExerciseDetailMuscles muscles={[]} secondary={[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders a list of primary and seconday muscles if passed via props', () => {
    const { getByTestId } = customRender(<ExerciseDetailMuscles {...props} />);

    expect(getByTestId('primaryMuscleList').childNodes).toHaveLength(3);
    expect(getByTestId('secondaryMuscleList').childNodes).toHaveLength(4);
  });

  test('renders muscle list items', () => {
    const { getByText } = customRender(<ExerciseDetailMuscles {...props} />);

    expect(getByText('mock primary 1')).toBeInTheDocument();
  });
});
