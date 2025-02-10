import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type History = {
  id: string
  title: string
  createdAt: string
}

export type UserInfo = {
  email: string
  name: string
  pictureUrl: string
  givenName: string
  familyName: string
  locale: string

  id: string
}

type AppState = {
  histories: History[]
  authToken: string
  userInfo: UserInfo | null
  addHistory: (history: History) => void
  removeHistory: (id: string) => void
  clearHistories: () => void
  setAuthToken: (token: string) => void
  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: 'home',
      histories: [], // Initialize empty array
      authToken: '',
      userInfo: null, // Initialize user info as null

      // User info actions
      setUserInfo: (info: UserInfo) => 
        set({ userInfo: info }),
      clearUserInfo: () => 
        set({ userInfo: null }),

      // Existing actions
      setAuthToken: (token: string) => 
        set({ authToken: token }),
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

// Helper hooks for user info
export const useUserInfo = () => useAppStore((state) => state.userInfo)
export const useSetUserInfo = () => useAppStore((state) => state.setUserInfo)
export const useClearUserInfo = () => useAppStore((state) => state.clearUserInfo)
