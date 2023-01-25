import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3000/api/",
    withCredentials: true,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000/api/",
      "Access-Control-Allow-Credentials": "true",
    },
  });