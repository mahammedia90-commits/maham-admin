import { ArrowRight } from 'lucide-react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'

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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => window.history.back()}
            className="btn-back flex items-center justify-center w-10 h-10 rounded-xl"
          >
            <ArrowRight size={18} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  )
}
