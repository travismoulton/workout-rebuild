import axios from '../../../shared/axiosInstances/firebase';

export const submitExerciseBtnUtils = {
  checkForPreviousNameUse: async function (uid, accessToken, title) {
    let nameTaken = false;
    await axios
      .get(`customExercises/${uid}.json?auth=${accessToken}`)
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].name === title) {
            nameTaken = true;
            break;
          }
        }
      })
      .catch((err) => {
        throw new Error('apiFail');
      });

    return nameTaken;
  },

  submitExercise: function (uid, accessToken, exerciseData) {
    axios
      .post(`customExercises/${uid}.json?auth=${accessToken}`, exerciseData)
      .catch((err) => {
        throw new Error('axiosError');
      });
  },
};
