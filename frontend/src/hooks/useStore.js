import create from 'zustand'
import api from '../api'

const useStore = create((set) => ({
  matches: [],
  predictions: [],
  loading: false,
  loadMatches: async () => {
    set({ loading: true })
    try {
      const response = await api.get('matches/')
      set({ matches: response.data })
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
      set({ predictions: response.data })
    } catch (error) {
      console.error('Failed to load predictions', error)
    } finally {
      set({ loading: false })
    }
  },
}))

export default useStore
