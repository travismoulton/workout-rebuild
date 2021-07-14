import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import authReducer from '../store/authSlice';

function customRender(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(ui, { wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { customRender };

// export const store = (preLoadedState) =>
//   configureStore({ reducer: reducer, preLoadedState });
