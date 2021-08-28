import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import favoritesReducer from './favoritesSlice';
import workoutReducer from './workoutSlice';
import profileReducer from './userProfileSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    workout: workoutReducer,
    userProfile: profileReducer,
  },
});
