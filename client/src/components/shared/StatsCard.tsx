import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  className?: string
  delay?: number
}

export default function StatsCard({ title, value, icon: Icon, trend, trendLabel, className, delay = 0 }: StatsCardProps) {
  const isPositive = trend && trend > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn('glass-card p-3 sm:p-4 md:p-5 group', className)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 truncate">{title}</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground font-mono tracking-tight truncate">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              {isPositive ? (
                <TrendingUp size={12} className="text-success sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              ) : (
                <TrendingDown size={12} className="text-danger sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              )}
              <span className={cn('text-[11px] sm:text-xs font-medium', isPositive ? 'text-success' : 'text-danger')}>
                {isPositive ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all flex-shrink-0">
          <Icon size={16} className="text-gold sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
        </div>
      </div>
    </motion.div>
  )
}
