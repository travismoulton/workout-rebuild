import axios from "axios";

const reqTimout = 20000;
const wgerBaseUrl = "https://wger.de/api/v2/";

export const searchUtils = {
  fetchCategories: async function () {
    const res = await axios.get(`${wgerBaseUrl}exercisecategory`, {
      timeout: reqTimout,
    });
    return res.data.results;
  },

  fetchMuscles: async function () {
    const res = await axios.get(`${wgerBaseUrl}muscle`, {
      timeout: reqTimout,
    });
    return res.data.results;
  },

  fetchEquipment: async function () {
    const res = await axios.get(`${wgerBaseUrl}equipment`, {
      timeout: reqTimout,
    });
    return res.data.results;
  },
};
