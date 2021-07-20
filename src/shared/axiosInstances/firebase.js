import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://workout-rebuild-default-rtdb.firebaseio.com/',
  timeout: 5000,
});

export default instance;
