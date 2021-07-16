import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';

import { mockUser } from '../../../shared/mockUser';
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

  test('dispatches register fn when button clicked and redirects to the homepage', () => {
    const mockRegister = jest.fn().mockReturnValue(Promise.resolve(mockUser));
    const mockUpdateProfile = jest
      .fn()
      .mockReturnValue(Promise.resolve(mockUser));

    const history = createMemoryHistory();

    const props = {
      firebase: {
        doCreateUserWithEmailAndPassword: mockRegister,
        updateUserProfile: mockUpdateProfile,
      },
      history,
    };

    const { getByRole } = customRender(
      <Router history={history}>
        <Register {...props} />
      </Router>
    );

    const btn = getByRole('button');

    fireEvent.click(btn);

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(history.location.pathname).toBe('/');
  });

  test("if the passwords don't match, set an error message", () => {
    const { getByTestId, getByRole, getByText } = customRender(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const passwordInput = getByTestId('Register__passwordInput');
    const confirmPWInput = getByTestId('Register__confirmPWInput');
    const btn = getByRole('button');

    userEvent.type(passwordInput, 'password1');
    userEvent.type(confirmPWInput, 'password2');

    fireEvent.click(btn);

    expect(getByText('Passwords do not match!')).toBeInTheDocument();
  });
});
