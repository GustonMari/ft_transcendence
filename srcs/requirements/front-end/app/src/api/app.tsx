import axios from "axios";

export const APP = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000/api/",
    "Access-Control-Allow-Credentials": "true",
  },
});

APP.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
  
      if ((originalConfig.url !== "/auth/signin" && originalConfig.url !== "/auth/register") && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
  
          try {
            const rs = await APP.get("/auth/refresh");  
            return APP(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
  
      return Promise.reject(err);
    }
  );