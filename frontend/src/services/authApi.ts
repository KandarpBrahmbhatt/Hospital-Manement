import api from "./axios";

export const loginApi = (
  data: any
) => {
  return api.post(
    "/login",
    data
  );
};

export const signupApi = (
  data: any
) => {
  return api.post(
    "/signup",
    data
  );
};

export const logoutApi = () => {
  return api.post("/auth/logout");
};