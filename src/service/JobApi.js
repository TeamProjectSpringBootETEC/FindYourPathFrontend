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


