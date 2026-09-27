import api from "./api";

export const getAllNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const getNotificationsByUser = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}`);
  return response.data;
};

export const getUnreadNotifications = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}/unread`);
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async (userId) => {
  const response = await api.put(`/notifications/user/${userId}/read-all`);
  return response.data;
};