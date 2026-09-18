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

export const sendResetOtp = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/auth/reset-password", { email, otp, newPassword });
  return response.data;
};