import axios from 'axios';

const API_URL = "http://127.0.0.1:5000";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
// });
