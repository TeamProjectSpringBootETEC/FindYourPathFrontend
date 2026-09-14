import api from "./api";

export const getAllCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

