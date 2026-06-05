import api from "./axios";

export const getPatientsApi = (page = 1, limit = 10) => {
  return api.get(`/patient/getPatientList?page=${page}&limit=${limit}`);
};

export const createPatientApi = (data: any) => {
  return api.post("/patient/create", data);
};

export const getSinglePatientApi = (id: string) => {
  return api.get(`/patient/${id}`);
};

export const updatePatientApi = (id: string, data: any) => {
  return api.put(`/patient/${id}`, data);
};
