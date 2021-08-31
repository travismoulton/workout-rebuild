import axios from '../../../shared/axiosInstances/firebase';

export const routinesUtils = {
  deleteRoutine: async function (uid, accessToken, firebaseId) {
    console.log(uid, accessToken, firebaseId);

    await axios
      .delete(`routines/${uid}/${firebaseId}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });
  },

  changeActiveRoutineStatus: async function (
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
