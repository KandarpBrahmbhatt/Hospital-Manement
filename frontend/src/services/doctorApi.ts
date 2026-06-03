import api from "./axios";

export const getDoctorsApi = () => {
  return api.get("/doctor");
};
