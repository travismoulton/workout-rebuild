import * as reactRedux from 'react-redux';

import * as mockActions from '../../store/workoutSlice';
import { customRender, fireEvent, waitFor } from '../../shared/testUtils';
import SetDetails from './SetDetails';

const propsWithReps = {
  weight: 5,
  reps: 3,
  id: 'id',
  setNumber: 1,
  focus: 'reps',
  numberOfSets: 2,
};

const propsWithMinutes = {
  minutes: 6,
  seconds: 5,
  id: 'id',
  setNumber: 3,
  focus: 'time',
  numberOfSets: 6,
};

describe('<SetDetails />', () => {
  let dummyDispatch, mockUseDispatch, mockRemoveSet, mockUpdateExercise;

  beforeEach(() => {
    dummyDispatch = jest.fn();
    mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
    mockUseDispatch.mockReturnValue(dummyDispatch);

    mockUpdateExercise = jest
      .spyOn(mockActions, 'updateExerciseData')
      .mockImplementation(jest.fn(() => {}));

    mockRemoveSet = jest
      .spyOn(mockActions, 'removeSetFromExercise')
      .mockImplementation(jest.fn(() => {}));
  });

  afterEach(() => {
    jest.clearAllMocks();
    dummyDispatch = null;
    mockUseDispatch = null;
    mockUpdateExercise = null;
    mockRemoveSet = null;
  });

  test('renders', () => {
    const { getByText } = customRender(<SetDetails {...propsWithReps} />);
    expect(getByText('Set # 1')).toBeInTheDocument();
  });

  test('calls updateExerciseData with click of incrementBtn and decrementBtn', async () => {
    const { getAllByText } = customRender(<SetDetails {...propsWithReps} />);
    const incrementBtns = getAllByText('+');
    const decrementBtns = getAllByText('-');

    fireEvent.click(incrementBtns[0]);

    await waitFor(() =>
      expect(mockUpdateExercise).toBeCalledWith(
        expect.objectContaining({
          id: 'id',
          setIndex: 0,
          setData: { weight: 10, reps: 3 },
        })
      )
    );

    fireEvent.click(decrementBtns[1]);

    await waitFor(() =>
      expect(mockUpdateExercise).toBeCalledWith(
        expect.objectContaining({
          id: 'id',
          setIndex: 0,
          setData: { weight: 5, reps: 2 },
        })
      )
    );
  });

  test('calls updateExerciseData with update from select menu', async () => {
    const { getByLabelText, getByText } = customRender(
      <SetDetails {...propsWithMinutes} />
    );

    const select = getByLabelText('minutes');

    fireEvent.focus(select);
    fireEvent.keyDown(select, { keyCode: 40 });

    fireEvent.click(getByText('1'));

    await waitFor(() =>
      expect(mockUpdateExercise).toBeCalledWith(
        expect.objectContaining({
          id: 'id',
          setIndex: 2,
          setData: { minutes: 1, seconds: 5 },
        })
      )
    );
  });

  test('removes set when the button is clicked', async () => {
    const { getByText } = customRender(<SetDetails {...propsWithMinutes} />);
    fireEvent.click(getByText('Remove set'));

    await waitFor(() =>
      expect(mockRemoveSet).toBeCalledWith(
        expect.objectContaining({
          id: 'id',
          setIndex: 2,
        })
      )
    );
  });
});
