import * as reactRedux from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import {
  customRender,
  fireEvent,
  waitFor,
  createSpy,
} from '../../../shared/testUtils';
import { generateMockState } from '../testUtils';
import Workouts from './Workouts';

// Test that when clicking Workouts, the proper number of workouts are rendered
// Test that if there are no workuts, the no workout link is displayed
// Test that clicking edit workout pushes the path and proper state

function setup(mockState) {
  const history = createMemoryHistory();

  const { getByText, getAllByText } = customRender(
    <Router history={history}>
      <Workouts history={history} />
    </Router>,
    { preloadedState: mockState }
  );

  return { history, getByText, getAllByText };
}

describe('<Workouts />', () => {
  test('When clicking on the workouts card, the appropriate amount of workouts are displayed', () => {
    const mockState = generateMockState(null, false);

    const { getByText, getAllByText } = setup(mockState);

    fireEvent.click(getByText('My Workouts'));
  });
});
