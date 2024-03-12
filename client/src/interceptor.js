import axios from "axios";

export const API_URL = `http://localhost:8999/api`;

const $apirefresh = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

$apirefresh.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
})

$apirefresh.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status == 500 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try {
      const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
      localStorage.setItem('token', response.data.accessToken);
      console.log('refresh ok')
      return $apirefresh.request(originalRequest);
    } catch (e) {
      await axios.post(`${API_URL}/logout`, {withCredentials: true})
      localStorage.removeItem('token');
      console.log('logout post ok')
      window.location.replace('/')
    }
  }
  throw error;
})

export default $apirefresh;
