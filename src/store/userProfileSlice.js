import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

import axios from '../shared/axiosInstances/firebase';

const profileAdapter = createEntityAdapter();

const bubbleSortWorkoutDates = (unsortedDates) => {
  const dates = [...unsortedDates];
  const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

  for (let i = 0; i < dates.length; i++) {
    let isSwapped = false;
    for (let j = 0; j < dates.length - 1; j++) {
      if (
        new Date(
          dates[j + 1].date.year,
          dates[j + 1].date.month,
          dates[j + 1].date.day
        ) > new Date(dates[j].date.year, dates[j].date.month, dates[j].date.day)
      ) {
        swap(dates, j, j + 1);
        isSwapped = true;
      }
    }
    if (!isSwapped) break;
  }
  return dates;
};

export const fetchWorkouts = createAsyncThunk(
  'userProfile/fetchWorkouts',
  async ({ uid, accessToken }) => {
    const { data } = await axios.get(
      `workouts/${uid}.json?auth=${accessToken}`
    );

    const workouts = [];

    for (const key in data)
      workouts.push({ id: `workout-${key}`, firebaseId: key, ...data[key] });

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
      routines.push({ id: `routine-${key}`, firebaseId: key, ...data[key] });

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
      records.push({ id: `record-${key}`, firebaseId: key, ...data[key] });

    const sortedRecords = bubbleSortWorkoutDates(records);

    return sortedRecords;
  }
);

const profileSlice = createSlice({
  name: 'userProfile',
  initialState: profileAdapter.getInitialState(),
  reducers: {
    addWorkout(state, action) {
      const { id, data } = action.payload;
      const workout = { id: `workout-${id}`, firebaseId: id, ...data };
      profileAdapter.addOne(state, workout);
    },
    addRoutine(state, action) {
      const { id, data } = action.payload;
      const routine = { id: `routine-${id}`, firebaseId: id, ...data };
      profileAdapter.addOne(state, routine);
    },
    addRecord(state, action) {
      const { id, data } = action.payload;
      const record = { id: `record-${id}`, firebaseId: id, ...data };
      profileAdapter.addOne(state, record);
    },
    removeWorkout(state, action) {
      const id = action.payload;
      const entityId = `workout-${id}`;
      profileAdapter.removeOne(state, entityId);
    },
    removeRoutine(state, action) {
      const id = action.payload;
      const entityId = `routine-${id}`;
      profileAdapter.removeOne(state, entityId);
    },
    removeRecord(state, action) {
      const id = action.payload;
      const entityId = `record-${id}`;
      profileAdapter.removeOne(state, entityId);
    },
    updateWorkout(state, action) {
      const { id, data } = action.payload;
      const update = { id: `workout-${id}`, changes: { ...data } };
      profileAdapter.updateOne(state, update);
    },
    updateRoutine(state, action) {
      const { id, data } = action.payload;
      const update = { id: `routine-${id}`, changes: { ...data } };
      profileAdapter.updateOne(state, update);
    },
    clearRoutines(state, action) {
      const routines = state.ids.filter((id) => id.startsWith('routine'));
      profileAdapter.removeMany(state, routines);
    },
    clearUserProfile(state, action) {
      profileAdapter.removeAll(state);
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
  (profile) => profile.filter((obj) => obj.id.startsWith('routine'))
);

export const selectRecords = createSelector(
  [selectAll, (state) => state],
  (profile) => profile.filter((obj) => obj.id.startsWith('record'))
);

export const selectRecordById = createSelector(
  [selectAll, (state, recordId) => recordId],
  (profile, id) => profile.filter((record) => record.firebaseId === id)[0]
);

export const {
  addWorkout,
  addRoutine,
  addRecord,
  removeWorkout,
  removeRoutine,
  removeRecord,
  updateWorkout,
  updateRoutine,
  clearRoutines,
  clearUserProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
