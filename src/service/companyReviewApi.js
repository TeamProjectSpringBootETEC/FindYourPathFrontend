import api from "./api";

export const getAllCompanyReviews = async () => {
  const response = await api.get("/company-reviews");
  return response.data;
};

export const getReviewsByCompanyId = async (companyId) => {
  const response = await api.get(`/company-reviews/company/${companyId}`);
  return response.data;
};

export const createCompanyReview = async (data) => {
  const response = await api.post("/company-reviews", data);
  return response.data;
};

export const updateCompanyReview = async (id, data) => {
  const response = await api.put(`/company-reviews/${id}`, data);
  return response.data;
};

export const deleteCompanyReview = async (id) => {
  const response = await api.delete(`/company-reviews/${id}`);
  return response.data;
};

export const getLikedReviewIdsByUser = async (userId) => {
  const response = await api.get(`/company-reviews/liked-user/${userId}`);
  return response.data;
};

export const likeCompanyReview = async (reviewId, userId) => {
  const response = await api.post(`/company-reviews/${reviewId}/like`, { userId });
  return response.data;
};

export const unlikeCompanyReview = async (reviewId, userId) => {
  const response = await api.delete(`/company-reviews/${reviewId}/like/${userId}`);
  return response.data;
};