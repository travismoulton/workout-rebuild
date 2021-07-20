import { customRender, fireEvent } from '../../shared/testUtils';

import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import ExerciseResult from './ExerciseResult';

describe('<ExerciseResult />', () => {
  const props = {
    name: 'mock exercise',
  };

  test('renders', () => {
    const { getByTestId } = customRender(
      <MemoryRouter>
        <ExerciseResult {...props} />
      </MemoryRouter>
    );

    const element = getByTestId('ExerciseResult__mock exercise');

    expect(element).toBeInTheDocument();
  });

  test('properly redirects', () => {
    const history = createMemoryHistory();

    const { getByText } = customRender(
      <Router history={history}>
        <ExerciseResult {...props} />
      </Router>
    );

    const link = getByText('mock exercise');
    fireEvent.click(link);

    expect(history.location.pathname).toBe('/exercise/mock-exercise');
  });
});
