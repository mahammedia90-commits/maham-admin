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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass-card p-5 group relative overflow-hidden', className)}
    >
      {/* Subtle gold gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-foreground font-mono tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {isPositive ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-success/10">
                  <TrendingUp size={13} className="text-success" />
                  <span className="text-xs font-semibold text-success">+{trend}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-danger/10">
                  <TrendingDown size={13} className="text-danger" />
                  <span className="text-xs font-semibold text-danger">{trend}%</span>
                </div>
              )}
              {trendLabel && (
                <span className="text-[11px] text-muted-foreground">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center',
          'bg-primary/8 border border-primary/15',
          'group-hover:bg-primary/12 group-hover:border-primary/25',
          'group-hover:shadow-[0_0_16px_var(--primary)/8%]',
          'transition-all duration-400',
        )}>
          <Icon size={20} className="text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
    </motion.div>
  )
}
