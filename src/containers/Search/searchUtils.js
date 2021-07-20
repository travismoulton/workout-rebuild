import wgerInstance from '../../shared/axiosInstances/wger';

export const searchUtils = {
  fetchCategories: async function () {
    const res = await wgerInstance.get(`exercisecategory`);
    return res.data.results;
  },

  fetchMuscles: async function () {
    const res = await wgerInstance.get(`muscle`);
    return res.data.results;
  },

  fetchEquipment: async function () {
    const res = await wgerInstance.get(`equipment`);
    return res.data.results;
  },
};
