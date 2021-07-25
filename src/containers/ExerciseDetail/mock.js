export const mockState = {
  favorites: {
    ids: [1],
    entities: { 1: { id: 1, exerciseId: 'id1', firebaseId: 1 } },
  },
};

export const wgerExercise = {
  category: 10,
  description: 'mock description',
  name: 'mock Exercise',
  muscles: [7, 13],
  equipment: [3],
};

export const customExercise = {
  category: 10,
  description: 'mock description custom',
  name: 'mock Exercise custom',
};

export const customLocation = {
  state: {
    exerciseId: 'id1',
    firebaseSearchId: 'firebaseId1',
    isCustom: true,
  },
};

export const wgerLocation = {
  state: {
    exerciseId: 'id7',
    isCustom: false,
  },
};
