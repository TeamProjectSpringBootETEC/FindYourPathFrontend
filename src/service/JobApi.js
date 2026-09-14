import api from "./api"


export const getAllJob = async () => {
  const response = await api.get("/jobs");
  console.log(response.data)
  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const getAllJobFields = async () => {
  const response = await api.get("/job-fields");
  return response.data;
};

export const getAllJobCategories = async () => {
  const response = await api.get("/job-categories");
  return response.data;
};

export const createJobCategory = async (payload) => {
  const response = await api.post("/job-categories", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateJobCategory = async (id, payload) => {
  const response = await api.put(`/job-categories/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteJobCategory = async (id) => {
  const response = await api.delete(`/job-categories/${id}`);
  return response.data;
};

export const createJob = async (payload) => {
  const response = await api.post("/jobs", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateJob = async (id, payload) => {
  const response = await api.put(`/jobs/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};


