export const workouts = {
  workout1: {
    exercises: [
      {
        focus: 'reps',
        id: 'exercise1',
        name: 'exercise1',
        sets: [
          {
            reps: 3,
            weight: 50,
          },
        ],
      },
    ],
    targetAreaCode: 1,
    targetArea: 'target1',
    secondaryTargetCode: 2,
    secondaryTargetArea: 'secondaryTarget1',
    title: 'workout1',
  },
  workout2: {
    exercises: [
      {
        focus: 'reps',
        id: 'exercise2',
        name: 'exercise2',
        sets: [
          {
            reps: 3,
            weight: 50,
          },
        ],
      },
      {
        focus: 'reps',
        id: 'exercise3',
        name: 'exercise3',
        sets: [
          {
            reps: 3,
            weight: 50,
          },
        ],
      },
    ],
    targetAreaCode: 1,
    targetArea: 'target2',
    secondaryTargetCode: 2,
    secondaryTargetArea: 'secondaryTarget2',
    title: 'workout2',
  },
};

export const mockHistory = {
  workouts: {
    workout1: {
      exercises: [
        {
          focus: 'reps',
          id: 'exercise1',
          name: 'exercise1',
          sets: [
            {
              reps: 3,
              weight: 50,
            },
          ],
        },
      ],
      targetAreaCode: 1,
      targetArea: 'target1',
      secondaryTargetCode: 2,
      secondaryTargetArea: 'secondaryTarget1',
      title: 'workout1',
    },
    title: 'historyWorkout',
    firebaseId: 'firebaseId',
    activeRoutine: true,
  },
};
