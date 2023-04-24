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

// APP.interceptors.response.use(
//   (res) => {
//     if (res.status < 200 || res.status >= 300) {
//         throw res;
//     } else {
//         return res;
//     }
//   },
//   async (err) => {
//     const originalConfig = err.config;

//     if (
//       !unrefreshable.includes(originalConfig.url) &&
//       err.response
//     ) {
//       if (err.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true;

//         try {
//           const rs = await APP.get("/auth/refresh");
//           if (rs.status < 200 || rs.status >= 300) {
//             throw rs;
//             } else {
//                 return rs;
//             }
//           return APP(originalConfig);
//         } catch (_error) {
//             if (axios.isAxiosError(_error)) {
//                 const error = _error as any;
//                 return error;
//             }
//         }
//       }
//     }

//     if (axios.isAxiosError(err)) {
//         const error = err as any;
//         return error;
//     }
//   }
// );
