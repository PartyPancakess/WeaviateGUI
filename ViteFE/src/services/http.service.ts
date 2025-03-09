import axios from 'axios';

export function useHTTPService() {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_BASEURL,
    withCredentials: false,
  });
  return axiosInstance;
}
