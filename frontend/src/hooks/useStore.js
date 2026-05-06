import { create } from 'zustand';
import { matchService } from '../api';

const useStore = create((set) => ({
  // --- STATE ---
  rawMatches: [],     // <--- ADD THIS: For your MatchesPage table/list
  matchOptions: [],   // <--- RENAME THIS: For your Predictions dropdown
  selectedMatch: null,
  predictionData: null,
  isMatchesLoading: false,
  isPredicting: false,
  error: null,

  // --- ACTIONS ---
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
