import api from "./axios";

export const getBillsApi = () => {
  return api.get("/bill");
};

export const getBillingDashboardApi = () => {
  return api.get("/dashboard");
};
