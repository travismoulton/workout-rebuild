import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import axios from '../shared/axiosInstances/firebase';

const favoritesAdapter = createEntityAdapter();

const initialState = favoritesAdapter.getInitialState({
  noFavorites: false,
});

export const fetchFavorites = createAsyncThunk(
  'favorites/setFavorites',
  async ({ uid, accessToken }) => {
    const res = await axios.get(`favorites/${uid}.json?auth=${accessToken}`);

    const favorites = [];

    for (let key in res.data) {
      favorites.push({
        id: key,
        exerciseId: res.data[key].exerciseId,
        firebaseId: key,
      });
    }

    return favorites;
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorites',
  async ({ uid, accessToken, exerciseId }) => {
    const res = await axios.post(`favorites/${uid}.json/?auth=${accessToken}`, {
      exerciseId,
    });

    const firebaseId = res.data.name;

    const favorite = {
      exerciseId,
      id: firebaseId,
      firebaseId,
    };

    return favorite;
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ uid, accessToken, firebaseId }) => {
    await axios.delete(
      `favorites/${uid}/${firebaseId}.json?auth=${accessToken}`
    );

    return firebaseId;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchFavorites.fulfilled]: (state, action) => {
      action.payload.length
        ? favoritesAdapter.upsertMany(state, action.payload)
        : (state.noFavorites = true);
    },
    [addFavorite.fulfilled]: (state, action) => {
      favoritesAdapter.addOne(state, action);
      if (state.noFavorites) state.noFavorites = false;
    },
    [removeFavorite.fulfilled]: (state, action) => {
      if (state.entities.length === 1) state.noFavorites = true;
      favoritesAdapter.removeOne(state, action);
    },
  },
});

export const {
  selectAll: selectAllFavorites,
  selectById: selectFavoriteById,
  selectIds: selectFavoritesIds,
} = favoritesAdapter.getSelectors((state) => state.favorites);

export const selectFavoriteExerciseIds = createSelector(
  [selectAllFavorites],
  (favorites) => favorites.map((favorite) => favorite.exerciseId)
);

export const selectFavoriteFirebaseId = createSelector(
  [selectAllFavorites, (state, exerciseId) => exerciseId],
  (favorites, exerciseId) =>
    favorites.filter((favorite) => favorite.exerciseId === exerciseId)[0] &&
    favorites.filter((favorite) => favorite.exerciseId === exerciseId)[0]
      .firebaseId
);

export default favoritesSlice.reducer;
