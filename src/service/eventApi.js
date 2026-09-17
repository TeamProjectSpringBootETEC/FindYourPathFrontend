import api from "./api";

export const getAllevent = async () => {
  const response = await api.get("/events");
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const getEventsByCompanyId = async (companyId) => {
  const response = await api.get(`/events/company/${companyId}`);
  return response.data;
};

export const getAllEventCategories = async () => {
  const response = await api.get("/event-categories");
  return response.data;
};

export const createEvent = async (payload) => {
  const response = await api.post("/events", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updateEvent = async (id, payload) => {
  const response = await api.put(`/events/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};