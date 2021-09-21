import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import {
  clearFavorites,
  setNoFavoritesFalse,
} from '../../store/favoritesSlice';
import { clearExercises, resetWorkoutStore } from '../../store/workoutSlice';
import { clearUserProfile } from '../../store/userProfileSlice';

export default function Logout({ firebase }) {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.doSignOut().then(() => {
      dispatch(clearExercises());
      dispatch(resetWorkoutStore());
      dispatch(clearUserProfile());
      dispatch(clearFavorites());
      dispatch(setNoFavoritesFalse());
    });
  });

  return <Redirect to="/" />;
}
