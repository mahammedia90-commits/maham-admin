/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAHAM EXPO — HR Compliance Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * Compliance monitoring: Iqama, GOSI, Qiwa, Nitaqat, WPS, PDPL,
 * auto-alerts, regulatory dashboard, audit trail
 * ═══════════════════════════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Search, AlertTriangle, CheckCircle2, XCircle, Clock, Eye,
  Bell, FileText, Building2, Users, TrendingUp, BarChart3, Filter,
  ExternalLink, Calendar, Zap, Lock
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { SeverityBadge, MetricBox, ActionButton, SectionCard } from './HrShared'
import type { ComplianceAlert, Employee } from '../hrTypes'
import { complianceAlertTypeLabels } from '../hrTypes'

interface HrComplianceProps {
  alerts: ComplianceAlert[]
  employees: Employee[]
}

export default function HrCompliance({ alerts, employees }: HrComplianceProps) {
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return alerts.filter(a => {
      const matchSearch = !search || a.title.includes(search) || (a.employee_name && a.employee_name.includes(search))
      const matchSeverity = severityFilter === 'all' || a.severity === severityFilter
      const matchStatus = statusFilter === 'all' || a.status === statusFilter
      return matchSearch && matchSeverity && matchStatus
    })
  }, [alerts, search, severityFilter, statusFilter])

  // Stats
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'compliant').length
  const highCount = alerts.filter(a => a.severity === 'high' && a.status !== 'compliant').length
  const compliantCount = alerts.filter(a => a.status === 'compliant').length
  const totalSaudis = employees.filter(e => e.nationality === 'saudi').length
  const saudizationRate = employees.length > 0 ? Math.round((totalSaudis / employees.length) * 100) : 0

  // Nitaqat calculation
  const nitaqatColor = saudizationRate >= 80 ? 'بلاتيني' : saudizationRate >= 60 ? 'أخضر مرتفع' : saudizationRate >= 40 ? 'أخضر متوسط' : saudizationRate >= 26 ? 'أخضر منخفض' : saudizationRate >= 10 ? 'أصفر' : 'أحمر'
  const nitaqatBg = saudizationRate >= 60 ? 'bg-success/10 text-success border-success/20' : saudizationRate >= 26 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-danger/10 text-danger border-danger/20'

  // Government systems
  const govSystems = [
    { name: 'قوى (Qiwa)', status: 'متصل', desc: 'إدارة العقود والتأشيرات', url: 'qiwa.sa', color: 'success' },
    { name: 'التأمينات (GOSI)', status: 'متصل', desc: 'اشتراكات التأمينات الاجتماعية', url: 'gosi.gov.sa', color: 'success' },
    { name: 'أبشر (Absher)', status: 'متصل', desc: 'خدمات الجوازات والإقامات', url: 'absher.sa', color: 'success' },
    { name: 'مقيم (Muqeem)', status: 'متصل', desc: 'إدارة العمالة الوافدة', url: 'muqeem.sa', color: 'success' },
    { name: 'نطاقات (Nitaqat)', status: 'نشط', desc: 'برنامج توطين الوظائف', url: 'hrsd.gov.sa', color: 'gold' },
    { name: 'حماية الأجور (WPS)', status: 'متصل', desc: 'نظام حماية الأجور', url: 'mol.gov.sa', color: 'success' },
    { name: 'PDPL', status: 'ممتثل', desc: 'نظام حماية البيانات الشخصية', url: 'sdaia.gov.sa', color: 'success' },
    { name: 'ZATCA', status: 'متصل', desc: 'الفوترة الإلكترونية والضرائب', url: 'zatca.gov.sa', color: 'success' },
  ]

  const statusColors: Record<string, string> = {
    compliant: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    violation: 'bg-danger/10 text-danger border-danger/20',
    pending: 'bg-info/10 text-info border-info/20'
  }
  const statusLabels: Record<string, string> = { compliant: 'ممتثل', warning: 'تحذير', violation: 'مخالفة', pending: 'معلق' }

  return (
    <div className="space-y-4">
      {/* ─── KPI Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="glass-card p-3 border-danger/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-danger" />
            <span className="text-[10px] text-muted-foreground">تنبيهات حرجة</span>
          </div>
          <p className="text-lg font-bold font-mono text-danger">{criticalCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={14} className="text-warning" />
            <span className="text-[10px] text-muted-foreground">تنبيهات عالية</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{highCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-[10px] text-muted-foreground">ممتثل</span>
          </div>
          <p className="text-lg font-bold font-mono text-foreground">{compliantCount}</p>
        </div>
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-gold" />
            <span className="text-[10px] text-muted-foreground">نسبة السعودة</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold font-mono text-foreground">{saudizationRate}%</p>
            <span className={cn('text-[8px] px-1.5 py-0.5 rounded-full border', nitaqatBg)}>{nitaqatColor}</span>
          </div>
        </div>
      </div>

      {/* ─── Government Systems Integration ────────────────────────────── */}
      <SectionCard title="الأنظمة الحكومية المتكاملة" icon={Building2}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {govSystems.map(sys => (
            <div key={sys.name} className="p-3 rounded-xl bg-surface2/30 border border-border/20 hover:border-gold/15 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-foreground">{sys.name}</span>
                <span className={cn('w-2 h-2 rounded-full', `bg-${sys.color}`)} />
              </div>
              <p className="text-[9px] text-muted-foreground mb-1">{sys.desc}</p>
              <div className="flex items-center justify-between">
                <span className={cn('text-[8px]', `text-${sys.color}`)}>{sys.status}</span>
                <ExternalLink size={10} className="text-muted-foreground/50" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ─── Search & Filters ──────────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="بحث في التنبيهات..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 outline-none" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الخطورة</option>
              <option value="critical">حرج</option>
              <option value="high">عالي</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-surface2/50 border border-border/30 text-xs text-foreground outline-none">
              <option value="all">كل الحالات</option>
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Alerts List ───────────────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.map(alert => (
          <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className={cn('glass-card p-3 sm:p-4 transition-all', alert.severity === 'critical' ? 'border-danger/30' : alert.severity === 'high' ? 'border-warning/20' : '')}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  alert.severity === 'critical' ? 'bg-danger/10' : alert.severity === 'high' ? 'bg-warning/10' : 'bg-info/10')}>
                  <AlertTriangle size={16} className={alert.severity === 'critical' ? 'text-danger' : alert.severity === 'high' ? 'text-warning' : 'text-info'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-xs font-bold text-foreground">{alert.title}</h4>
                    <SeverityBadge severity={alert.severity} />
                    <span className={cn('text-[9px] px-2 py-0.5 rounded-full border', statusColors[alert.status])}>
                      {statusLabels[alert.status]}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1">{alert.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {alert.employee_name && (
                      <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Users size={10} /> {alert.employee_name}</span>
                    )}
                    <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Shield size={10} /> {alert.regulation}</span>
                    {alert.due_date && (
                      <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {formatDate(alert.due_date)}</span>
                    )}
                  </div>
                  <div className="mt-2 p-2 rounded-lg bg-gold/5 border border-gold/10">
                    <span className="text-[9px] text-gold flex items-center gap-1"><Zap size={10} /> الإجراء المطلوب: {alert.action_required}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-foreground"><Eye size={12} /></button>
                {alert.status !== 'compliant' && (
                  <button className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success"><CheckCircle2 size={12} /></button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Saudization Meter ─────────────────────────────────────────── */}
      <SectionCard title="مقياس نطاقات — توطين الوظائف" icon={TrendingUp}>
        <div className="p-4 rounded-xl bg-surface2/20 border border-border/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">نسبة السعودة الحالية</span>
            <span className="text-sm font-bold font-mono text-gold">{saudizationRate}%</span>
          </div>
          <div className="h-4 rounded-full bg-surface2/50 overflow-hidden relative">
            {/* Color zones */}
            <div className="absolute inset-0 flex">
              <div className="h-full bg-danger/20" style={{ width: '10%' }} />
              <div className="h-full bg-warning/20" style={{ width: '16%' }} />
              <div className="h-full bg-success/10" style={{ width: '14%' }} />
              <div className="h-full bg-success/15" style={{ width: '20%' }} />
              <div className="h-full bg-success/20" style={{ width: '20%' }} />
              <div className="h-full bg-emerald-500/20" style={{ width: '20%' }} />
            </div>
            <motion.div initial={{ width: 0 }} animate={{ width: `${saudizationRate}%` }} transition={{ duration: 1 }}
              className="h-full rounded-full bg-gradient-to-l from-gold to-gold/60 relative z-10" />
          </div>
          <div className="flex items-center justify-between mt-2 text-[8px] text-muted-foreground">
            <span>أحمر 0-9%</span>
            <span>أصفر 10-25%</span>
            <span>أخضر منخفض 26-39%</span>
            <span>أخضر متوسط 40-59%</span>
            <span>أخضر مرتفع 60-79%</span>
            <span>بلاتيني 80%+</span>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
