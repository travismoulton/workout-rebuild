import axios from '../../../shared/axiosInstances/firebase';

export const favoriteSelectMenuUtils = {
  fetchMasterExerciseList: async function () {
    const res = await axios.get('masterExerciseList.json');

    // console.log(res.data);
    return res.data;
  },

  fetchCustomExercises: async function (uid, accessToken) {
    const res = await axios.get(
      `customExercises/${uid}.json?auth=${accessToken}`
    );

    // console.log(res);

    return res.data;
  },
};
