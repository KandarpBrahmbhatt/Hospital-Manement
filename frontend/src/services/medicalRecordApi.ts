import api from "./axios";

export const getMedicalRecordsApi = () => {
  return api.get("/medicalrecord");
};

export const getPatientHistoryApi = (patientId: string) => {
  return api.get(`/medicalrecord/patient/${patientId}`);
};

export const getMedicalRecordByIdApi = (id: string) => {
  return api.get(`/medicalrecord/${id}`);
};

export const createMedicalRecordApi = (data: {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  symptoms: string[];
  prescription: { medicine: string; dosage: string; duration: string }[];
  allergies?: string[];
  treatmentNotes?: string;
  doctorRemarks?: string;
}) => {
  return api.post("/medicalrecord/create", data);
};

export const updateMedicalRecordApi = (id: string, data: any) => {
  return api.put(`/medicalrecord/${id}`, data);
};

export const deleteMedicalRecordApi = (id: string) => {
  return api.delete(`/medicalrecord/${id}`);
};

export const getMedicalDashboardApi = () => {
  return api.get("/medicalrecord/dashboard/stats");
};

export const downloadAndEmailMedicalPdfApi = (id: string) => {
  // Return response type blob so axios downloads the binary PDF
  return api.get(`/medicalrecord/downloadAndEmailMedicalPdf/${id}`, {
    responseType: "blob",
  });
};
