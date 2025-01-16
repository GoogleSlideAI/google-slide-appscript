import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type History = {
  id: string
  title: string
  createdAt: string
}

type AppState = {
  histories: History[]
  authToken: string
  addHistory: (history: History) => void
  removeHistory: (id: string) => void
  clearHistories: () => void
  setAuthToken: (token: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: 'home',
      histories: [], // Initialize empty array
      authToken: '',
      setAuthToken: (token: string) => set({ authToken: token }),
      addHistory: (history) => 
        set((state) => ({ 
          histories: [...state.histories, history]
        })),
      removeHistory: (id) => 
        set((state) => ({
          histories: state.histories.filter((h) => h.id !== id)
        })),
      clearHistories: () => 
        set({ histories: [] }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
