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
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen, theme } = useUIStore()
  const [location] = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // Close mobile drawer on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location, setSidebarOpen])

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          // Desktop: margin for fixed sidebar
          'lg:mr-[260px]',
          sidebarCollapsed && 'lg:mr-[72px]',
          // Mobile: no margin (sidebar is overlay)
          'mr-0'
        )}
      >
        <TopBar />
        <main className="p-3 sm:p-4 md:p-5 lg:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
