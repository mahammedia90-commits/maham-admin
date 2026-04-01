import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({
  icon,
  title = 'لا توجد بيانات',
  description = 'لم يتم العثور على أي نتائج. جرّب تغيير معايير البحث.',
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface2 border border-border/50 flex items-center justify-center mb-4">
        {icon || <Inbox size={28} className="text-muted-foreground/50" />}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}
