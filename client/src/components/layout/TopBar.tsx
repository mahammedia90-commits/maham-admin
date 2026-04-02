import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import {
  Bell, Search, Sun, Moon, Menu, X, Command, Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const toggleRef = useRef<HTMLButtonElement>(null)
  const rippleIdRef = useRef(0)

  const handleThemeToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Add ripple
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = ++rippleIdRef.current
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 900)

    // Add transition class to body
    document.documentElement.classList.add('theme-transitioning')
    toggleTheme()
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 700)
  }, [toggleTheme])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-14 sm:h-16',
        'border-b border-border/30',
        'transition-all duration-500',
      )}
      style={{
        background: theme === 'dark'
          ? 'oklch(0.13 0.006 75 / 65%)'
          : 'oklch(0.97 0.004 80 / 65%)',
        backdropFilter: 'blur(48px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(48px) saturate(1.6)',
      }}
    >
      {/* Subtle top highlight line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(90deg, transparent, oklch(0.78 0.11 85 / 12%), transparent)'
            : 'linear-gradient(90deg, transparent, oklch(1 0 0 / 50%), transparent)',
        }}
      />

      <div className="flex items-center justify-between h-full px-3 sm:px-6">
        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              'lg:hidden p-2 rounded-xl transition-all duration-300',
              'text-muted-foreground hover:text-primary',
              'hover:bg-primary/8',
            )}
          >
            <Menu size={22} className="gold-icon" />
          </button>

          {/* Breadcrumb with gold shimmer */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <Sparkles size={14} className="text-primary/50" />
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
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'flex items-center gap-2 h-9 px-2.5 sm:px-3 rounded-xl text-sm transition-all duration-300',
                  'border text-muted-foreground',
                  'hover:border-primary/20 hover:text-foreground',
                )}
                style={{
                  background: theme === 'dark'
                    ? 'oklch(0.16 0.006 75 / 40%)'
                    : 'oklch(0.993 0.002 80 / 50%)',
                  borderColor: theme === 'dark'
                    ? 'oklch(0.26 0.008 80 / 40%)'
                    : 'oklch(0.88 0.008 80 / 60%)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Search size={16} />
                <span className="hidden md:inline">بحث...</span>
                <kbd className={cn(
                  'hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[10px] font-mono',
                  'bg-muted/50 text-muted-foreground border border-border/30',
                )}>
                  <Command size={10} /> K
                </kbd>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Theme Toggle with Ripple */}
          <button
            ref={toggleRef}
            onClick={handleThemeToggle}
            className={cn(
              'relative p-2 rounded-xl transition-all duration-400 overflow-hidden',
              'text-muted-foreground hover:text-primary',
              'border border-transparent hover:border-primary/15',
            )}
            style={{
              background: theme === 'dark'
                ? 'oklch(0.16 0.006 75 / 30%)'
                : 'oklch(0.993 0.002 80 / 40%)',
            }}
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {/* Ripple effects */}
            {ripples.map(ripple => (
              <span
                key={ripple.id}
                className="ripple"
                style={{
                  position: 'absolute',
                  left: ripple.x,
                  top: ripple.y,
                  width: 120,
                  height: 120,
                  marginTop: -60,
                  marginLeft: -60,
                  borderRadius: '50%',
                  background: theme === 'dark'
                    ? 'radial-gradient(circle, oklch(0.88 0.08 85 / 35%) 0%, transparent 70%)'
                    : 'radial-gradient(circle, oklch(0.55 0.14 80 / 30%) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  animation: 'rippleExpand 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                }}
              />
            ))}
            <motion.div
              key={theme}
              initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-primary" />
              ) : (
                <Moon size={18} className="text-primary" />
              )}
            </motion.div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifOpen(!notifOpen)}
              className={cn(
                'relative p-2 rounded-xl transition-all duration-300',
                'text-muted-foreground hover:text-primary',
                'border border-transparent hover:border-primary/15',
              )}
              style={{
                background: theme === 'dark'
                  ? 'oklch(0.16 0.006 75 / 30%)'
                  : 'oklch(0.993 0.002 80 / 40%)',
              }}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-primary gold-pulse" />
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-12 w-72 sm:w-80 z-50 overflow-hidden rounded-xl"
                    style={{
                      background: theme === 'dark'
                        ? 'oklch(0.15 0.006 75 / 85%)'
                        : 'oklch(0.993 0.002 80 / 90%)',
                      backdropFilter: 'blur(48px) saturate(1.5)',
                      WebkitBackdropFilter: 'blur(48px) saturate(1.5)',
                      border: `1px solid ${theme === 'dark' ? 'oklch(0.78 0.11 85 / 10%)' : 'oklch(0.55 0.14 80 / 10%)'}`,
                      boxShadow: theme === 'dark'
                        ? '0 16px 48px oklch(0 0 0 / 30%), 0 0 0 1px oklch(0.78 0.11 85 / 3%) inset'
                        : '0 16px 48px oklch(0 0 0 / 8%), 0 0 0 1px oklch(1 0 0 / 50%) inset',
                    }}
                  >
                    <div className="p-4 border-b border-border/20">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Bell size={14} className="text-primary" />
                        الإشعارات
                      </h3>
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
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'w-8 h-8 sm:w-9 sm:h-9 rounded-xl mr-0.5 sm:mr-1',
              'flex items-center justify-center',
              'text-primary font-bold text-xs sm:text-sm',
              'cursor-pointer transition-all duration-400',
            )}
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(135deg, oklch(0.78 0.11 85 / 15%), oklch(0.78 0.11 85 / 5%))'
                : 'linear-gradient(135deg, oklch(0.55 0.14 80 / 12%), oklch(0.55 0.14 80 / 4%))',
              border: `1px solid ${theme === 'dark' ? 'oklch(0.78 0.11 85 / 18%)' : 'oklch(0.55 0.14 80 / 15%)'}`,
              boxShadow: theme === 'dark'
                ? '0 0 12px oklch(0.78 0.11 85 / 8%)'
                : '0 0 12px oklch(0.55 0.14 80 / 6%)',
            }}
          >
            {user?.name?.charAt(0) || 'م'}
          </motion.div>
        </div>
      </div>
    </header>
  )
}
