/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Leave Management System
 * ═══════════════════════════════════════════════════════════════════════════
 * Leave management: requests, approvals, balance tracking, calendar view,
 * Saudi labor law compliance (Article 109-116)
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Search, Plus, CheckCircle2, XCircle, Clock, Eye, Filter,
  AlertTriangle, Users, TrendingUp, Palmtree, Heart, Baby, Plane,
  Stethoscope, FileText, ArrowRight
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { EmployeeAvatar, MetricBox, ActionButton, EmptyState, SectionCard } from './HrShared'
import type { LeaveRequest, Employee } from '../hrTypes'
import { leaveTypeLabels, leaveTypeColors, leaveStatusLabels } from '../hrTypes'

interface HrLeavesProps {
  leaves: LeaveRequest[]
  employees: Employee[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onAdd: () => void
}

export default function HrLeaves({ leaves, employees, onApprove, onReject, onAdd }: HrLeavesProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'requests' | 'balances'>('requests')

  const filtered = useMemo(() => {
    return leaves.filter(l => {
      const matchSearch = !search || l.employee_name.includes(search) || l.department.includes(search)
      const matchType = typeFilter === 'all' || l.type === typeFilter
      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [leaves, search, typeFilter, statusFilter])

  const statusColors: Record<string, string> = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    approved: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-danger/10 text-danger border-danger/20',
    cancelled: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20'
  }

  // Stats
  const pendingCount = leaves.filter(l => l.status === 'pending').length
  const approvedCount = leaves.filter(l => l.status === 'approved').length
  const totalDays = leaves.filter(l => l.status === 'approved').reduce((s, l) => s + l.days, 0)
  const avgBalance = employees.length > 0 ? Math.round(employees.reduce((s, e) => s + e.leaves_balance, 0) / employees.length) : 0

  // Leave type icons
  const leaveIcons: Record<string, any> = {
    annual: Palmtree, sick: Stethoscope, emergency: AlertTriangle, maternity: Baby,
    paternity: Baby, hajj: Plane, unpaid: FileText, compassionate: Heart
  }

  // Saudi labor law entitlements
  const saudiEntitlements = [
    { type: 'سنوية', days: '21-30 يوم', article: 'المادة 109', desc: '21 يوم للسنوات الخمس الأولى، 30 يوم بعدها' },
    { type: 'مرضية', days: '120 يوم', article: 'المادة 117', desc: '30 يوم كاملة + 60 يوم 75% + 30 يوم بدون' },
    { type: 'أمومة', days: '70 يوم', article: 'المادة 151', desc: '4 أسابيع قبل + 6 أسابيع بعد الولادة' },
    { type: 'أبوة', days: '3 أيام', article: 'المادة 113', desc: 'عند ولادة مولود جديد' },
    { type: 'حج', days: '10-15 يوم', article: 'المادة 114', desc: 'لمن لم يؤدِّ الحج سابقاً' },
    { type: 'وفاة', days: '5 أيام', article: 'المادة 113', desc: 'وفاة الزوج/الزوجة أو أحد الأصول/الفروع' },
    { type: 'زواج', days: '5 أيام', article: 'المادة 113', desc: 'إجازة زواج مدفوعة' },
    { type: 'عدة', days: '130 يوم', article: 'المادة 160', desc: 'للمرأة المتوفى عنها زوجها' },
  ]

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-warning" />
            <span className="text-[10px] text-muted-foreground">طلبات معلقة</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{pendingCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">موافق عليها</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{approvedCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-info" />
            <span className="text-[10px] text-muted-foreground">إجمالي الأيام</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{totalDays}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Palmtree size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">متوسط الرصيد</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{avgBalance} يوم</p>
        </div>
      </div>

      {/* ─── View Toggle + Search ──────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center bg-surface2/50 rounded-xl border border-border/30 overflow-hidden shrink-0">
            <button onClick={() => setViewMode('requests')}
              className={cn('h-9 px-4 text-xs transition-all', viewMode === 'requests' ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground')}>
              الطلبات ({leaves.length})
            </button>
            <button onClick={() => setViewMode('balances')}
              className={cn('h-9 px-4 text-xs transition-all', viewMode === 'balances' ? 'bg-gold/10 text-gold font-bold' : 'text-muted-foreground')}>
              أرصدة الموظفين
            </button>
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث بالاسم أو القسم..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الأنواع</option>
              {Object.entries(leaveTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الحالات</option>
              {Object.entries(leaveStatusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <ActionButton label="طلب إجازة" icon={Plus} variant="primary" onClick={onAdd} />
          </div>
        </div>
      </div>

      {/* ─── Leave Requests ────────────────────────────────────────────── */}
      {viewMode === 'requests' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border/20">
                  {['الموظف', 'النوع', 'من', 'إلى', 'الأيام', 'السبب', 'البديل', 'الحالة', 'إجراءات'].map(h => (
                    <th key={h} className="p-3 text-right text-[10px] font-bold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(leave => {
                  const Icon = leaveIcons[leave.type] || Calendar
                  return (
                    <tr key={leave.id} className="border-b border-border/10 hover:bg-surface2/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <EmployeeAvatar name={leave.employee_name} size="sm" />
                          <div>
                            <p className="text-xs font-medium text-foreground">{leave.employee_name}</p>
                            <p className="text-[9px] text-muted-foreground">{leave.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1', leaveTypeColors[leave.type])}>
                          <Icon size={10} /> {leaveTypeLabels[leave.type]}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-muted-foreground">{formatDate(leave.start_date)}</td>
                      <td className="p-3 text-[11px] text-muted-foreground">{formatDate(leave.end_date)}</td>
                      <td className="p-3 text-[11px] font-bold font-mono text-foreground">{leave.days}</td>
                      <td className="p-3 text-[10px] text-muted-foreground max-w-[150px] truncate">{leave.reason}</td>
                      <td className="p-3 text-[10px] text-muted-foreground">{leave.substitute_name || '—'}</td>
                      <td className="p-3">
                        <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', statusColors[leave.status])}>
                          {leaveStatusLabels[leave.status]}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {leave.status === 'pending' && (
                            <>
                              <button onClick={() => onApprove(leave.id)}
                                className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success"><CheckCircle2 size={12} /></button>
                              <button onClick={() => onReject(leave.id)}
                                className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger"><XCircle size={12} /></button>
                            </>
                          )}
                          <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Employee Balances ─────────────────────────────────────────── */}
      {viewMode === 'balances' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {employees.filter(e => !search || e.full_name_ar.includes(search)).map(emp => (
            <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-3 sm:p-4 hover:border-gold/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <EmployeeAvatar name={emp.full_name_ar} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{emp.full_name_ar}</p>
                  <p className="text-[10px] text-muted-foreground">{emp.department_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <MetricBox label="الرصيد" value={`${emp.leaves_balance} يوم`} color="success" />
                <MetricBox label="مستخدم" value={`${emp.leaves_taken} يوم`} color="warning" />
                <MetricBox label="الإجمالي" value={`${emp.leaves_balance + emp.leaves_taken} يوم`} />
              </div>
              <div className="mt-2 h-2 rounded-full bg-surface2/50 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-l from-gold to-gold/60 transition-all"
                  style={{ width: `${(emp.leaves_taken / (emp.leaves_balance + emp.leaves_taken)) * 100}%` }} />
              </div>
              <p className="text-[9px] text-muted-foreground mt-1 text-left">
                {Math.round((emp.leaves_taken / (emp.leaves_balance + emp.leaves_taken)) * 100)}% مستخدم
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Saudi Labor Law Entitlements ──────────────────────────────── */}
      <SectionCard title="استحقاقات الإجازات — نظام العمل السعودي" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {saudiEntitlements.map(ent => (
            <div key={ent.type} className="p-3 rounded-xl bg-surface2/30 border border-border/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-foreground">{ent.type}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-mono">{ent.days}</span>
              </div>
              <p className="text-[9px] text-muted-foreground">{ent.desc}</p>
              <span className="text-[8px] text-gold/60 mt-1 inline-block">{ent.article}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
