import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://workout-rebuild2-default-rtdb.firebaseio.com/',
  timeout: 5000,
});

export default instance;
