import api from "./api"


export const getAllJob = async () => {
  const response = await api.get("/jobs");
  console.log(response.data)
  return response.data;
};


