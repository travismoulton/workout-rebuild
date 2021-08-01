import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import favoritesReducer from './favoritesSlice';
import workoutReducer from './workoutSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    workout: workoutReducer,
  },
});
