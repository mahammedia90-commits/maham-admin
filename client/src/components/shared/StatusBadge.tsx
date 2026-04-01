import { cn } from '@/lib/utils'
import { statusColors, statusLabels } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusColors[status] || 'bg-muted/50 text-muted-foreground border border-border',
        className
      )}
    >
      {statusLabels[status] || status}
    </span>
  )
}
