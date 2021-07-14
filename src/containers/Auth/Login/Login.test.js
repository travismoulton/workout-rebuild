import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  createEvent,
  customRender,
  fireEvent,
  waitFor,
} from '../../../shared/testUtils';
import Firebase from '../../../components/Firebase/firebase';
import { FirebaseContext } from '../../../components/Firebase';
import Login from './Login';

const mockLogin = jest.fn().mockReturnValue(Promise.resolve('user obj'));

jest.mock('../../../components/Firebase/firebase', () =>
  jest
    .fn()
    .mockImplementation(() => ({ doSignInWithEmailAndPassword: mockLogin }))
);

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
        user: {
          authUser: {},
        },
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
    const { getByTestId, getByRole } = customRender(
      // <MemoryRouter>
      //   <FirebaseContext.Provider value={new Firebase()}>
      //     <FirebaseContext.Consumer>
      //       {(firebase) => <Login firebase={firebase} />}
      //     </FirebaseContext.Consumer>
      //   </FirebaseContext.Provider>
      // </MemoryRouter>

      <MemoryRouter>
        <Login firebase={{ doSignInWithEmailAndPassword: mockLogin }} />
      </MemoryRouter>
    );

    const emailInput = getByTestId('Login__emailInput');
    const passwordInput = getByTestId('Login__passwordInput');
    const btn = getByRole('button');

    // fireEvent(emailInput, createEvent('input', 'test@test.com'));
    // fireEvent(passwordInput, createEvent('input', 'password'));

    await waitFor(() => fireEvent.click(btn));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledTimes(1));
  });
});
