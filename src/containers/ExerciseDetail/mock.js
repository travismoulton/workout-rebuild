export const mockState = {
  favorites: {
    ids: [1],
    entities: { 1: { id: 1, exerciseId: 'id1', firebaseId: 1 } },
  },
  auth: {
    error: null,
    loading: false,
    user: {},
    inAuth: false,
    uid: null,
    accessToken: null,
  },
};

export const wgerExercise = {
  category: 10,
  description: 'mock description',
  name: 'mock Exercise',
  muscles: [7, 13],
  muscles_secondary: [5, 9, 15],
  equipment: [3],
};

export const customExercise = {
  category: 10,
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
