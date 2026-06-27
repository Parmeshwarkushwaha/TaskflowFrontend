import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const client = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const setToken = (token) => {
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearToken = () => {
  delete client.defaults.headers.common.Authorization;
};

const get = (url, config) => client.get(url, config);
const post = (url, data, config) => client.post(url, data, config);
const put = (url, data, config) => client.put(url, data, config);
const del = (url, config) => client.delete(url, config);
const patch = (url, data, config) => client.patch(url, data, config);

export default {
  setToken,
  clearToken,
  get,
  post,
  put,
  delete: del,
  patch,
};
