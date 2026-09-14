import api from "./api";

export const scanCv = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/cv/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const submitApplication = async (jobId, data) => {
  const response = await api.post(`/applications/${jobId}`, data);
  return response.data;
};

export const getApplicationsByStudent = async (studentProfileId) => {
  const response = await api.get(`/applications/student/${studentProfileId}`);
  return response.data;
};

export const getApplicationsByJob = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

export const getAllApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

export const assessApplication = async (applicationId) => {
  const response = await api.post(`/applications/${applicationId}/assess`);
  return response.data;
};