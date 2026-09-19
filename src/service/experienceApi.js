import api from "./api";

export const getExperiencesByStudent = async (studentProfileId) => {
  const response = await api.get(`/experiences/student/${studentProfileId}`);
  return response.data;
};

export const createExperience = async (studentProfileId, data) => {
  const response = await api.post(`/experiences/student/${studentProfileId}`, data);
  return response.data;
};

export const updateExperience = async (id, data) => {
  const response = await api.put(`/experiences/${id}`, data);
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/experiences/${id}`);
  return response.data;
};