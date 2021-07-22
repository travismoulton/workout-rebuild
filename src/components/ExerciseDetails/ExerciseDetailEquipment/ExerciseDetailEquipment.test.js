import { customRender } from '../../../shared/testUtils';
import ExerciseDetailEquipment from './ExerciseDetailEquipment';

describe('<ExerciseDetailEquipment />', () => {
  test('renders if given equipment props', () => {
    const mockEquipment = ['mock1', 'mock2', 'mock3'];

    const { getByTestId } = customRender(
      <ExerciseDetailEquipment equipment={mockEquipment} />
    );

    expect(getByTestId('equipmentList').childNodes).toHaveLength(3);
  });

  test('renders an empty fragment if given no equipment', () => {
    const { container } = customRender(
      <ExerciseDetailEquipment equipment={[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
