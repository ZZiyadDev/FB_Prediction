import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Your Django backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export const matchService = {
  getMatches: () => api.get('matches/'),
  getPrediction: (matchId) => api.get(`predictions/${matchId}/predict/`),
};

export default api;
