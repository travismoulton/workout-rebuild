import firebaseIntance from '../../shared/axiosInstances/firebase';
import wgerInstance from '../../shared/axiosInstances/wger';

export const exerciseDetailUtils = {
  fetchWgerExercise: async function (id) {
    const exercise = await wgerInstance.get(`exercise/${id}`);
    return exercise.data;
  },
  fetchCustomExercise: async function (uid, accessToken, firebaseSearchId) {
    const exercise = await firebaseIntance.get(
      `customExercises/${uid}/${firebaseSearchId}.json?auth=${accessToken}`
    );
    return exercise.data;
  },
  deleteCustomExercise: async function (uid, accessToken, firebaseSearchId) {
    await firebaseIntance.delete(
      `customExercises/${uid}/${firebaseSearchId}.json?auth=${accessToken}`
    );
  },
};
