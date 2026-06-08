import axios from "axios";

const api = axios.create({
  // Change: Set port to 5000 to connect to the backend server
  baseURL: "http://localhost:5000/api",

  withCredentials: true,

  headers: {
    "Content-Type":
      "application/json",
  },
});

export default api;
