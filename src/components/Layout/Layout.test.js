import { customRender } from '../../shared/testUtils';
import { MemoryRouter } from 'react-router-dom';

import Layout from './Layout';

describe('<Layout>', () => {
  test('renders', () => {
    const { getByTestId } = customRender(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    const main = getByTestId('Main');

    expect(main).toBeInTheDocument();
  });

  test('Will render children', () => {
    const child = <h1 data-testid="Mock Child">Child</h1>;
    const props = { isAuthenticated: false, children: child };

    const { getByTestId } = customRender(
      <MemoryRouter>
        <Layout {...props} />
      </MemoryRouter>
    );

    const expectedChild = getByTestId('Mock Child');

    expect(expectedChild).toBeInTheDocument();
  });
});
