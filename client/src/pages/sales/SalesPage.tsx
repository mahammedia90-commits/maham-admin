/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — المبيعات (Sales Management)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: صفقات، أداء مندوبين، رسوم بيانية، CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, TrendingUp, DollarSign, Target, Users, Plus,
  ArrowUpRight, BarChart3, Briefcase, Award, Clock,
  Eye, Edit, Trash2, X, AlertTriangle, Phone, Mail,
  CheckCircle, XCircle, ArrowRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import { toast } from 'sonner'

interface Deal {
  id: number; name: string; client: string; value: number; stage: string
  probability: number; rep: string; daysOpen: number; nextAction: string; closeDate: string
}

interface SalesRep {
  id: number; name: string; deals: number; closedValue: number; target: number; winRate: number; avatar: string
}

const salesData = [
  { month: 'يناير', booths: 120000, sponsorships: 80000, services: 40000 },
  { month: 'فبراير', booths: 150000, sponsorships: 95000, services: 55000 },
  { month: 'مارس', booths: 200000, sponsorships: 120000, services: 70000 },
  { month: 'أبريل', booths: 180000, sponsorships: 110000, services: 65000 },
  { month: 'مايو', booths: 250000, sponsorships: 150000, services: 85000 },
  { month: 'يونيو', booths: 320000, sponsorships: 180000, services: 95000 },
]

const demoDeals: Deal[] = [
  { id: 1, name: 'صفقة شركة الفيصل', client: 'شركة الفيصل للتجارة', value: 450000, stage: 'تفاوض', probability: 75, rep: 'أحمد محمد', daysOpen: 12, nextAction: 'اجتماع متابعة', closeDate: '2026-04-15' },
  { id: 2, name: 'رعاية بنك الأهلي', client: 'بنك الأهلي السعودي', value: 800000, stage: 'عرض سعر', probability: 60, rep: 'سارة العلي', daysOpen: 5, nextAction: 'إرسال العرض النهائي', closeDate: '2026-04-20' },
  { id: 3, name: 'حجز أجنحة المراعي', client: 'مجموعة المراعي', value: 320000, stage: 'إغلاق', probability: 95, rep: 'خالد الحربي', daysOpen: 2, nextAction: 'توقيع العقد', closeDate: '2026-04-05' },
  { id: 4, name: 'خدمات DHL', client: 'DHL السعودية', value: 180000, stage: 'تواصل', probability: 40, rep: 'فاطمة أحمد', daysOpen: 20, nextAction: 'عرض تقديمي', closeDate: '2026-05-01' },
  { id: 5, name: 'رعاية STC', client: 'شركة الاتصالات STC', value: 500000, stage: 'تفاوض', probability: 70, rep: 'أحمد محمد', daysOpen: 8, nextAction: 'مراجعة الشروط', closeDate: '2026-04-25' },
  { id: 6, name: 'رعاية أرامكو', client: 'شركة أرامكو', value: 1200000, stage: 'عرض سعر', probability: 55, rep: 'سارة العلي', daysOpen: 15, nextAction: 'عرض مخصص', closeDate: '2026-05-15' },
  { id: 7, name: 'أجنحة سابك', client: 'شركة سابك', value: 650000, stage: 'تواصل', probability: 45, rep: 'خالد الحربي', daysOpen: 7, nextAction: 'اجتماع أولي', closeDate: '2026-05-10' },
  { id: 8, name: 'حجز نستله', client: 'نستله السعودية', value: 220000, stage: 'إغلاق', probability: 90, rep: 'فاطمة أحمد', daysOpen: 3, nextAction: 'تأكيد الدفع', closeDate: '2026-04-08' },
]

const salesReps: SalesRep[] = [
  { id: 1, name: 'أحمد محمد', deals: 15, closedValue: 1850000, target: 2500000, winRate: 72, avatar: 'أ' },
  { id: 2, name: 'سارة العلي', deals: 12, closedValue: 2100000, target: 2500000, winRate: 78, avatar: 'س' },
  { id: 3, name: 'خالد الحربي', deals: 18, closedValue: 1620000, target: 2000000, winRate: 65, avatar: 'خ' },
  { id: 4, name: 'فاطمة أحمد', deals: 10, closedValue: 980000, target: 1500000, winRate: 58, avatar: 'ف' },
]

const stageColors: Record<string, string> = {
  'تواصل': 'bg-info/10 text-info', 'عرض سعر': 'bg-chrome/10 text-chrome',
  'تفاوض': 'bg-warning/10 text-warning', 'إغلاق': 'bg-success/10 text-success',
}

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState('deals')
  const [deals, setDeals] = useState(demoDeals)
  const [detailDeal, setDetailDeal] = useState<Deal | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newDeal, setNewDeal] = useState({ name: '', client: '', value: '', stage: 'تواصل', rep: 'أحمد محمد', nextAction: '' })

  const stats = useMemo(() => ({
    totalPipeline: deals.reduce((s, d) => s + d.value, 0),
    weightedPipeline: deals.reduce((s, d) => s + (d.value * d.probability / 100), 0),
    avgDealSize: Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length),
    closingDeals: deals.filter(d => d.stage === 'إغلاق').length,
  }), [deals])

  const handleAdd = () => {
    if (!newDeal.name || !newDeal.client || !newDeal.value) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    const d: Deal = {
      id: Math.max(...deals.map(d => d.id)) + 1, name: newDeal.name, client: newDeal.client,
      value: parseFloat(newDeal.value), stage: newDeal.stage, probability: newDeal.stage === 'تواصل' ? 30 : newDeal.stage === 'عرض سعر' ? 50 : newDeal.stage === 'تفاوض' ? 70 : 90,
      rep: newDeal.rep, daysOpen: 0, nextAction: newDeal.nextAction || 'تحديد الخطوة التالية', closeDate: '2026-05-01',
    }
    setDeals(prev => [d, ...prev])
    toast.success(`تم إنشاء الصفقة: ${d.name}`)
    setShowAddModal(false)
    setNewDeal({ name: '', client: '', value: '', stage: 'تواصل', rep: 'أحمد محمد', nextAction: '' })
  }

  const handleDelete = (id: number) => {
    const d = deals.find(d => d.id === id)
    setDeals(prev => prev.filter(d => d.id !== id))
    toast.success(`تم حذف الصفقة: ${d?.name}`)
    setDeleteConfirm(null)
  }

  const advanceStage = (id: number) => {
    const stages = ['تواصل', 'عرض سعر', 'تفاوض', 'إغلاق']
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d
      const idx = stages.indexOf(d.stage)
      if (idx >= stages.length - 1) return d
      const newStage = stages[idx + 1]
      toast.info(`تم نقل "${d.name}" إلى: ${newStage}`)
      return { ...d, stage: newStage, probability: newStage === 'عرض سعر' ? 50 : newStage === 'تفاوض' ? 70 : 90 }
    }))
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة المبيعات"
        subtitle={`${deals.length} صفقة — قيمة الأنبوب: ${formatCurrency(stats.totalPipeline)}`}
        actions={
          <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} /> صفقة جديدة
          </button>
        }
      />

      {/* إحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatsCard title="قيمة الأنبوب" value={formatCurrency(stats.totalPipeline)} icon={DollarSign} trend={22} trendLabel="هذا الربع" delay={0} />
        <StatsCard title="القيمة المرجحة" value={formatCurrency(stats.weightedPipeline)} icon={Target} delay={0.05} />
        <StatsCard title="متوسط الصفقة" value={formatCurrency(stats.avgDealSize)} icon={BarChart3} delay={0.1} />
        <StatsCard title="قيد الإغلاق" value={String(stats.closingDeals)} icon={CheckCircle} delay={0.15} />
      </div>

      {/* تبويبات */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { key: 'deals', label: 'الصفقات', icon: Briefcase },
          { key: 'reps', label: 'المندوبون', icon: Users },
          { key: 'analytics', label: 'التحليلات', icon: BarChart3 },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('h-9 px-4 rounded-xl text-sm font-medium transition-all flex items-center gap-2', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-surface2/50 text-muted-foreground hover:text-foreground border border-transparent')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* الصفقات */}
      {activeTab === 'deals' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">الصفقة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">القيمة</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المرحلة</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">الاحتمالية</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المندوب</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الأيام</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
              </tr></thead>
              <tbody>
                {deals.map((deal, idx) => (
                  <motion.tr key={deal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3">
                      <div><p className="text-sm font-medium text-foreground">{deal.name}</p><p className="text-[10px] text-muted-foreground">{deal.client}</p></div>
                    </td>
                    <td className="px-3 py-3"><span className="font-mono text-sm font-bold text-foreground">{formatCurrency(deal.value)}</span></td>
                    <td className="px-3 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', stageColors[deal.stage])}>{deal.stage}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', deal.probability >= 80 ? 'bg-success' : deal.probability >= 50 ? 'bg-warning' : 'bg-danger')} style={{ width: `${deal.probability}%` }} /></div>
                        <span className="text-[10px] font-mono text-muted-foreground">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{deal.rep}</td>
                    <td className="px-3 py-3"><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={10} />{deal.daysOpen} يوم</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => setDetailDeal(deal)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                        <button onClick={() => advanceStage(deal.id)} className="p-1.5 rounded-lg hover:bg-success/10 text-muted-foreground hover:text-success transition-colors" title="نقل للمرحلة التالية"><ArrowRight size={14} /></button>
                        <button onClick={() => setDeleteConfirm(deal.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* المندوبون */}
      {activeTab === 'reps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {salesReps.map((rep, i) => {
            const targetPct = Math.round((rep.closedValue / rep.target) * 100)
            return (
              <motion.div key={rep.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-lg">{rep.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground">{rep.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{rep.deals} صفقة نشطة</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground">معدل الفوز</p>
                    <p className={cn('text-lg font-bold font-mono', rep.winRate >= 70 ? 'text-success' : rep.winRate >= 50 ? 'text-warning' : 'text-danger')}>{rep.winRate}%</p>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>المحقق: {formatCurrency(rep.closedValue)}</span>
                    <span>الهدف: {formatCurrency(rep.target)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface3">
                    <div className={cn('h-full rounded-full transition-all', targetPct >= 80 ? 'bg-success' : targetPct >= 50 ? 'bg-gold' : 'bg-danger')} style={{ width: `${Math.min(targetPct, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{targetPct}% من الهدف</p>
                </div>
                {i === 0 && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/15"><Award size={9} />أفضل أداء</span>}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* التحليلات */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">المبيعات حسب الفئة — آخر 6 أشهر</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="booths" name="أجنحة" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sponsorships" name="رعايات" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="services" name="خدمات" fill="#A0A0A0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* نافذة تفاصيل الصفقة */}
      <AnimatePresence>
        {detailDeal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailDeal(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <div><h2 className="text-lg font-bold text-foreground">{detailDeal.name}</h2><p className="text-xs text-muted-foreground">{detailDeal.client}</p></div>
                <button onClick={() => setDetailDeal(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20"><p className="text-[10px] text-muted-foreground">القيمة</p><p className="text-lg font-bold font-mono text-gold">{formatCurrency(detailDeal.value)}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الاحتمالية</p><p className="text-lg font-bold font-mono text-foreground">{detailDeal.probability}%</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">المرحلة</p><p className={cn('text-sm font-bold', stageColors[detailDeal.stage]?.split(' ')[1])}>{detailDeal.stage}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">المندوب</p><p className="text-sm text-foreground">{detailDeal.rep}</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">الأيام المفتوحة</p><p className="text-sm text-foreground">{detailDeal.daysOpen} يوم</p></div>
                <div className="p-3 rounded-xl bg-surface2/50 border border-border/30"><p className="text-[10px] text-muted-foreground">تاريخ الإغلاق المتوقع</p><p className="text-sm text-foreground">{detailDeal.closeDate}</p></div>
              </div>
              <div className="p-3 rounded-xl bg-surface2/50 border border-border/30 mb-4">
                <p className="text-[10px] text-muted-foreground mb-1">الخطوة التالية</p>
                <p className="text-sm text-foreground">{detailDeal.nextAction}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { advanceStage(detailDeal.id); setDetailDeal(null) }} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center justify-center gap-2"><ArrowRight size={14} /> نقل للمرحلة التالية</button>
                <button onClick={() => setDetailDeal(null)} className="h-10 px-4 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إغلاق</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة صفقة جديدة */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Briefcase size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">صفقة جديدة</h3><p className="text-xs text-muted-foreground">إنشاء صفقة مبيعات جديدة</p></div>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">اسم الصفقة <span className="text-danger">*</span></label><input type="text" value={newDeal.name} onChange={(e) => setNewDeal(p => ({ ...p, name: e.target.value }))} placeholder="اسم الصفقة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">العميل <span className="text-danger">*</span></label><input type="text" value={newDeal.client} onChange={(e) => setNewDeal(p => ({ ...p, client: e.target.value }))} placeholder="اسم العميل/الشركة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القيمة (ر.س) <span className="text-danger">*</span></label><input type="number" value={newDeal.value} onChange={(e) => setNewDeal(p => ({ ...p, value: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المرحلة</label><select value={newDeal.stage} onChange={(e) => setNewDeal(p => ({ ...p, stage: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option>تواصل</option><option>عرض سعر</option><option>تفاوض</option><option>إغلاق</option></select></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المندوب</label><select value={newDeal.rep} onChange={(e) => setNewDeal(p => ({ ...p, rep: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50">{salesReps.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}</select></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الخطوة التالية</label><input type="text" value={newDeal.nextAction} onChange={(e) => setNewDeal(p => ({ ...p, nextAction: e.target.value }))} placeholder="مثال: اجتماع متابعة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إنشاء الصفقة</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تأكيد الحذف */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف الصفقة</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{deals.find(d => d.id === deleteConfirm)?.name}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm hover:bg-danger/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
