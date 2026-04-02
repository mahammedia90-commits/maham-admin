import { cn } from '@/lib/utils'
import { statusColors, statusLabels } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { theme } = useUIStore()
  const isDark = theme === 'dark'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300',
        statusColors[status] || 'bg-muted/50 text-muted-foreground border border-border',
        className
      )}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: isDark
          ? '0 2px 8px oklch(0 0 0 / 10%)'
          : '0 2px 8px oklch(0 0 0 / 3%)',
      }}
    >
      {statusLabels[status] || status}
    </span>
  )
}
