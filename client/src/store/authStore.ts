import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  role_code: number
  permissions: string[]
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    set({ user: null, isAuthenticated: false, isLoading: false })
  },
  setLoading: (loading) => set({ isLoading: loading }),
  hasPermission: (permission) => {
    const { user } = get()
    if (!user) return false
    if (user.role_code === 1989) return true // Super Admin
    return user.permissions?.includes(permission) ?? false
  },
}))
