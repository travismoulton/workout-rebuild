import axios from '../../shared/axiosInstances/firebase';

export const submitWorkoutBtnUtils = {
  checkForPreviousNameUse: async function (uid, accessToken, name) {
    let nameTaken = false;

    await axios
      .get(`workouts/${uid}.json?auth=${accessToken}`)
      .then(({ data }) => {
        for (const key in data) {
          if (data[key].title === name) nameTaken = true;
        }
      })
      .catch((err) => {
        throw new Error();
      });

    return nameTaken;
  },

  createWorkout: async function (uid, accessToken, workoutData) {
    const res = await axios
      .post(`workouts/${uid}.json?auth=${accessToken}`, workoutData)
      .catch((err) => {
        throw new Error();
      });

    return res.data.name;
  },

  updateWorkout: async function (uid, accessToken, firebaseId, workoutData) {
    axios
      .put(
        `workouts/${uid}/${firebaseId}.json?auth=${accessToken}`,
        workoutData
      )
      .catch((err) => {
        throw new Error();
      });
  },
};
