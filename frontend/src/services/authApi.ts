import api from "./axios";

export const loginApi = (
  data: any
) => {
  return api.post(
    "/auth/login",
    data
  );
};

export const signupApi = (
  data: any
) => {
  return api.post(
    "/auth/signup",
    data
  );
};

export const logoutApi = () => {
  return api.post("/auth/logout");
};

export const getRolesApi = () => {
  return api.get("/auth/roles");
};