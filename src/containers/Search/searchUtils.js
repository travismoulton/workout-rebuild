import axios from "axios";

const reqTimout = 20000;

export const searchUtils = {
  fetchCategories: async function () {
    const res = await axios.get(`https://wger.de/api/v2/exercisecategory`, {
      timeout: reqTimout,
    });
    return res.data.results;
  },

  fetchMuscles: async function () {
    const res = await axios.get(`https://wger.de/api/v2/muscle`, {
      timeout: reqTimout,
    });
    return res.data.results;
  },

  fetchEquipment: async function () {
    const res = await axios.get(`https://wger.de/api/v2/equipment`, {
      timeout: reqTimout,
    });
    return res.data.results;
  },
};
