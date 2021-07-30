import { customRender, fireEvent } from '../../../shared/testUtils';
import SubmitExerciseBtn from './SubmitExerciseBtn';

describe('<SubmitExerciseBtn />', () => {
  test('renders', () => {
    const { getByText } = customRender(<SubmitExerciseBtn />);
    expect(getByText('Submit Exercise')).toBeInTheDocument();
  });

  test('tooltip renders as expected', async () => {
    const { getByText, queryByText } = customRender(<SubmitExerciseBtn />);
    const btn = getByText('Submit Exercise');
    expect(btn).toHaveAttribute('disabled');

    fireEvent.mouseOver(btn);

    const message = queryByText(
      'Name and category are required to create an exercise'
    );

    expect(message).toBeInTheDocument();

    fireEvent.mouseOut(btn);

    expect(message).not.toBeInTheDocument();
  });

  test('tooltip renders as expected when passed props', async () => {
    const { getByText, queryByText } = customRender(
      <SubmitExerciseBtn nameIsValid />
    );
    const btn = getByText('Submit Exercise');

    fireEvent.mouseOver(btn);

    const message = queryByText('Category is required to create an exercise');

    expect(message).toBeInTheDocument();
  });

  test('is not disabled if the form is valid', () => {
    const { getByText } = customRender(<SubmitExerciseBtn formIsValid />);
    const btn = getByText('Submit Exercise');

    expect(btn).not.toHaveAttribute('disabled');
  });
});
