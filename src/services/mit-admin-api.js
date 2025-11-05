import axios from "axios";
import { getBaseURL } from "../utils/environment";
import { getToken } from "../utils/auth";

let store;

export const injectStore = (_store) => {
  if (_store) {
    store = _store;
  }
};

//axios.defaults.withCredentials=true;
const mitInstance = axios.create({
  baseURL: getBaseURL(),
});

mitInstance.interceptors.request.use(
  async (config) => {
    // let accessToken = getToken();
    config.headers = {
      Accept: "application/json",
      Authorization: `Bearer ` /*${accessToken}*/,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
mitInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      delete axios.defaults.headers.common["Authorization"];
      return mitInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default mitInstance;
