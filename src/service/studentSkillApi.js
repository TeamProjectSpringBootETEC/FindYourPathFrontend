import api from "./api";

export const getStudentSkillsByStudent = async (studentProfileId) => {
  const response = await api.get(`/student-skills/student/${studentProfileId}`);
  return response.data;
};

export const createStudentSkill = async (studentProfileId, data) => {
  const response = await api.post(`/student-skills/student/${studentProfileId}`, data);
  return response.data;
};

export const deleteStudentSkill = async (id) => {
  const response = await api.delete(`/student-skills/${id}`);
  return response.data;
};