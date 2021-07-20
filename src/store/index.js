import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import favoritesReducer from './favoritesSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
  },
});
