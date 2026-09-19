import api from "./api";

export const getAllCompanies = async () => {
  const response = await api.get("/companies");
  return response.data;
};

export const getCompanyById = async (id) => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

export const getCompanyByUserId = async (userId) => {
  const response = await api.get(`/companies/user/${userId}`);
  return response.data;
};

export const createCompany = async (data) => {
  const response = await api.post("/companies", data);
  return response.data;
};

export const updateCompany = async (id, data) => {
  const response = await api.put(`/companies/${id}`, data);
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await api.delete(`/companies/${id}`);
  return response.data;
};

export const uploadCompanyLogo = async (id, file) => {
  const formData = new FormData();
  formData.append("logo", file);
  const response = await api.post(`/companies/${id}/logo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCompanyLogo = async (id) => {
  const response = await api.delete(`/companies/${id}/logo`);
  return response.data;
};