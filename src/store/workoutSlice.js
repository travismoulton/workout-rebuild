import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const workoutAdapter = createEntityAdapter();

const initialState = workoutAdapter.getInitialState({
  buildingWorkout: false,

  formData: {
    workoutName: '',
    targetArea: '',
    secondaryTarget: '',
  },
  firebaseId: null,
  updated: false,
});

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    enterSearchMode(state, action) {
      state.buildingWorkout = true;
    },
    addSetToExercise(state, action) {
      const { id } = action.payload;
      const exercise = state.entities[id];

      if (exercise) {
        exercise.focus === 'time'
          ? exercise.sets.push({ minutes: 0, seconds: 0 })
          : exercise.sets.push({ weight: 0, reps: 0 });

        state.updated = true;
      }
    },
    resetExerciseFocus(state, action) {
      const { id, focus } = action.payload;
      const exercise = state.entities[id];

      if (exercise) {
        if (focus === 'time') {
          exercise.sets = [{ minutes: 0, seconds: 0 }];
          exercise.focus = 'time';
        }

        if (focus === 'reps') {
          exercise.sets = [{ weight: 0, reps: 0 }];
          exercise.focus = 'reps';
        }

        state.updated = true;
      }
    },
    updateExerciseData(state, action) {
      const { id, setIndex, setData } = action.payload;
      const exercise = state.entities[id];

      if (exercise) exercise.sets[setIndex] = setData;
      state.updated = true;
    },
    removeSetFromExercise(state, action) {
      const { id, setIndex } = action.payload;
      const exercise = state.entities[id];

      if (exercise) exercise.sets.splice(setIndex, 1);
      state.updated = true;
    },
    changeExerciseOrder(state, action) {
      const { id, direction } = action.payload;

      const index = state.ids.indexOf(id);

      const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

      direction === 'up'
        ? swap(state.ids, index, index - 1)
        : swap(state.ids, index, index + 1);
    },
    addExercise(state, action) {
      workoutAdapter.addOne(state, action.payload);
    },
    removeExercise(state, action) {
      workoutAdapter.removeOne(state, action.payload);
      state.updated = true;
    },
    setExercises(state, action) {
      workoutAdapter.addMany(state, action.payload);
    },
    setFormData(state, action) {
      const { workoutName, targetArea, secondaryTarget } = action.payload;

      state.formData.workoutName = workoutName;
      state.formData.targetArea = targetArea;
      state.formData.secondaryTarget = secondaryTarget;
    },
    clearExercises(state, action) {
      workoutAdapter.removeAll(state, action);
    },
    resetWorkoutStore(state, action) {
      state.formData.workoutName = '';
      state.formData.targetArea = '';
      state.formData.secondaryTarget = '';
      state.buildingWorkout = false;
      state.firebaseId = null;
      state.updated = false;
    },
    setFirebaseId(state, action) {
      state.firebaseId = action.payload;
    },
  },
});

export const {
  enterSearchMode,
  addSetToExercise,
  resetExerciseFocus,
  updateExerciseData,
  removeSetFromExercise,
  changeExerciseOrder,
  addExercise,
  removeExercise,
  setExercises,
  setFormData,
  clearExercises,
  resetWorkoutStore,
  setFirebaseId,
} = workoutSlice.actions;

export const {
  selectById: selectExerciseById,
  selectIds: selectExerciseIds,
  selectAll: selectAllExercises,
} = workoutAdapter.getSelectors((state) => state.workout);

export default workoutSlice.reducer;
