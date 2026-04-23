import { create } from 'zustand'
import api from '../api'

const useStore = create((set) => ({
  matches: [],
  predictions: [],
  loading: false,

  loadMatches: async () => {
    set({ loading: true })
    try {
      const response = await api.get('matches/')
      // Safely handle Django REST Framework pagination if it's active
      const matchData = response.data.results || response.data;
      set({ matches: matchData })
    } catch (error) {
      console.error('Failed to load matches', error)
    } finally {
      set({ loading: false })
    }
  },

  loadPredictions: async () => {
    set({ loading: true })
    try {
      const response = await api.get('predictions/')
      const predictionData = response.data.results || response.data;
      set({ predictions: predictionData })
    } catch (error) {
      console.error('Failed to load predictions', error)
    } finally {
      set({ loading: false })
    }
  },
}))

export default useStore
