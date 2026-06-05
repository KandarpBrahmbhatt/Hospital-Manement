import api from "./axios";

export const getAppointmentsApi = () => {
  return api.get("/appoiment");
};

export const createAppointmentApi = (data: { doctorId: string; patientId: string; appointmentDate: string; status?: string }) => {
  return api.post("/appoiment/create", data);
};

export const cancelAppointmentApi = (id: string) => {
  return api.put(`/appoiment/cancel/${id}`);
};

export const rescheduleAppointmentApi = (id: string, appointmentDate: string) => {
  return api.put(`/appoiment/reschedule/${id}`, { appointmentDate });
};

export const getAppointmentHistoryApi = (patientId: string) => {
  return api.get(`/appoiment/history/${patientId}`);
};

export const getDailyAppointmentStatsApi = () => {
  return api.get("/appointmentListing");
};
