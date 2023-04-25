import axios from "axios";

export const APP = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000/api/",
    "Access-Control-Allow-Credentials": "true",
  },
});

const unrefreshable = [
    "/auth/signin",
    "/auth/register",
    "/auth/refresh"
];

APP.interceptors.response.use(
  (res) => {
        return res;
  },
  async (err) => {

    const originalConfig = err.config;

    if (
      !unrefreshable.includes(originalConfig.url) &&
      err.response
    ) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
            await APP.get("/auth/refresh");
            return APP(originalConfig);
        } catch (_error) {
            if (axios.isAxiosError(_error)) {
                return _error;
            }
        }
      }
    }

    if (axios.isAxiosError(err)) {
        return err;
    }
  }
);