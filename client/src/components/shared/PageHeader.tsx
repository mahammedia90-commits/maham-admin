import { ArrowRight } from 'lucide-react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  showBack?: boolean
}

export default function PageHeader({ title, subtitle, actions, showBack }: PageHeaderProps) {
  const [, navigate] = useLocation()

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => window.history.back()}
            className={cn(
              'btn-back flex items-center justify-center w-10 h-10 rounded-xl',
              'transition-all duration-300',
            )}
          >
            <ArrowRight size={18} />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
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
