// axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://task-management-pwa-backend-production.up.railway.app", // Replace with your backend server URL
  timeout: 5000, // Adjust the timeout as needed
});

export const setAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

export default instance;
