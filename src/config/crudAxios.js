import axios from 'axios';
import { backendUrl } from './config';

const axiosCrud = axios.create({
  baseURL: backendUrl
});
axiosCrud.defaults.headers.common['Content-Type'] = 'application/json';
axiosCrud.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axiosCrud.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

axiosCrud.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'There is an error!'
    )
);

export default axiosCrud;