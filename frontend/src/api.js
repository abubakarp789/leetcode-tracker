import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export const getProblems = () => axios.get(`${API_BASE}/problems`);
export const addProblem = (formData, password) =>
  axios.post(`${API_BASE}/add`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic ' + btoa('admin:' + password),
    },
  }); 