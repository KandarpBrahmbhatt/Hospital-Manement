import api from "./axios";

export const createTokenApi = (data: { patientId: string; doctorId: string; priority?: number }) => {
  return api.post("/token/create", data);
};

export const getQueueByDoctorApi = (doctorId: string) => {
  return api.get(`/token/queue/${doctorId}`);
};

export const callNextPatientApi = (doctorId: string) => {
  return api.put(`/token/next/${doctorId}`);
};

export const startConsultationApi = (tokenId: string) => {
  return api.put(`/token/start/${tokenId}`);
};

export const completeConsultationApi = (tokenId: string) => {
  return api.put(`/token/complete/${tokenId}`);
};

export const getTokenDashboardApi = () => {
  return api.get("/token/dashboard");
};
