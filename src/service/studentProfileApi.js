import api from "./api";

export const getStudentProfileByUserId = async (userId) => {
  const response = await api.get(`/student-profile/user/${userId}`);
  return response.data;
};

export const createStudentProfile = async (data) => {
  const response = await api.post("/student-profile", data);
  return response.data;
};

export const updateStudentProfile = async (id, data) => {
  const response = await api.put(`/student-profile/${id}`, data);
  return response.data;
};

export const uploadProfilePhoto = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(`/student-profile/${id}/profile-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProfilePhoto = async (id) => {
  const response = await api.delete(`/student-profile/${id}/profile-photo`);
  return response.data;
};