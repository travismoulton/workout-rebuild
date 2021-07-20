import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  nanoid,
} from '@reduxjs/toolkit';

import axios from '../shared/axiosInstances/firebase';

const favoritesAdapter = createEntityAdapter();

export const fetchFavorites = createAsyncThunk(
  'favorites/setFavorites',
  async (userId) => {
    const res = await axios.get(`favorites/${userId}.json`);
    return res;
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorites',
  async ({ uid, exerciseId }) => {
    const res = await axios.post(`favorites/${uid}.json`, { exerciseId });

    const favorite = {
      exerciseId,
      id: nanoid(),
      firebaseId: res.data.name,
    };

    return favorite;
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
  },
});

export default favoritesSlice.reducer;
