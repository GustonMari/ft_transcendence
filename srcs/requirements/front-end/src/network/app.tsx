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
            const _ = await APP.get("/auth/refresh");
            if (_.status === 200) {
                console.log(originalConfig);
                return APP(originalConfig);
            } else {
                throw new Error("You are not authorized");
            }
        } catch (_error) {        
            throw new Error("You are not authorized");
        }
      }
    }

    throw new Error(err.response?.data?.message || "An error occured, please try again later.");
  }
);