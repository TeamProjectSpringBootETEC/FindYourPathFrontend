import api from "./api";

export const getAllSavedJobs = async () => {
  const response = await api.get("/saved-jobs");
  return response.data;
};

export const getSavedJobsByStudent = async (studentId) => {
  const response = await api.get(`/saved-jobs/student/${studentId}`);
  return response.data;
};

export const createSavedJob = async (payload) => {
  const response = await api.post("/saved-jobs", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteSavedJob = async (id) => {
  const response = await api.delete(`/saved-jobs/${id}`);
  return response.data;
};