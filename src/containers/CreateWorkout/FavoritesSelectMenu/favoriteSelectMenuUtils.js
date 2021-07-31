import axios from '../../../shared/axiosInstances/firebase';

export const favoriteSelectMenuUtils = {
  fetchMasterExerciseList: async function () {
    const res = await axios.get('masterExerciseList.json');
    return res;
  },

  fetchCustomExercises: async function (uid, accessToken) {
    const res = await axios.get(
      `customExercises/${uid}.json?auth=${accessToken}`
    );

    return res;
  },
};
