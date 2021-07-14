import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { render, fireEvent, act } from '@testing-library/react';
import NavItem from './NavItem';

describe('<NavItem>', () => {
  const props = { link: '/test-link', children: 'Test Link' };

  test('renders', () => {
    const { getByText } = render(
      <MemoryRouter>
        <NavItem {...props} />
      </MemoryRouter>
    );

    expect(getByText('Test Link')).toBeInTheDocument();
  });

  test('sets the correct path', async () => {
    const history = createMemoryHistory();

    const { getByText } = render(
      <Router history={history}>
        <NavItem {...props} />
      </Router>
    );

    const testLink = getByText('Test Link');

    act(() => {
      fireEvent.click(testLink);
    });

    expect(history.location.pathname).toBe('/test-link');
  });
});
