import axios from '../../shared/axiosInstances/firebase';

export const recordADifferentWorkoutUtils = {
  fetchAllWorkouts: async function (uid, accessToken) {
    const res = await axios
      .get(`workouts/${uid}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });

    return res;
  },

  fetchWorkoutById: async function (uid, accessToken, workoutId) {
    const res = await axios
      .get(`workouts/${uid}/${workoutId}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });

    return res;
  },
};
