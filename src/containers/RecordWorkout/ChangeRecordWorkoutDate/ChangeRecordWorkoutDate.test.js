import { customRender, fireEvent, getByText } from '../../../shared/testUtils';
import ChangeWorkoutRecordDate from './ChangeWorkoutRecordDate';

describe('<ChangeWorkoutRecordDate />', () => {
  test('changes the date', () => {
    const { getByTestId, getByText } = customRender(
      <ChangeWorkoutRecordDate show={true} />
    );

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const monthString = month < 10 ? `0${month + 1}` : `${month + 1}`;

    fireEvent.click(getByTestId('datePicker'));

    expect(getByTestId('datePickerContainer')).toBeInTheDocument();

    fireEvent.click(getByText(25));

    const dateStr = `${year}-${monthString}-25`;

    expect(getByTestId('datePickerInput')).toHaveValue(dateStr);
  });
});
