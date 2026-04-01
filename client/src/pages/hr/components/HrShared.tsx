/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Shared Components
 * ═══════════════════════════════════════════════════════════════════════════
 * Reusable primitives: MiniProgress, SeverityBadge, EmptyState, SectionCard,
 * InfoField, MetricBox, TabButton, EmployeeAvatar, ActionButton
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

// ─── Mini Progress Bar ─────────────────────────────────────────────────────
export function MiniProgress({ value, color = 'gold', size = 'sm', label }: {
  value: number; color?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; label?: string
}) {
  const heights: Record<string, string> = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const colorMap: Record<string, string> = {
    gold: 'bg-gold', success: 'bg-success', warning: 'bg-warning',
    danger: 'bg-danger', info: 'bg-info', blue: 'bg-blue-500',
    emerald: 'bg-emerald-500', purple: 'bg-purple-500', cyan: 'bg-cyan-500'
  }
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-muted-foreground">{label}</span>
          <span className="text-[9px] font-mono text-foreground">{Math.round(value)}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-surface3', heights[size])}>
        <div className={cn('rounded-full transition-all duration-700 ease-out', heights[size], colorMap[color] || 'bg-gold')}
          style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  )
}

// ─── Severity Badge ────────────────────────────────────────────────────────
export function SeverityBadge({ severity, size = 'sm' }: { severity: string; size?: 'sm' | 'md' }) {
  const map: Record<string, string> = {
    critical: 'bg-danger/10 text-danger border-danger/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-info/10 text-info border-info/20',
  }
  const labels: Record<string, string> = { critical: 'حرج', high: 'عالي', medium: 'متوسط', low: 'منخفض' }
  const sizeClass = size === 'md' ? 'text-xs px-2.5 py-0.5' : 'text-[10px] px-2 py-0.5'
  return <span className={cn(sizeClass, 'rounded-full border font-medium', map[severity])}>{labels[severity]}</span>
}

// ─── Empty State ───────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle, action }: {
  icon: LucideIcon; title: string; subtitle?: string; action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface2/50 border border-border/30 flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted-foreground/40" />
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/60 max-w-sm">{subtitle}</p>}
      {action && (
        <button onClick={action.onClick}
          className="mt-4 h-8 px-4 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all">
          {action.label}
        </button>
      )}
    </div>
  )
}

// ─── Section Card ──────────────────────────────────────────────────────────
export function SectionCard({ title, icon: Icon, iconColor = 'text-gold', badge, badgeColor, headerAction, children, className }: {
  title: string; icon: LucideIcon; iconColor?: string; badge?: string | number;
  badgeColor?: string; headerAction?: React.ReactNode; children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('glass-card overflow-hidden', className)}>
      <div className="p-3 sm:p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Icon size={16} className={iconColor} /> {title}
          </h3>
          <div className="flex items-center gap-2">
            {badge !== undefined && (
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full', badgeColor || 'bg-gold/10 text-gold')}>
                {badge}
              </span>
            )}
            {headerAction}
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  )
}

// ─── Info Field ────────────────────────────────────────────────────────────
export function InfoField({ label, value, icon: Icon, iconColor, dir, mono }: {
  label: string; value: string | number; icon?: LucideIcon; iconColor?: string; dir?: string; mono?: boolean
}) {
  return (
    <div className="p-2.5 rounded-xl bg-surface2/50 border border-border/30">
      <p className="text-[9px] text-muted-foreground mb-0.5">{label}</p>
      <p className={cn('text-xs text-foreground flex items-center gap-1', mono && 'font-mono')} dir={dir}>
        {Icon && <Icon size={10} className={iconColor || 'text-gold'} />}
        {value}
      </p>
    </div>
  )
}

// ─── Metric Box ────────────────────────────────────────────────────────────
export function MetricBox({ label, value, color = 'foreground', bgColor, borderColor, size = 'sm' }: {
  label: string; value: string | number; color?: string; bgColor?: string; borderColor?: string; size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: { container: 'p-1.5', label: 'text-[8px]', value: 'text-xs' },
    md: { container: 'p-2', label: 'text-[9px]', value: 'text-sm' },
    lg: { container: 'p-3', label: 'text-[10px]', value: 'text-lg' }
  }
  const s = sizeClasses[size]
  return (
    <div className={cn(s.container, 'rounded-lg text-center', bgColor || 'bg-surface2/30', borderColor && `border ${borderColor}`)}>
      <p className={cn(s.label, 'text-muted-foreground')}>{label}</p>
      <p className={cn(s.value, 'font-bold font-mono', `text-${color}`)}>{value}</p>
    </div>
  )
}

// ─── Employee Avatar ───────────────────────────────────────────────────────
export function EmployeeAvatar({ name, size = 'md', className }: {
  name: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string
}) {
  const sizes = {
    xs: 'w-6 h-6 text-[8px]', sm: 'w-8 h-8 text-[10px]', md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base', xl: 'w-14 h-14 text-xl'
  }
  const radiuses = { xs: 'rounded-lg', sm: 'rounded-lg', md: 'rounded-xl', lg: 'rounded-2xl', xl: 'rounded-2xl' }
  return (
    <div className={cn(sizes[size], radiuses[size], 'bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold shrink-0', className)}>
      {name.charAt(0)}
    </div>
  )
}

// ─── Action Button ─────────────────────────────────────────────────────────
export function ActionButton({ label, icon: Icon, variant = 'default', size = 'sm', onClick, disabled, className }: {
  label: string; icon?: LucideIcon; variant?: 'default' | 'primary' | 'success' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md'; onClick: () => void; disabled?: boolean; className?: string
}) {
  const variants = {
    default: 'bg-surface2 border border-border/50 text-muted-foreground hover:text-foreground',
    primary: 'bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold hover:shadow-lg hover:shadow-gold/25',
    success: 'bg-success/10 text-success hover:bg-success/20',
    danger: 'bg-danger/10 text-danger hover:bg-danger/20',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-surface2/50'
  }
  const sizes = { xs: 'h-6 px-2 text-[10px] gap-1', sm: 'h-8 px-3 text-xs gap-1.5', md: 'h-9 px-4 text-sm gap-2' }
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn('rounded-xl transition-all flex items-center', variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)}>
      {Icon && <Icon size={size === 'xs' ? 10 : size === 'sm' ? 12 : 14} />}
      {label}
    </button>
  )
}

// ─── Status Dot ────────────────────────────────────────────────────────────
export function StatusDot({ status, label }: { status: 'online' | 'offline' | 'away' | 'busy'; label?: string }) {
  const colors = { online: 'bg-success', offline: 'bg-muted-foreground', away: 'bg-warning', busy: 'bg-danger' }
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('w-2 h-2 rounded-full', colors[status])} />
      {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
    </div>
  )
}

// ─── Integration Status Card ───────────────────────────────────────────────
export function IntegrationCard({ name, label, status, icon: Icon, color }: {
  name: string; label: string; status: string; icon: LucideIcon; color: string
}) {
  return (
    <div className="p-2 rounded-lg bg-surface2/30 border border-border/20 hover:border-gold/15 transition-all">
      <div className="flex items-center gap-2">
        <Icon size={14} className={`text-${color}`} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-foreground">{name}</p>
          <p className="text-[9px] text-muted-foreground truncate">{label}</p>
        </div>
        <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full', `bg-${color}/10 text-${color}`)}>{status}</span>
      </div>
    </div>
  )
}

// ─── Timeline Item ─────────────────────────────────────────────────────────
export function TimelineItem({ title, description, date, icon: Icon, iconColor, isLast }: {
  title: string; description?: string; date: string; icon: LucideIcon; iconColor?: string; isLast?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-surface2/50 border border-border/30')}>
          <Icon size={14} className={iconColor || 'text-gold'} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/30 my-1" />}
      </div>
      <div className="flex-1 pb-4">
        <p className="text-xs font-medium text-foreground">{title}</p>
        {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
        <p className="text-[9px] text-muted-foreground/60 mt-0.5">{date}</p>
      </div>
    </div>
  )
}
