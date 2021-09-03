import { recordedWorkoutsUtils as records } from './RecordedWorkouts/recordedWorkoutsUtils';
import { routinesUtils as routines } from './Routines/routinesUtils';
import { workoutsUtils as workouts } from './Workouts/workoutsUtils';

export const utils = { records, workouts, routines };

const exercise1 = {
  focus: 'reps',
  id: 'exercise1',
  name: 'mock exercise1',
  sets: [
    { reps: 1, weight: 1 },
    { reps: 1, weight: 1 },
  ],
};

const exercise2 = {
  focus: 'reps',
  id: 'exercise2',
  name: 'mock exercise2',
  sets: [
    { reps: 2, weight: 2 },
    { reps: 2, weight: 2 },
  ],
};

const exercise3 = {
  focus: 'reps',
  id: 'exercise3',
  name: 'mock exercise3',
  sets: [
    { reps: 3, weight: 3 },
    { reps: 3, weight: 3 },
  ],
};

export const generateMockState = (activeRoutine, isActiveRoutine) => ({
  userProfile: {
    ids: [
      'workout-w1',
      'workout-w2',
      'routine-r1',
      'routine-r2',
      'record-rec1',
      'record-rec2',
    ],
    entities: {
      'workout-w1': {
        id: 'workout-w1',
        firebaseId: 'w1',
        secondaryTargetArea: 'Calves',
        secondaryTargetCode: 14,
        targetArea: 'Back',
        targetAreaCode: 12,
        title: 'workout-1',
        exercises: [exercise1],
      },
      'workout-w2': {
        id: 'workout-w2',
        firebaseId: 'w2',
        title: 'workout-2',
        exercises: [exercise2, exercise3],
      },
      'routine-r1': {
        id: 'routine-r1',
        firebaseId: 'r1',
        activeRoutine: isActiveRoutine,
        title: 'routine-1',
        workouts: ['1', 'Rest', 'Rest', 'Rest', 'Rest', 'Rest', 'Rest'],
      },
      'routine-r2': {
        id: 'routine-r2',
        firebaseId: 'r2',
        activeRoutine: false,
        title: 'routine-2',
        workouts: ['2', '2', '2', '2', 'Rest', 'Rest', 'Rest'],
      },
      'record-rec1': {
        id: 'record-rec1',
        firebaseId: 'rec1',
        date: { day: 1, month: 1, year: 2021 },
        exercises: [exercise1, exercise2, exercise3],
      },
      'record-rec2': {
        id: 'record-rec1',
        firebaseId: 'rec2',
        date: { day: 2, month: 2, year: 2022 },
        exercises: [exercise1],
      },
    },
  },
  favorites: { activeRoutine },
});
