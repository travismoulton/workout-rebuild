import userEvent from '@testing-library/user-event';

import Input from './Input';
import { customRender, fireEvent } from '../../../shared/testUtils';

describe('<Input />', () => {
  const propsProto = {
    value: 'mockVal',
    label: 'mockLabel',
    testid: 'mockTest',
    changed: (val) => (this.value = val),
  };

  test('renders a text input and updates the value', () => {
    const props = {
      ...propsProto,
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'mock placeholder',
      },
    };

    const { getByTestId, getByText } = customRender(<Input {...props} />);

    expect(getByTestId('mockTest')).toBeInTheDocument();
    expect(getByText('mockVal')).toBeInTheDocument();
  });
});
