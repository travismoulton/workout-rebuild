import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import NavBar from './NavBar';

describe('<NavBar>', () => {
  test('renders', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(getByTestId('NavBar')).toBeInTheDocument();
  });
});
