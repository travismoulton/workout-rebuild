import axios from '../../../shared/axiosInstances/firebase';

export const favoriteSelectMenuUtils = {
  fetchMasterExerciseList: async function () {
    const res = await axios.get('masterExerciseList.json').catch((err) => {
      throw new Error();
    });

    return res.data;
  },

  fetchCustomExercises: async function (uid, accessToken) {
    const res = await axios
      .get(`customExercises/${uid}.json?auth=${accessToken}`)
      .catch((err) => {
        throw new Error();
      });

    return res.data;
  },
};
