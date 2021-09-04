import { customRender } from '../../../../shared/testUtils';
import SetLeveDetail from './SetLevelDetail';

describe('<SetLevelDetail />', () => {
  test('properly dispays reps and weight if passed the props', () => {
    const props = {
      index: 3,
      reps: 2,
      weight: 20,
    };

    const { getByText } = customRender(<SetLeveDetail {...props} />);

    expect(getByText('Set #3')).toBeInTheDocument();
    expect(getByText('Reps: 2')).toBeInTheDocument();
    expect(getByText('Weight: 20')).toBeInTheDocument();
  });

  test('properly dispays minutes and seconds if passed the props', () => {
    const props = {
      index: 6,
      minutes: 40,
      seconds: 20,
    };

    const { getByText } = customRender(<SetLeveDetail {...props} />);

    expect(getByText('Set #6')).toBeInTheDocument();
    expect(getByText('Minutes: 40')).toBeInTheDocument();
    expect(getByText('Seconds: 20')).toBeInTheDocument();
  });
});
