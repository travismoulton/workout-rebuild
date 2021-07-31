import axios from '../../shared/axiosInstances/firebase';

export const submitWorkoutBtnUtils = {
  checkForPreviousNameUse: async function (uid, accessToken, name) {
    let nameTaken = false;

    await axios.get(`workouts/${uid}.json?auth=${accessToken}`).then((res) => {
      for (const key in res.data) {
        if (res.data[key].title === name) {
          nameTaken = true;
        }
      }
    });

    return nameTaken;
  },
};
