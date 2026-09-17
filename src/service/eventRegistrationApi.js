import api from "./api";

export const getAllRegistrations = async () => {
  const response = await api.get("/event-registrations");
  return response.data;
};

export const getRegistrationsByEventId = async (eventId) => {
  const response = await api.get(`/event-registrations/event/${eventId}`);
  return response.data;
};

export const createRegistration = async (data) => {
  const response = await api.post("/event-registrations", data);
  return response.data;
};

export const cancelRegistration = async (id) => {
  const response = await api.delete(`/event-registrations/${id}`);
  return response.data;
};