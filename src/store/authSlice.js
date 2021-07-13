import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: null,
  loading: false,
  user: null,
  inAuth: false,
  uid: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state, action) => {
      state.error = false;
      state.loading = true;
      state.inAuth = true;
    },
    authSucess: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.uid = user.authUser.uid;
      state.accessToken = user.authUser.za;
      state.error = null;
      state.loading = false;
      state.inAuth = false;
    },
    authFail: (state, action) => {
      state.error = action.error;
      state.loading = false;
    },
    authLogout: (state, action) => {
      state.user = null;
      state.uid = null;
      state.accessToken = null;
    },
    authReset: (state, action) => {
      state.loading = false;
      state.user = null;
      state.uid = null;
      state.accessToken = null;
      state.inAuth = false;
    },
  },
});

export default authSlice;

export const { authStart, authSucess, authFail, authLogout, authReset } =
  authSlice.actions;
