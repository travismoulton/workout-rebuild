import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { customRender, fireEvent } from '../../../shared/testUtils';
import { mockUser } from '../../../shared/mockUser';
import Login from './Login';

describe('<Login />', () => {
  test('renders', () => {
    const { getByText } = customRender(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const element = getByText('Email address');

    expect(element).toBeInTheDocument();
  });

  test('redirects if a user is already logged in', async () => {
    const history = createMemoryHistory();

    const mockState = {
      auth: {
        error: null,
        loading: false,
        user: {},
        inAuth: false,
        uid: null,
        accessToken: null,
      },
    };

    customRender(
      <Router history={history}>
        <Login />
      </Router>,
      { preloadedState: mockState }
    );

    expect(history.location.pathname).toBe('/my-profile');
  });

  test('calls doSignInWithEmailAndPassword', async () => {
    const mockLogin = jest.fn().mockReturnValue(Promise.resolve(mockUser));

    const { getByRole } = customRender(
      <MemoryRouter>
        <Login firebase={{ doSignInWithEmailAndPassword: mockLogin }} />
      </MemoryRouter>
    );

    const btn = getByRole('button');
    fireEvent.click(btn);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
