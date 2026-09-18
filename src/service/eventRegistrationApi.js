import api from "./api";

export const getAllRegistrations = async () => {
  const response = await api.get("/event-registrations");
  return response.data;
};

export const getRegistrationsByEventId = async (eventId) => {
  const response = await api.get(`/event-registrations/event/${eventId}`);
  return response.data;
};

export const getRegistrationsByUserId = async (userId) => {
  const response = await api.get(`/event-registrations/user/${userId}`);
  return response.data;
};

export const getRegistrationByTicketCode = async (ticketCode) => {
  const response = await api.get(
    `/event-registrations/ticket/${encodeURIComponent(ticketCode)}`
  );
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

export const checkInRegistration = async (ticketCode) => {
  const response = await api.put(
    `/event-registrations/ticket/${encodeURIComponent(ticketCode)}/checkin`
  );
  return response.data;
};