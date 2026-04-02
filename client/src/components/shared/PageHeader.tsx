import { ArrowRight } from 'lucide-react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  showBack?: boolean
}

export default function PageHeader({ title, subtitle, actions, showBack }: PageHeaderProps) {
  const [, navigate] = useLocation()
  const { theme } = useUIStore()
  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
            style={{
              background: isDark
                ? 'oklch(0.78 0.11 85 / 8%)'
                : 'oklch(0.55 0.14 80 / 6%)',
              border: isDark
                ? '1px solid oklch(0.78 0.11 85 / 10%)'
                : '1px solid oklch(0.55 0.14 80 / 8%)',
              color: isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)',
            }}
          >
            <ArrowRight size={18} />
          </motion.button>
        )}
        <div>
          <h1
            className="text-xl sm:text-2xl font-bold tracking-tight gold-title"
            style={{
              color: isDark ? 'oklch(0.95 0.005 85)' : 'oklch(0.15 0.015 75)',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-sm mt-1 leading-relaxed"
              style={{
                color: isDark ? 'oklch(0.88 0.005 85 / 50%)' : 'oklch(0.22 0.015 75 / 50%)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
