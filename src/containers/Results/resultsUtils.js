import wgerInstance from '../../shared/axiosInstances/wger';
import firebaseInstance from '../../shared/axiosInstances/firebase';

export const resultsUtils = {
  getParam: function (category, id) {
    return category === 'exercisecategory'
      ? `category=${id}`
      : category === 'muscle'
      ? `muscles=${id}`
      : `equipment=${id}`;
  },

  fetchWgerExercises: async function (param) {
    let next = `exercise/?language=2&${param}`;
    const arr = [];

    while (next) {
      await wgerInstance
        .get(next)
        // eslint-disable-next-line no-loop-func
        .then((res) => {
          res.data.results.forEach((result) => arr.push(result));
          next = res.data.next;
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    }

    return arr;
  },

  fetchCustomExercises: async function (uid, accessToken) {
    const res = await firebaseInstance
      .get(`customExercises/${uid}.json?auth=${accessToken}`)
      .catch(() => {
        throw new Error();
      });

    const exercises = [];

    if (res.data) {
      for (let key in res.data) {
        exercises.push({ ...res.data[key], firebaseId: key });
      }
    }

    return exercises.length ? exercises : null;
  },
};
