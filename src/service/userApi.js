import api from "./api";

export const getAllUsers = async () => {
  const response = await api.get("/v1/users");
  return response.data;
};