import axios from 'axios';

export const resultsUtils = {
  fetchWgerExercises: async function (param) {
    let next = `https://wger.de/api/v2/exercise/?language=2&${param}`;
    const arr = [];

    while (next) {
      // eslint-disable-next-line no-loop-func
      await axios.get(next, { timeout: 10000 }).then((res) => {
        // console.log(res.data.next);
        res.data.results.forEach((result) => arr.push(result));
        next = res.data.next;
      });
    }

    return arr;
  },
};
