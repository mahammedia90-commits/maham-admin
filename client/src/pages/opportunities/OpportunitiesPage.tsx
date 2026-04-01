import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Plus, Search, Eye, Edit, Trash2, DollarSign,
  Calendar, Users, Target, BarChart3, CheckCircle, Clock,
  X, ArrowUpRight, Building2, Briefcase, Percent
} from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

interface Opportunity {
  id: number
  title: string
  description: string
  sector: string
  investment_min: number
  investment_max: number
  expected_roi: number
  duration_months: number
  status: 'open' | 'closing_soon' | 'closed' | 'draft'
  interested_count: number
  committed_amount: number
  target_amount: number
  event_name?: string
  created_at: string
  deadline: string
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: 1, title: 'رعاية حصرية — معرض التقنية 2026', description: 'فرصة رعاية حصرية للمسرح الرئيسي مع تغطية إعلامية كاملة وعرض تقديمي 45 دقيقة', sector: 'التقنية', investment_min: 300000, investment_max: 500000, expected_roi: 35, duration_months: 6, status: 'open', interested_count: 8, committed_amount: 300000, target_amount: 500000, event_name: 'معرض التقنية 2026', created_at: '2026-03-01', deadline: '2026-04-15' },
  { id: 2, title: 'شراكة استراتيجية — قطاع الصحة', description: 'شراكة طويلة الأمد لرعاية جميع فعاليات القطاع الصحي خلال 2026', sector: 'الصحة', investment_min: 500000, investment_max: 1000000, expected_roi: 28, duration_months: 12, status: 'open', interested_count: 5, committed_amount: 500000, target_amount: 1000000, created_at: '2026-02-15', deadline: '2026-04-30' },
  { id: 3, title: 'استثمار في منطقة F&B', description: 'تشغيل منطقة الأغذية والمشروبات في 3 فعاليات قادمة', sector: 'الأغذية', investment_min: 100000, investment_max: 200000, expected_roi: 45, duration_months: 4, status: 'closing_soon', interested_count: 12, committed_amount: 180000, target_amount: 200000, event_name: 'معرض التقنية 2026', created_at: '2026-03-10', deadline: '2026-04-05' },
  { id: 4, title: 'رعاية ذهبية — معرض الابتكار', description: 'حزمة رعاية ذهبية تشمل بوث 60م² وعرض تقديمي', sector: 'التقنية', investment_min: 150000, investment_max: 150000, expected_roi: 25, duration_months: 3, status: 'open', interested_count: 15, committed_amount: 450000, target_amount: 750000, event_name: 'معرض الابتكار 2026', created_at: '2026-03-20', deadline: '2026-05-01' },
  { id: 5, title: 'تطوير منصة التجارة الإلكترونية', description: 'استثمار في تطوير منصة تجارة إلكترونية متكاملة مع المعارض', sector: 'التقنية', investment_min: 200000, investment_max: 500000, expected_roi: 40, duration_months: 18, status: 'draft', interested_count: 0, committed_amount: 0, target_amount: 500000, created_at: '2026-03-25', deadline: '2026-06-01' },
  { id: 6, title: 'رعاية سلسلة ورش العمل', description: 'رعاية 10 ورش عمل متخصصة في الذكاء الاصطناعي', sector: 'التعليم', investment_min: 50000, investment_max: 100000, expected_roi: 20, duration_months: 6, status: 'closed', interested_count: 20, committed_amount: 100000, target_amount: 100000, created_at: '2026-01-15', deadline: '2026-03-01' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: 'مفتوحة', color: 'text-success' },
  closing_soon: { label: 'تنتهي قريباً', color: 'text-warning' },
  closed: { label: 'مغلقة', color: 'text-muted-foreground' },
  draft: { label: 'مسودة', color: 'text-info' },
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterSector, setFilterSector] = useState<string>('')
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)

  const sectors = Array.from(new Set(MOCK_OPPORTUNITIES.map(o => o.sector)))

  const filtered = MOCK_OPPORTUNITIES.filter(o => {
    if (search && !o.title.includes(search) && !o.description.includes(search)) return false
    if (filterStatus && o.status !== filterStatus) return false
    if (filterSector && o.sector !== filterSector) return false
    return true
  })

  const totalTarget = MOCK_OPPORTUNITIES.reduce((s, o) => s + o.target_amount, 0)
  const totalCommitted = MOCK_OPPORTUNITIES.reduce((s, o) => s + o.committed_amount, 0)

  return (
    <AdminLayout>
      <PageHeader
        title="الفرص الاستثمارية"
        subtitle="إدارة ونشر الفرص الاستثمارية للمستثمرين والرعاة"
        actions={
          <button onClick={() => toast.info('إنشاء فرصة — قريباً')} className="h-9 px-4 rounded-lg bg-gold/10 border border-gold/25 text-sm text-gold hover:bg-gold/20 transition-all flex items-center gap-2">
            <Plus size={14} />
            فرصة جديدة
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="إجمالي الفرص" value={MOCK_OPPORTUNITIES.length} icon={TrendingUp} delay={0} />
        <StatsCard title="المبلغ المستهدف" value={formatCurrency(totalTarget)} icon={Target} delay={0.1} />
        <StatsCard title="المبلغ الملتزم" value={formatCurrency(totalCommitted)} icon={DollarSign} delay={0.2} />
        <StatsCard title="المهتمون" value={MOCK_OPPORTUNITIES.reduce((s, o) => s + o.interested_count, 0)} icon={Users} delay={0.3} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في الفرص..." className="w-full h-9 pr-9 pl-3 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 transition-all" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل الحالات</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterSector} onChange={e => setFilterSector(e.target.value)} className="h-9 px-3 rounded-lg bg-surface border border-border text-xs text-foreground cursor-pointer focus:outline-none focus:border-gold/40">
          <option value="">كل القطاعات</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((opp, idx) => {
          const progress = Math.round((opp.committed_amount / opp.target_amount) * 100)
          const statusConf = STATUS_CONFIG[opp.status]
          return (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="glass-card p-5 hover:border-gold/20 transition-all cursor-pointer group"
              onClick={() => setSelectedOpp(opp)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full', statusConf.color, opp.status === 'open' ? 'bg-success/10' : opp.status === 'closing_soon' ? 'bg-warning/10' : opp.status === 'draft' ? 'bg-info/10' : 'bg-muted/10')}>
                      {statusConf.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{opp.sector}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground line-clamp-2">{opp.title}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={e => { e.stopPropagation(); toast.info('تعديل — قريباً') }} className="p-1.5 rounded-md hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Edit size={13} /></button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{opp.description}</p>

              {/* Investment Range */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">نطاق الاستثمار</span>
                <span className="text-sm font-bold text-gold font-mono">
                  {formatCurrency(opp.investment_min)}{opp.investment_min !== opp.investment_max ? ` — ${formatCurrency(opp.investment_max)}` : ''}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">التمويل</span>
                  <span className="text-[10px] font-medium text-foreground">{formatCurrency(opp.committed_amount)} / {formatCurrency(opp.target_amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-surface2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className={cn('h-full rounded-full', progress >= 90 ? 'bg-success' : progress >= 50 ? 'bg-gold' : 'bg-info')}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/30">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{opp.expected_roi}%</p>
                  <p className="text-[10px] text-muted-foreground">ROI متوقع</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{opp.duration_months}</p>
                  <p className="text-[10px] text-muted-foreground">شهر</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{opp.interested_count}</p>
                  <p className="text-[10px] text-muted-foreground">مهتم</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOpp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedOpp(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                <h3 className="text-lg font-bold text-foreground">تفاصيل الفرصة</h3>
                <button onClick={() => setSelectedOpp(null)} className="p-2 rounded-lg hover:bg-surface2 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <h4 className="text-base font-bold text-foreground">{selectedOpp.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedOpp.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">القطاع</p><p className="text-sm font-medium text-foreground">{selectedOpp.sector}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">المدة</p><p className="text-sm font-medium text-foreground">{selectedOpp.duration_months} شهر</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">ROI متوقع</p><p className="text-sm font-medium text-success">{selectedOpp.expected_roi}%</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الموعد النهائي</p><p className="text-sm font-medium text-foreground">{formatDate(selectedOpp.deadline)}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الحد الأدنى</p><p className="text-sm font-mono text-gold">{formatCurrency(selectedOpp.investment_min)}</p></div>
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الحد الأقصى</p><p className="text-sm font-mono text-gold">{formatCurrency(selectedOpp.investment_max)}</p></div>
                </div>
                {selectedOpp.event_name && (
                  <div className="glass-card p-3"><p className="text-[10px] text-muted-foreground">الفعالية المرتبطة</p><p className="text-sm text-foreground">{selectedOpp.event_name}</p></div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
