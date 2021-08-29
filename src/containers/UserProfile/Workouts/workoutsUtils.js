import axios from '../../../shared/axiosInstances/firebase';

export const workoutsUtils = {
  deleteWorkout: async function (uid, accessToken, firebaseId) {
    await axios
      .delete(`workouts/${uid}/${firebaseId}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });
  },

  removeWorkoutFromRoutine: async function (
    uid,
    accessToken,
    firebaseId,
    routineData
  ) {
    await axios
      .patch(
        `routines/${uid}/${firebaseId}.json?auth=${accessToken}`,
        routineData
      )
      .catch(() => {
        throw new Error();
      });
  },
};
