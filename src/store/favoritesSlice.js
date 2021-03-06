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
  activeRoutine: null,
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

export const fetchActiveRoutine = createAsyncThunk(
  'favorites/fetchActiveRoutine',
  async ({ uid, accessToken }) => {
    const { data: routines } = await axios.get(
      `routines/${uid}.json?auth=${accessToken}`
    );

    if (!routines) return null;

    const keys = Object.keys(routines);

    const activeRoutineKey = keys.filter(
      (key) => routines[key].activeRoutine
    )[0];

    return routines[activeRoutineKey]
      ? { routine: routines[activeRoutineKey], firebaseId: activeRoutineKey }
      : null;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites(state, action) {
      favoritesAdapter.removeAll(state, action);
    },
    setNoFavoritesFalse(state, action) {
      state.noFavorites = false;
    },
    setActiveRoutine(state, action) {
      state.activeRoutine = action.payload;
    },
  },

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
    [fetchActiveRoutine.fulfilled]: (state, action) => {
      if (action.payload) {
        const { routine, firebaseId } = action.payload;
        state.activeRoutine = { ...routine, firebaseId };
      } else {
        state.activeRoutine = null;
      }
    },
  },
});

export const { clearFavorites, setNoFavoritesFalse, setActiveRoutine } =
  favoritesSlice.actions;

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
