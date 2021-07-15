import { MemoryRouter } from 'react-router-dom';

import { customRender, waitFor, fireEvent } from '../../../shared/testUtils';
import Register from './Register';

//3: Test that it submits the createAccount to firebase
//4: Test that if the passwords don't match, it will reject with an error message

describe('<Register />', () => {
  test('renders with document title Register', async () => {
    const { getByTestId } = customRender(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await waitFor(() => expect(document.title).toBe('Register'));
    expect(getByTestId('Register__passwordInput')).toBeInTheDocument();
  });
});
