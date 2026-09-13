import api from "./api";

export const getEducationsByStudent = async (studentProfileId) => {
  const response = await api.get(`/educations/student/${studentProfileId}`);
  return response.data;
};

export const createEducation = async (studentProfileId, data) => {
  const response = await api.post(`/educations/student/${studentProfileId}`, data);
  return response.data;
};

export const updateEducation = async (id, data) => {
  const response = await api.put(`/educations/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id) => {
  const response = await api.delete(`/educations/${id}`);
  return response.data;
};