import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean       // mobile drawer open/close
  sidebarCollapsed: boolean  // desktop collapsed/expanded
  theme: 'dark' | 'light'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleCollapse: () => void
  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  theme: (typeof window !== 'undefined' && localStorage.getItem('maham-theme') as 'dark' | 'light') || 'dark',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('maham-theme', newTheme)
    document.documentElement.classList.toggle('light', newTheme === 'light')
    set({ theme: newTheme })
  },
  setTheme: (theme) => {
    localStorage.setItem('maham-theme', theme)
    document.documentElement.classList.toggle('light', theme === 'light')
    set({ theme })
  },
}))
