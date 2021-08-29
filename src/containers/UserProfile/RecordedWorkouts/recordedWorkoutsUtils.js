import axios from '../../../shared/axiosInstances/firebase';

export const recordedWorkoutsUtils = {
  deleteRecord: async function (uid, accessToken, firebaseId) {
    await axios
      .delete(`recordedWorkouts/${uid}/${firebaseId}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });
  },
};
