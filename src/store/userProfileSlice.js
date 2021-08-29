import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import axios from '../shared/axiosInstances/firebase';

const profileAdapter = createEntityAdapter();

export const fetchWorkouts = createAsyncThunk(
  'userProfile/fetchWorkouts',
  async ({ uid, accessToken }) => {
    const { data } = await axios.get(
      `workouts/${uid}.json?auth=${accessToken}`
    );

    const workouts = [];

    for (const key in data)
      workouts.push({ id: `workout-${key}`, workoutId: key });

    return workouts;
  }
);

export const fetchRoutines = createAsyncThunk(
  'userProfile/fetchRoutines',
  async ({ uid, accessToken }) => {
    const { data } = await axios.get(
      `routines/${uid}.json?auth=${accessToken}`
    );

    const routines = [];

    for (const key in data)
      routines.push({ id: `routine-${key}`, routineId: key });

    return routines;
  }
);

export const fetchRecords = createAsyncThunk(
  'userProfile/fetchRecords',
  async ({ uid, accessToken }) => {
    const { data } = await axios.get(
      `recordedWorkouts/${uid}.json?auth=${accessToken}`
    );

    const records = [];

    for (const key in data)
      records.push({ id: `record-${key}`, recordId: key });

    return records;
  }
);

const profileSlice = createSlice({
  name: 'userProfile',
  initialState: profileAdapter.getInitialState(),
  reducers: {
    addWorkout(state, action) {
      const id = action.payload;
      const workout = { id: `workout-${id}`, workoutId: id };
      profileAdapter.addOne(state, workout);
    },
    addRoutine(state, action) {
      const id = action.payload;
      const routine = { id: `routine-${id}`, routineId: id };
      profileAdapter.addOne(state, routine);
    },
    addRecord(state, action) {
      const id = action.payload;
      const record = { id: `record-${id}`, recordId: id };
      profileAdapter.addOne(state, record);
    },
  },
  extraReducers: {
    [fetchWorkouts.fulfilled]: (state, action) => {
      profileAdapter.upsertMany(state, action.payload);
    },
    [fetchRoutines.fulfilled]: (state, action) => {
      profileAdapter.upsertMany(state, action.payload);
    },
    [fetchRecords.fulfilled]: (state, action) => {
      profileAdapter.upsertMany(state, action.payload);
    },
  },
});

const { selectAll } = profileAdapter.getSelectors((state) => state.userProfile);

export const selectWorkouts = createSelector(
  [selectAll, (state) => state],
  (profile) => profile.filter((obj) => obj.id.startsWith('workout'))
);

export const selectRoutines = createSelector(
  [selectAll, (state) => state],
  (profile) => profile.filter((obj) => obj.id.startsWith('rotuine'))
);

export const selectRecords = createSelector(
  [selectAll, (state) => state],
  (profile) => profile.filter((obj) => obj.id.startsWith('record'))
);

export const { addWorkout, addRoutine, addRecord } = profileSlice.actions;

export default profileSlice.reducer;
