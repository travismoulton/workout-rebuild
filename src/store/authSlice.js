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
    authSuccess: {
      reducer(state, action) {
        const { user, uid, accessToken } = action.payload;

        state.user = user;
        state.uid = uid;
        state.accessToken = accessToken;
        state.error = null;
        state.loading = false;
        state.inAuth = false;
      },
      prepare(action) {
        const user = action;
        const { providerData } = user;

        return {
          payload: {
            user: {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              phoneNumber: user.phoneNumber,
              metaData: {
                lastLoginAt: user.metadata.b,
                createdAt: user.metadata.a,
              },
              providerData: {
                displayName: providerData.displayName,
                email: providerData.email,
                phoneNumber: providerData.phoneNumber,
                photoURL: providerData.photoURL,
                providerId: providerData.providerId,
                uid: providerData.uid,
              },
              tenantId: user.tenantId,
              apiKey: user.l,
              authDomain: user.s,
              stsTokenManager: {
                apiKey: user.l,
                refreshToken: user.S.a.h.a,
                accessToken: user.S.a.h.b.h,
                expirationTime: user.S.a.h.c,
              },
            },
            uid: user.uid,
            accessToken: user.S.a.h.b.h,
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
