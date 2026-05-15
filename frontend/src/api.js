import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Changed from localhost to 127.0.0.1
  headers: {
    'Content-Type': 'application/json',
  },
});

export const matchService = {
  getMatches: () => api.get('matches/'),
  getPrediction: (matchId) => api.get(`predictions/${matchId}/predict/`),
};

export default api;
