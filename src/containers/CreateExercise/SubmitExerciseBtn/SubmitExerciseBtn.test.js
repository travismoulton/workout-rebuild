import { customRender } from '../../../shared/testUtils';
import SubmitExerciseBtn from './SubmitExerciseBtn';

//1: Test tooltip renders as expected
//2: Check nameTaken works as expected
//3: Test that if the name is taken there is no call to submit exercise
//4: Test that if there is an axios error there is no call to submit exercise

describe('<SubmitExerciseBtn />', () => {
  test('renders', () => {
    const { getByText } = customRender(<SubmitExerciseBtn />);
    expect(getByText('Submit Exercise')).toBeInTheDocument();
  });
});
