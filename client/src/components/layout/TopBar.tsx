import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import {
  Bell, Search, Sun, Moon, Menu, X, Command
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const { theme, toggleTheme, sidebarCollapsed, toggleCollapse } = useUIStore()
  const { user } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-6">
        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleCollapse}
            className="lg:hidden p-2 rounded-lg hover:bg-surface2 text-muted-foreground transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / Page Title Area */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">لوحة الإدارة</span>
          </div>
        </div>

        {/* Left Side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="بحث سريع... (Ctrl+K)"
                  className="w-full h-9 pr-10 pl-10 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  onBlur={() => setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 h-9 px-3 rounded-lg bg-surface2/50 border border-border/50 text-sm text-muted-foreground hover:border-gold/30 hover:text-foreground transition-all"
              >
                <Search size={16} />
                <span className="hidden md:inline">بحث...</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface3 text-[10px] font-mono text-muted-foreground border border-border/50">
                  <Command size={10} /> K
                </kbd>
              </button>
            )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-all"
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-gold animate-pulse" />
            </button>

            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute left-0 top-12 w-80 glass-card z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border/50">
                      <h3 className="text-sm font-bold text-foreground">الإشعارات</h3>
                    </div>
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      لا توجد إشعارات جديدة
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center text-gold font-bold text-sm mr-1">
            {user?.name?.charAt(0) || 'م'}
          </div>
        </div>
      </div>
    </header>
  )
}
