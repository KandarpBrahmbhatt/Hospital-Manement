import api from "./axios";

export const getBillsApi = () => {
  return api.get("/bill");
};

export const getBillingDashboardApi = () => {
  return api.get("/dashboard");
};

export const createBillApi = (data: { patientId: string; doctorId: string; amount: number }) => {
  return api.post("/create", data);
};

export const getAllBillsApi = () => {
  return api.get("/list");
};

export const getBillPdfApi = (id: string) => {
  return api.get(`/pdf/${id}`, { responseType: "blob" });
};

export const createPaymentIntentApi = (billId: string) => {
  return api.post("/create-payment-intent", { billId });
};
