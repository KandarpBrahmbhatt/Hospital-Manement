import api from "./axios";

export const createEmergencyApi = (data: {
  patientId: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status?: "WAITING" | "IN_TREATMENT" | "STABILIZED" | "ADMITTED";
  assignedDoctor?: string;
  reason: string;
}) => {
  return api.post("/emargancy/create", data);
};

export const getEmergencyListApi = () => {
  return api.get("/emargancy/list");
};

export const getEmergencyStatsApi = () => {
  return api.get("/emargancy/stats");
};

export const getSingleEmergencyApi = (id: string) => {
  return api.get(`/emargancy/${id}`);
};

export const updateEmergencyApi = (id: string, data: any) => {
  return api.put(`/emargancy/${id}`, data);
};

export const deleteEmergencyApi = (id: string) => {
  return api.delete(`/emargancy/${id}`);
};
