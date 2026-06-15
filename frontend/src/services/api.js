import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const profileAPI = {
  createOrUpdate: (userId, data) => api.put(`/profile/update/${userId}`, data),
  get: (userId) => api.get(`/profile/${userId}`),
};

export const simulationAPI = {
  generate: (data) => api.post('/simulation/generate', data),
  compare: (data) => api.post('/simulation/compare', data),
  getHistory: (userId) => api.get(`/simulation/history/${userId}`),
  get: (id) => api.get(`/simulation/${id}`),
  delete: (id) => api.delete(`/simulation/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getSimulations: () => api.get('/admin/simulations'),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
};

export const reportAPI = {
  downloadPDF: (simulationId) => api.get(`/report/download/pdf/${simulationId}`, { responseType: 'blob' }),
  downloadCSV: (simulationId) => api.get(`/report/download/csv/${simulationId}`, { responseType: 'blob' }),
};

export default api;
