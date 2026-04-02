import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import {
  Bell, Search, Sun, Moon, Menu, X, Command
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-14 sm:h-16',
        'border-b border-border/40',
        'bg-background/70 backdrop-blur-2xl',
        'transition-all duration-300',
      )}
    >
      <div className="flex items-center justify-between h-full px-3 sm:px-6">
        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              'lg:hidden p-2 rounded-xl transition-all duration-300',
              'text-muted-foreground hover:text-primary',
              'hover:bg-accent',
            )}
          >
            <Menu size={22} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">لوحة الإدارة</span>
          </div>
        </div>

        {/* Left Side */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="بحث..."
                  className={cn(
                    'w-full h-9 pr-10 pl-10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground',
                    'glass-input',
                  )}
                  onBlur={() => setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'flex items-center gap-2 h-9 px-2.5 sm:px-3 rounded-xl text-sm transition-all duration-300',
                  'bg-accent/50 border border-border/50 text-muted-foreground',
                  'hover:border-primary/20 hover:text-foreground hover:bg-accent',
                )}
              >
                <Search size={16} />
                <span className="hidden md:inline">بحث...</span>
                <kbd className={cn(
                  'hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[10px] font-mono',
                  'bg-muted text-muted-foreground border border-border/50',
                )}>
                  <Command size={10} /> K
                </kbd>
              </button>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'p-2 rounded-xl transition-all duration-300 relative overflow-hidden',
              'text-muted-foreground hover:text-primary',
              'hover:bg-accent',
            )}
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={cn(
                'relative p-2 rounded-xl transition-all duration-300',
                'text-muted-foreground hover:text-primary',
                'hover:bg-accent',
              )}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-primary gold-pulse" />
            </button>

            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-12 w-72 sm:w-80 glass-card z-50 overflow-hidden shadow-depth-3"
                  >
                    <div className="p-4 border-b border-border/30">
                      <h3 className="text-sm font-bold text-foreground">الإشعارات</h3>
                    </div>
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      لا توجد إشعارات جديدة
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className={cn(
            'w-8 h-8 sm:w-9 sm:h-9 rounded-xl mr-0.5 sm:mr-1',
            'bg-gradient-to-br from-primary/20 to-primary/5',
            'border border-primary/20',
            'flex items-center justify-center',
            'text-primary font-bold text-xs sm:text-sm',
            'transition-all duration-300 hover:border-primary/35 hover:shadow-[0_0_12px_var(--primary)/10%]',
          )}>
            {user?.name?.charAt(0) || 'م'}
          </div>
        </div>
      </div>
    </header>
  )
}
