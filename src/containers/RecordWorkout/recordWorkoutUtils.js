import axios from '../../shared/axiosInstances/firebase';

export const recordWorkoutUtils = {
  fetchWorkoutById: async function (uid, accessToken, workoutId) {
    const res = await axios
      .get(`workouts/${uid}/${workoutId}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });

    return res;
  },

  pushUpdateToFirebase: async function (
    uid,
    accessToken,
    workoutId,
    workoutData
  ) {
    await axios.put(
      `workouts/${uid}/${workoutId}.json?auth=${accessToken}`,
      workoutData
    );
  },
};
