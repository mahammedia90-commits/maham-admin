import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

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
  const { theme } = useUIStore()
  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.3 } }}
      className={cn('group relative overflow-hidden rounded-2xl p-5 cursor-default', className)}
      style={{
        background: isDark
          ? 'oklch(0.14 0.006 75 / 60%)'
          : 'oklch(0.993 0.002 80 / 65%)',
        backdropFilter: 'blur(40px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
        border: isDark
          ? '1px solid oklch(0.78 0.11 85 / 6%)'
          : '1px solid oklch(0.55 0.14 80 / 6%)',
        boxShadow: isDark
          ? '0 4px 24px oklch(0 0 0 / 15%), inset 0 1px 0 oklch(1 0 0 / 3%)'
          : '0 4px 24px oklch(0 0 0 / 4%), inset 0 1px 0 oklch(1 0 0 / 50%)',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {/* Gold shimmer sweep on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, oklch(0.78 0.11 85 / 4%) 0%, transparent 50%, oklch(0.78 0.11 85 / 2%) 100%)'
            : 'linear-gradient(135deg, oklch(0.55 0.14 80 / 3%) 0%, transparent 50%, oklch(0.55 0.14 80 / 2%) 100%)',
        }}
      />

      {/* Top highlight line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent, oklch(0.78 0.11 85 / 10%), transparent)'
            : 'linear-gradient(90deg, transparent, oklch(1 0 0 / 40%), transparent)',
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-xs font-semibold mb-1.5 tracking-wide"
            style={{ color: isDark ? 'oklch(0.88 0.005 85 / 65%)' : 'oklch(0.22 0.015 75 / 65%)' }}
          >
            {title}
          </p>
          <p
            className="text-2xl font-bold font-mono tracking-tight"
            style={{ color: isDark ? 'oklch(0.95 0.005 85)' : 'oklch(0.15 0.015 75)' }}
          >
            {value}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {isPositive ? (
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                  style={{
                    background: isDark ? 'oklch(0.55 0.15 145 / 12%)' : 'oklch(0.55 0.15 145 / 8%)',
                    border: isDark ? '1px solid oklch(0.55 0.15 145 / 10%)' : '1px solid oklch(0.55 0.15 145 / 8%)',
                  }}
                >
                  <TrendingUp size={13} className="text-success" />
                  <span className="text-xs font-semibold text-success">+{trend}%</span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                  style={{
                    background: isDark ? 'oklch(0.55 0.2 25 / 12%)' : 'oklch(0.55 0.2 25 / 8%)',
                    border: isDark ? '1px solid oklch(0.55 0.2 25 / 10%)' : '1px solid oklch(0.55 0.2 25 / 8%)',
                  }}
                >
                  <TrendingDown size={13} className="text-danger" />
                  <span className="text-xs font-semibold text-danger">{trend}%</span>
                </div>
              )}
              {trendLabel && (
                <span
                  className="text-[11px]"
                  style={{ color: isDark ? 'oklch(0.88 0.005 85 / 60%)' : 'oklch(0.22 0.015 75 / 55%)' }}
                >
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon with gold glow */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-400"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, oklch(0.78 0.11 85 / 12%), oklch(0.78 0.11 85 / 4%))'
              : 'linear-gradient(135deg, oklch(0.55 0.14 80 / 10%), oklch(0.55 0.14 80 / 3%))',
            border: isDark
              ? '1px solid oklch(0.78 0.11 85 / 12%)'
              : '1px solid oklch(0.55 0.14 80 / 10%)',
            boxShadow: isDark
              ? '0 0 12px oklch(0.78 0.11 85 / 6%)'
              : '0 0 12px oklch(0.55 0.14 80 / 5%)',
          }}
        >
          <Icon
            size={20}
            className="transition-all duration-300 group-hover:scale-110"
            style={{
              color: isDark ? 'oklch(0.78 0.11 85)' : 'oklch(0.55 0.14 80)',
              filter: isDark
                ? 'drop-shadow(0 0 4px oklch(0.78 0.11 85 / 25%))'
                : 'drop-shadow(0 0 4px oklch(0.55 0.14 80 / 20%))',
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
