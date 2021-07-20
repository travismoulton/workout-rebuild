import wgerInstance from '../../shared/axiosInstances/wger';

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
};
