import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post('auth/login/', credentials),
  register: (userData) => api.post('auth/register/', userData),
  getUsers: () => api.get('auth/list/'),
  fetchFixtures: () => api.post('auth/actions/fetch_fixtures/'),
  fetchStatistics: () => api.post('auth/actions/fetch_statistics/'),
  fetchLineups: () => api.post('auth/actions/fetch_lineups/'),
};

export const matchService = {
  getMatches: () => api.get('matches/'),
  getPrediction: (matchId) => api.get(`predictions/${matchId}/predict/`),
  getAccuracy: () => api.get('predictions/accuracy/'),
  getHistory: () => api.get('predictions/history/'),
};

export default api;
