import axios from 'axios';

export const resultsUtils = {
  fetchWgerExercises: async function (param) {
    let next = `https://wger.de/api/v2/exercise/?language=2&${param}`;
    const arr = [];

    while (next) {
      await axios
        .get(next, { timeout: 10000 })
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
