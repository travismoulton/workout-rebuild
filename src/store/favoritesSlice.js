import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import axios from '../shared/axiosInstances/firebase';

const favoritesAdapter = createEntityAdapter();

export const fetchFavorites = createAsyncThunk(
  'favorites/setFavorites',
  async (userId) => {
    const res = await axios.get(`favorites/${userId}.json`);

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
  async ({ uid, exerciseId }) => {
    const res = await axios.post(`favorites/${uid}.json`, { exerciseId });

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
  async ({ uid, firebaseId }) => {
    await axios.delete(`favorites/${uid}/${firebaseId}.json`);

    return firebaseId;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: favoritesAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchFavorites.fulfilled]: (state, action) => {
      favoritesAdapter.upsertMany(state, action.payload);
    },
    [addFavorite.fulfilled]: favoritesAdapter.addOne,
    [removeFavorite.fulfilled]: favoritesAdapter.removeOne,
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
