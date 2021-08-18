import axios from '../../shared/axiosInstances/firebase';

export const submitRoutineBtnUtils = {
  checkForPreviousNameUse: async function (title, uid, accessToken) {
    let nameTaken = false;
    await axios
      .get(`routines/${uid}.json?auth=${accessToken}`)
      .then(({ data }) => {
        for (const key in data) {
          if (data[key].title === title) nameTaken = true;
        }
      });

    return nameTaken;
  },
  createRoutine: async function (routineData, uid, accessToken) {
    axios
      .post(`routines/${uid}.json?auth=${accessToken}`, routineData)
      .catch(() => {
        throw new Error();
      });
  },
  updateRoutine: async function (routineData, uid, accessToken, firebaseId) {
    axios
      .put(`routines/${uid}/${firebaseId}.json?auth=${accessToken}`, routineData)
      .catch(() => {
        throw new Error();
      });
  },
};
