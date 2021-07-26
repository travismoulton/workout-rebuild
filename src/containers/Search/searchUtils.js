import wgerInstance from '../../shared/axiosInstances/wger';
import firebaseInstance from '../../shared/axiosInstances/firebase';

export const searchUtils = {
  fetchCategories: async function () {
    const res = await wgerInstance.get(`exercisecategory`).catch(() => {
      throw new Error();
    });
    return res.data.results;
  },

  fetchMuscles: async function () {
    const res = await wgerInstance.get(`muscle`).catch(() => {
      throw new Error();
    });
    return res.data.results;
  },

  fetchEquipment: async function () {
    const res = await wgerInstance.get(`equipment`).catch(() => {
      throw new Error();
    });
    return res.data.results;
  },

  fetchCustomExercises: async function (uid, accessToken) {
    const res = await firebaseInstance
      .get(`customExercises/${uid}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });

    return res.data;
  },
};
