import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export const getProblems = () => axios.get(`${API_BASE}/problems`);
export const addProblem = (formData, password) =>
  axios.post(`${API_BASE}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${password}`,
    },
  });
export const getProblem = (id) => axios.get(`${API_BASE}/problems/${id}`);
export const getReviewQueue = () => axios.get(`${API_BASE}/problems/review-queue`);
export const reviewProblem = (id, quality) => axios.post(`${API_BASE}/problems/${id}/review`, { quality }); 