import api from "./api";

// Phase 3 - candidate opens the interview; backend generates questions on first open
export const getInterview = async (interviewId) => {
  const response = await api.get(`/interviews/${interviewId}`);
  return response.data;
};

// Phase 3 & 4 - candidate submits every answer; Gemini grades it on the backend
export const submitInterviewAnswers = async (interviewId, answers) => {
  const response = await api.post(`/interviews/${interviewId}/submit-answer`, {
    answers,
  });
  return response.data;
};

// Phase 1 - company invites a candidate (creates interview + notification)
export const inviteCandidate = async (applicationId) => {
  const response = await api.post("/interviews/invite", { applicationId });
  return response.data;
};

// Phase 5 - company reads the interview + AI report for one application
export const getInterviewByApplication = async (applicationId) => {
  const response = await api.get(`/interviews/application/${applicationId}`);
  return response.data;
};

// Phase 5 - company finalizes the outcome (PASSED / FAILED)
export const setInterviewResult = async (interviewId, result) => {
  const response = await api.put(`/interviews/${interviewId}/result`, { result });
  return response.data;
};

export const getInterviewsByCandidate = async (candidateUserId) => {
  const response = await api.get(`/interviews/candidate/${candidateUserId}`);
  return response.data;
};

export const getInterviewsByCompany = async (companyId) => {
  const response = await api.get(`/interviews/company/${companyId}`);
  return response.data;
};