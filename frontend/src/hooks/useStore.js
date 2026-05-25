import { create } from 'zustand';
import { matchService, authService } from '../api';
import { jwtDecode } from 'jwt-decode';

const useStore = create((set) => ({
  // --- AUTH STATE ---
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // --- DATA STATE ---
  rawMatches: [],
  matchOptions: [],
  selectedMatch: null,
  predictionData: null,
  isMatchesLoading: false,
  isPredicting: false,
  error: null,

  // --- AUTH ACTIONS ---
  login: async (credentials) => {
    set({ error: null });
    try {
      const response = await authService.login(credentials);
      const { access, refresh } = response.data;
      const decoded = jwtDecode(access);
      
      const userData = {
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      };

      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(userData));
      
      set({ user: userData, token: access, isAuthenticated: true });
      return userData;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Login failed';
      set({ error: msg });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // --- DATA ACTIONS ---
  setSelectedMatch: (matchId) => set({ selectedMatch: matchId }),

  fetchUpcomingMatches: async () => {
    set({ isMatchesLoading: true, error: null });
    try {
      const response = await matchService.getMatches();
      
      const options = response.data.map(match => ({
        value: match.id,
        label: `${match.home_team.name} vs ${match.away_team.name} (${new Date(match.match_date).toLocaleDateString()})`
      }));
      
      // Save BOTH the raw data and the dropdown options!
      set({ 
        rawMatches: response.data, 
        matchOptions: options, 
        isMatchesLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isMatchesLoading: false });
    }
  },

  runAiPrediction: async (matchId) => {
    set({ isPredicting: true, error: null, predictionData: null });
    try {
      const response = await matchService.getPrediction(matchId);
      set({ predictionData: response.data, isPredicting: false });
    } catch (error) {
      set({ error: error.message, isPredicting: false });
    }
  }
}));

export default useStore;
