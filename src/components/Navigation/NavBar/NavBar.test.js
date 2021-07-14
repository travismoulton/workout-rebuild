import { customRender } from '../../../shared/testUtils';
import { MemoryRouter } from 'react-router-dom';

import NavBar from './NavBar';

describe('<NavBar>', () => {
  test('renders', () => {
    const { getByTestId } = customRender(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(getByTestId('NavBar')).toBeInTheDocument();
  });
});
