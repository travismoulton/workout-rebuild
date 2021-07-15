import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: null,
  loading: false,
  user: null,
  userEmail: null,
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
    // authSuccess: (state, action) => {
    //   console.log(action.payload);
    //   const user = action.payload;

    //   state.user = user;
    //   state.uid = user.uid;
    //   state.accessToken = user.za;
    //   state.error = null;
    //   state.loading = false;
    //   state.inAuth = false;
    // },
    authSuccess: {
      reducer(state, action) {
        const { user, email, uid, accessToken } = action.payload;

        state.user = { authUser: user };
        state.userEmail = email;
        state.uid = uid;
        state.accessToken = accessToken;
        state.error = null;
        state.loading = false;
        state.inAuth = false;
      },
      prepare(action) {
        return {
          payload: {
            user: action.authUser.displayName,
            email: action.authUser.email,
            uid: action.authUser.uid,
            accessToken: action.authUser.za,
          },
        };
      },
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

export default authSlice.reducer;

export const { authStart, authSuccess, authFail, authLogout, authReset } =
  authSlice.actions;
