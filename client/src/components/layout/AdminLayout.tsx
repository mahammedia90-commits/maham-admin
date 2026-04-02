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
  const isDark = theme === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location, setSidebarOpen])

  return (
    <div
      className="min-h-screen text-foreground transition-colors duration-500"
      dir="rtl"
      style={{
        background: isDark
          ? 'oklch(0.1 0.006 75)'
          : 'oklch(0.965 0.005 80)',
      }}
    >
      {/* Subtle ambient gradient orbs for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-right gold orb */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full animate-gold-float"
          style={{
            background: isDark
              ? 'radial-gradient(circle, oklch(0.78 0.11 85 / 4%) 0%, transparent 70%)'
              : 'radial-gradient(circle, oklch(0.55 0.14 80 / 3%) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Bottom-left accent orb */}
        <div
          className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, oklch(0.78 0.11 85 / 3%) 0%, transparent 70%)'
              : 'radial-gradient(circle, oklch(0.55 0.14 80 / 2%) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'goldFloat 8s ease-in-out infinite reverse',
          }}
        />
      </div>

      <Sidebar />

      <div
        className={cn(
          'relative z-10 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          'lg:mr-[280px]',
          sidebarCollapsed && 'lg:mr-[72px]',
          'mr-0'
        )}
      >
        <TopBar />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Footer subtle line */}
        <div className="px-8 pb-4">
          <div
            className="h-px mx-auto max-w-2xl"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, transparent, oklch(0.78 0.11 85 / 8%), transparent)'
                : 'linear-gradient(90deg, transparent, oklch(0.55 0.14 80 / 6%), transparent)',
            }}
          />
          <p
            className="text-center text-[10px] mt-3 font-medium tracking-wide"
            style={{
              color: isDark
                ? 'oklch(0.88 0.005 85 / 20%)'
                : 'oklch(0.22 0.015 75 / 20%)',
            }}
          >
            MAHAM EXPO &mdash; Powered by AI
          </p>
        </div>
      </div>
    </div>
  )
}
