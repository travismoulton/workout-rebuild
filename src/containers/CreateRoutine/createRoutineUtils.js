import axios from '../../shared/axiosInstances/firebase';

export const createRoutineUtils = {
  fetchWorkouts: async function (uid, accessToken) {
    return await axios
      .get(`workouts/${uid}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });
  },
};
