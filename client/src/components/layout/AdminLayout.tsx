import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const { sidebarCollapsed, theme } = useUIStore()
  const [, navigate] = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'mr-[72px]' : 'mr-[260px]'
        )}
      >
        <TopBar />
        <main className="p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
