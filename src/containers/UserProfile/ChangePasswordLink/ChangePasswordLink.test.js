import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { customRender, fireEvent } from '../../../shared/testUtils';
import ChangePasswordLink from './ChangePasswordLink';

describe('<ChangePasswordLink />', () => {
  const history = createMemoryHistory();

  test('renders, and redirects when the link is clicked', () => {
    const { getByText } = customRender(
      <Router history={history}>
        <ChangePasswordLink />
      </Router>
    );

    const link = getByText('Update My Password');

    expect(link).toBeInTheDocument();

    fireEvent.click(link);

    expect(history.location.pathname).toBe('/update-password');
  });
});
