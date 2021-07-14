import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';

const preloadedState = {
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

export default configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});
