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

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location, setSidebarOpen])

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Sidebar />

      <div
        className={cn(
          'transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          // Desktop: margin based on sidebar state
          'lg:mr-[280px]',
          sidebarCollapsed && 'lg:mr-[72px]',
          // Mobile: no margin
          'mr-0'
        )}
      >
        <TopBar />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
