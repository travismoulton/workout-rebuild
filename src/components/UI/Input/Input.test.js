import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import Input from './Input';
import { customRender } from '../../../shared/testUtils';

function MockComponent() {
  const [mockInput, setMockInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'email',
      placeholder: 'mockPlaceholder',
    },
    value: '',
    testid: 'mockInput',
  });

  const changed = (e) => setMockInput({ ...mockInput, value: e.target.value });

  return (
    <Input
      elementType={mockInput.elementType}
      elementConfig={mockInput.elementConfig}
      changed={(e) => changed(e)}
      value={mockInput.value}
      testid={mockInput.testid}
    />
  );
}

describe('<Input />', () => {
  test('renders a text input and updates the value on user input', async () => {
    const { getByTestId } = customRender(<MockComponent />);

    const input = getByTestId('mockInput');

    expect(input).toBeInTheDocument();
    expect(input.value).not.toBe('someOtherVal');
    expect(input.value).toBe('');

    userEvent.type(input, 'someOtherMockVal');

    expect(input).toHaveValue('someOtherMockVal');

    expect(getByTestId('mockInput').value).toBe('someOtherMockVal');
  });
});
