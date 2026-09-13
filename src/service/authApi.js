import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/v1/users", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/v1/users/${id}`, userData);
  return response.data;
};