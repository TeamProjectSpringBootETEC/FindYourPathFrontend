import api from "./api";

export const scanCv = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/cv/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const submitApplicationWithCv = async (jobId, data, file) => {
  const formData = new FormData();
  formData.append(
    "application",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
    "application.json"
  );
  if (file) formData.append("file", file);
  const response = await api.post(`/applications/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

export const updateApplicationStatus = async (applicationId, status, changedByUserId) => {
  const response = await api.post("/application-status-histories", {
    applicationId,
    status,
    changedByUserId,
  });
  return response.data;
};

export const getStatusHistories = async (applicationId) => {
  const response = await api.get(`/application-status-histories/application/${applicationId}`);
  return response.data;
};