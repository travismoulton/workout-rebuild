import {  customRender } from '../../../shared/testUtils';
import { MemoryRouter } from 'react-router-dom';

import NavItems from './NavItems';

describe('<NavItems />', () => {
  test('renders', () => {
    const { getByTestId } = customRender(
      <MemoryRouter>
        <NavItems />
      </MemoryRouter>
    );

    expect(getByTestId('NavItems')).toBeInTheDocument();
  });

  test('renders 2 children if not authenticated', () => {
    const props = { isAuthenticated: false };
    const { getByTestId } = customRender(
      <MemoryRouter>
        <NavItems {...props} />
      </MemoryRouter>
    );

    const navItems = getByTestId('NavItems');

    expect(navItems.childNodes).toHaveLength(2);
  });

  test('renders 7 children if  authenticated', () => {
    const props = { isAuthenticated: true };
    const { getByTestId } = customRender(
      <MemoryRouter>
        <NavItems {...props} />
      </MemoryRouter>
    );

    const navItems = getByTestId('NavItems');

    expect(navItems.childNodes).toHaveLength(7);
  });
});
