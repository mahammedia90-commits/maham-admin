/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة علاقات العملاء (CRM)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: Pipeline تفاعلي، بيانات عملاء، CRUD، تفاصيل، تصفية
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Target, Phone, Mail, Star, Plus,
  Eye, Edit, TrendingUp, UserCheck, Search,
  X, Building2, MapPin, Calendar, MessageSquare,
  ArrowRight, Trash2, AlertTriangle, Globe, Activity
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatNumber, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

interface Customer {
  id: number; name: string; company: string; email: string; phone: string
  stage: string; value: number; source: string; score: number; city: string
  lastContact: string; assignedTo: string; notes: string; tags: string[]
}

const pipelineStages = [
  { key: 'new', name: 'عملاء جدد', color: 'border-gold/30 bg-gold/5' },
  { key: 'contact', name: 'تواصل أولي', color: 'border-gold/25 bg-gold/3' },
  { key: 'quote', name: 'عرض سعر', color: 'border-chrome/30 bg-chrome/5' },
  { key: 'negotiation', name: 'تفاوض', color: 'border-info/25 bg-info/5' },
  { key: 'closed', name: 'إغلاق', color: 'border-success/25 bg-success/5' },
]

const demoCustomers: Customer[] = [
  { id: 1, name: 'عبدالله الفيصل', company: 'شركة الفيصل للتجارة', email: 'abdullah@alfaisal.sa', phone: '+966501234567', stage: 'negotiation', value: 450000, source: 'معرض سابق', score: 85, city: 'الرياض', lastContact: '2026-03-30', assignedTo: 'أحمد محمد', notes: 'مهتم بجناح مميز في معرض الرياض', tags: ['VIP', 'تاجر'] },
  { id: 2, name: 'سلطان المنصور', company: 'بنك الأهلي السعودي', email: 'sultan@alahli.sa', phone: '+966502345678', stage: 'quote', value: 800000, source: 'إحالة', score: 92, city: 'الرياض', lastContact: '2026-03-29', assignedTo: 'سارة العلي', notes: 'يبحث عن رعاية بلاتينية', tags: ['راعي', 'بنك'] },
  { id: 3, name: 'فهد الراجحي', company: 'مجموعة المراعي', email: 'fahad@almarai.sa', phone: '+966503456789', stage: 'closed', value: 320000, source: 'موقع إلكتروني', score: 95, city: 'الرياض', lastContact: '2026-03-28', assignedTo: 'خالد الحربي', notes: 'تم إغلاق الصفقة — 4 أجنحة', tags: ['تاجر', 'أغذية'] },
  { id: 4, name: 'ريم الغامدي', company: 'DHL السعودية', email: 'reem@dhl.sa', phone: '+966504567890', stage: 'contact', value: 180000, source: 'LinkedIn', score: 55, city: 'جدة', lastContact: '2026-03-25', assignedTo: 'فاطمة أحمد', notes: 'خدمات لوجستية للمعرض', tags: ['خدمات'] },
  { id: 5, name: 'نورة السبيعي', company: 'شركة الاتصالات STC', email: 'noura@stc.sa', phone: '+966505678901', stage: 'new', value: 500000, source: 'حملة إعلانية', score: 70, city: 'الرياض', lastContact: '2026-03-31', assignedTo: 'أحمد محمد', notes: 'مهتمة برعاية ذهبية', tags: ['راعي', 'اتصالات'] },
  { id: 6, name: 'خالد العتيبي', company: 'شركة أرامكو', email: 'khalid@aramco.sa', phone: '+966506789012', stage: 'new', value: 1200000, source: 'علاقات حكومية', score: 88, city: 'الظهران', lastContact: '2026-03-30', assignedTo: 'سارة العلي', notes: 'رعاية استراتيجية محتملة', tags: ['VIP', 'طاقة'] },
  { id: 7, name: 'ماجد الحربي', company: 'شركة سابك', email: 'majed@sabic.sa', phone: '+966507890123', stage: 'quote', value: 650000, source: 'معرض سابق', score: 78, city: 'الرياض', lastContact: '2026-03-27', assignedTo: 'خالد الحربي', notes: 'عرض سعر لرعاية فضية + جناح', tags: ['راعي', 'صناعة'] },
  { id: 8, name: 'هند المطيري', company: 'شركة نستله السعودية', email: 'hind@nestle.sa', phone: '+966508901234', stage: 'contact', value: 220000, source: 'موقع إلكتروني', score: 62, city: 'جدة', lastContact: '2026-03-26', assignedTo: 'فاطمة أحمد', notes: 'تواصل أولي — مهتمة بالمشاركة', tags: ['تاجر', 'أغذية'] },
  { id: 9, name: 'تركي الشمري', company: 'شركة المراكز العربية', email: 'turki@cenomi.sa', phone: '+966509012345', stage: 'negotiation', value: 380000, source: 'إحالة', score: 80, city: 'الرياض', lastContact: '2026-03-29', assignedTo: 'أحمد محمد', notes: 'تفاوض على 3 أجنحة + خدمات', tags: ['تاجر', 'تجزئة'] },
  { id: 10, name: 'دانة العمري', company: 'شركة الراجحي المالية', email: 'dana@alrajhi.sa', phone: '+966510123456', stage: 'new', value: 600000, source: 'حملة بريدية', score: 73, city: 'الرياض', lastContact: '2026-03-31', assignedTo: 'سارة العلي', notes: 'استفسار عن رعاية ذهبية', tags: ['راعي', 'مالية'] },
  { id: 11, name: 'عمر الزهراني', company: 'شركة بن داود القابضة', email: 'omar@bindawood.sa', phone: '+966511234567', stage: 'closed', value: 175000, source: 'معرض سابق', score: 90, city: 'جدة', lastContact: '2026-03-20', assignedTo: 'خالد الحربي', notes: 'تم الإغلاق — جناحين', tags: ['تاجر', 'تجزئة'] },
  { id: 12, name: 'لمى الدوسري', company: 'شركة زين السعودية', email: 'lama@zain.sa', phone: '+966512345678', stage: 'contact', value: 350000, source: 'LinkedIn', score: 65, city: 'الرياض', lastContact: '2026-03-28', assignedTo: 'فاطمة أحمد', notes: 'مهتمة بالرعاية الرقمية', tags: ['راعي', 'اتصالات'] },
]

const pieData = [
  { name: 'معرض سابق', value: 35, color: '#C9A84C' },
  { name: 'موقع إلكتروني', value: 25, color: '#3B82F6' },
  { name: 'إحالة', value: 20, color: '#10B981' },
  { name: 'حملة إعلانية', value: 12, color: '#A0A0A0' },
  { name: 'LinkedIn', value: 8, color: '#8B5CF6' },
]

export default function CrmPage() {
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline')
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState(demoCustomers)
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [stageFilter, setStageFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newCustomer, setNewCustomer] = useState({ name: '', company: '', email: '', phone: '', stage: 'new', value: '', source: 'موقع إلكتروني', city: 'الرياض', notes: '' })

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.stage !== 'closed').length,
    conversionRate: Math.round((customers.filter(c => c.stage === 'closed').length / customers.length) * 100),
    totalValue: customers.reduce((s, c) => s + c.value, 0),
  }), [customers])

  const filtered = useMemo(() => {
    let result = [...customers]
    if (stageFilter !== 'all') result = result.filter(c => c.stage === stageFilter)
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(c => c.name.includes(s) || c.company.includes(s) || c.email.includes(s))
    }
    return result
  }, [customers, stageFilter, search])

  const handleAdd = () => {
    if (!newCustomer.name || !newCustomer.company) { toast.error('يرجى ملء الحقول المطلوبة'); return }
    const c: Customer = {
      id: Math.max(...customers.map(c => c.id)) + 1,
      name: newCustomer.name, company: newCustomer.company, email: newCustomer.email, phone: newCustomer.phone,
      stage: newCustomer.stage, value: parseFloat(newCustomer.value) || 0, source: newCustomer.source,
      score: 50, city: newCustomer.city, lastContact: new Date().toISOString().split('T')[0],
      assignedTo: 'غير محدد', notes: newCustomer.notes, tags: [],
    }
    setCustomers(prev => [c, ...prev])
    toast.success(`تمت إضافة العميل: ${c.name}`)
    setShowAddModal(false)
    setNewCustomer({ name: '', company: '', email: '', phone: '', stage: 'new', value: '', source: 'موقع إلكتروني', city: 'الرياض', notes: '' })
  }

  const handleDelete = (id: number) => {
    const c = customers.find(c => c.id === id)
    setCustomers(prev => prev.filter(c => c.id !== id))
    toast.success(`تم حذف العميل: ${c?.name}`)
    setDeleteConfirm(null)
  }

  const moveStage = (id: number, direction: 'next' | 'prev') => {
    const stageKeys = pipelineStages.map(s => s.key)
    setCustomers(prev => prev.map(c => {
      if (c.id !== id) return c
      const idx = stageKeys.indexOf(c.stage)
      const newIdx = direction === 'next' ? Math.min(idx + 1, stageKeys.length - 1) : Math.max(idx - 1, 0)
      if (idx === newIdx) return c
      toast.info(`تم نقل ${c.name} إلى: ${pipelineStages[newIdx].name}`)
      return { ...c, stage: stageKeys[newIdx] }
    }))
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة علاقات العملاء"
        subtitle={`${stats.total} عميل — قيمة الفرص: ${(stats.totalValue / 1000000).toFixed(1)}M ر.س`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-surface2 rounded-xl p-0.5">
              <button onClick={() => setView('pipeline')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', view === 'pipeline' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>Pipeline</button>
              <button onClick={() => setView('table')} className={cn('h-8 px-3 rounded-lg text-xs font-medium transition-all', view === 'table' ? 'bg-gold/10 text-gold' : 'text-muted-foreground')}>جدول</button>
            </div>
            <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
              <Plus size={16} /> عميل جديد
            </button>
          </div>
        }
      />

      {/* إحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="إجمالي العملاء" value={formatNumber(stats.total)} icon={Users} trend={15} trendLabel="هذا الشهر" delay={0} />
        <StatsCard title="عملاء نشطون" value={formatNumber(stats.active)} icon={UserCheck} trend={8} trendLabel="هذا الأسبوع" delay={0.05} />
        <StatsCard title="معدل التحويل" value={`${stats.conversionRate}%`} icon={Target} trend={5} trendLabel="تحسن" delay={0.1} />
        <StatsCard title="قيمة الفرص" value={`${(stats.totalValue / 1000000).toFixed(1)}M`} icon={TrendingUp} trend={22} trendLabel="هذا الربع" delay={0.15} />
      </div>

      {view === 'pipeline' ? (
        <>
          {/* Pipeline View */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-5">
            {pipelineStages.map((stage, i) => {
              const stageCustomers = customers.filter(c => c.stage === stage.key)
              const stageValue = stageCustomers.reduce((s, c) => s + c.value, 0)
              return (
                <motion.div key={stage.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                  className={cn('glass-card p-3 border', stage.color)}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-foreground">{stage.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 text-muted-foreground">{stageCustomers.length}</span>
                  </div>
                  <p className="text-sm font-bold font-mono text-gold mb-3">{(stageValue / 1000).toFixed(0)}K <span className="text-[10px] text-muted-foreground font-normal">ر.س</span></p>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {stageCustomers.map((c) => (
                      <div key={c.id} onClick={() => setDetailCustomer(c)}
                        className="p-2.5 rounded-lg bg-surface2/50 border border-border/20 hover:border-gold/20 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground truncate">{c.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); moveStage(c.id, 'next') }} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-surface3 text-muted-foreground hover:text-gold transition-all" title="نقل للمرحلة التالية">
                            <ArrowRight size={10} />
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">{c.company}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] font-mono text-gold">{(c.value / 1000).toFixed(0)}K</span>
                          <div className="flex items-center gap-0.5">
                            <div className="w-10 h-1 rounded-full bg-surface3">
                              <div className={cn('h-full rounded-full', c.score >= 80 ? 'bg-success' : c.score >= 50 ? 'bg-warning' : 'bg-danger')} style={{ width: `${c.score}%` }} />
                            </div>
                            <span className="text-[9px] text-muted-foreground">{c.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* مصادر العملاء */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-3 sm:p-4 lg:p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">مصادر العملاء</h3>
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
                    <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-foreground"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />{d.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        /* Table View */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50 flex-wrap gap-3">
            <div className="relative w-64">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو الشركة..."
                className="w-full h-9 pr-10 pl-4 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
            </div>
            <div className="flex items-center gap-1.5">
              {[{ key: 'all', label: 'الكل' }, ...pipelineStages.map(s => ({ key: s.key, label: s.name }))].map(s => (
                <button key={s.key} onClick={() => setStageFilter(s.key)}
                  className={cn('h-7 px-2.5 rounded-lg text-[11px] font-medium transition-all', stageFilter === s.key ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">العميل</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">الشركة</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المرحلة</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">القيمة</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">التقييم</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground">المسؤول</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-16 text-center"><Users size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground text-sm">لا يوجد عملاء مطابقون</p></td></tr>
                ) : filtered.map((c, idx) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-surface2/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">{c.name.charAt(0)}</div>
                        <div><p className="text-sm font-medium text-foreground">{c.name}</p><p className="text-[10px] text-muted-foreground">{c.email}</p></div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.company}</td>
                    <td className="px-3 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full',
                        c.stage === 'new' ? 'bg-gold/10 text-gold' : c.stage === 'contact' ? 'bg-info/10 text-info' :
                        c.stage === 'quote' ? 'bg-chrome/10 text-chrome' : c.stage === 'negotiation' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      )}>{pipelineStages.find(s => s.key === c.stage)?.name}</span>
                    </td>
                    <td className="px-3 py-3"><span className="font-mono text-sm font-bold text-foreground">{(c.value / 1000).toFixed(0)}K</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 h-1.5 rounded-full bg-surface3"><div className={cn('h-full rounded-full', c.score >= 80 ? 'bg-success' : c.score >= 50 ? 'bg-warning' : 'bg-danger')} style={{ width: `${c.score}%` }} /></div>
                        <span className="text-[10px] font-mono text-muted-foreground">{c.score}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.assignedTo}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => setDetailCustomer(c)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                        <button onClick={() => toast.info(`جاري الاتصال بـ ${c.name}...`)} className="p-1.5 rounded-lg hover:bg-surface2 text-muted-foreground hover:text-info transition-colors"><Phone size={14} /></button>
                        <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* نافذة تفاصيل العميل */}
      <AnimatePresence>
        {detailCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailCustomer(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xl">{detailCustomer.name.charAt(0)}</div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{detailCustomer.name}</h2>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 size={10} />{detailCustomer.company}</p>
                    </div>
                  </div>
                  <button onClick={() => setDetailCustomer(null)} className="p-2 rounded-lg hover:bg-surface2 text-muted-foreground"><X size={18} /></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 sm:mb-4">
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">البريد</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><Mail size={11} className="text-gold" />{detailCustomer.email}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">الجوال</p>
                    <p className="text-xs text-foreground flex items-center gap-1" dir="ltr"><Phone size={11} className="text-gold" />{detailCustomer.phone}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">المدينة</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><MapPin size={11} className="text-gold" />{detailCustomer.city}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">المصدر</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><Globe size={11} className="text-gold" />{detailCustomer.source}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">آخر تواصل</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><Calendar size={11} className="text-gold" />{formatDate(detailCustomer.lastContact)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">المسؤول</p>
                    <p className="text-xs text-foreground">{detailCustomer.assignedTo}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gold/5 border border-gold/20 mb-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">قيمة الفرصة</p>
                    <p className="text-lg font-bold font-mono text-gold">{(detailCustomer.value / 1000).toFixed(0)}K <span className="text-xs">ر.س</span></p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground">تقييم العميل</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-2 rounded-full bg-surface3"><div className={cn('h-full rounded-full', detailCustomer.score >= 80 ? 'bg-success' : detailCustomer.score >= 50 ? 'bg-warning' : 'bg-danger')} style={{ width: `${detailCustomer.score}%` }} /></div>
                      <span className="text-sm font-bold text-foreground">{detailCustomer.score}%</span>
                    </div>
                  </div>
                </div>

                {detailCustomer.notes && (
                  <div className="p-3 rounded-xl bg-surface2/50 border border-border/30 mb-3">
                    <p className="text-[10px] text-muted-foreground mb-1">ملاحظات</p>
                    <p className="text-sm text-foreground">{detailCustomer.notes}</p>
                  </div>
                )}

                {detailCustomer.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    {detailCustomer.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/15">{t}</span>)}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button onClick={() => { moveStage(detailCustomer.id, 'next'); setDetailCustomer(null) }} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center justify-center gap-2">
                    <ArrowRight size={14} /> نقل للمرحلة التالية
                  </button>
                  <button onClick={() => { toast.info(`جاري إرسال بريد لـ ${detailCustomer.name}...`); setDetailCustomer(null) }} className="h-10 px-4 rounded-xl bg-surface2 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all flex items-center gap-2">
                    <Mail size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة إضافة عميل */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Plus size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">عميل جديد</h3><p className="text-xs text-muted-foreground">أدخل بيانات العميل المحتمل</p></div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الاسم <span className="text-danger">*</span></label><input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer(p => ({ ...p, name: e.target.value }))} placeholder="اسم العميل" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الشركة <span className="text-danger">*</span></label><input type="text" value={newCustomer.company} onChange={(e) => setNewCustomer(p => ({ ...p, company: e.target.value }))} placeholder="اسم الشركة" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">البريد</label><input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer(p => ({ ...p, email: e.target.value }))} placeholder="email@company.sa" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الجوال</label><input type="text" value={newCustomer.phone} onChange={(e) => setNewCustomer(p => ({ ...p, phone: e.target.value }))} placeholder="+966500000000" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القيمة (ر.س)</label><input type="number" value={newCustomer.value} onChange={(e) => setNewCustomer(p => ({ ...p, value: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المصدر</label><select value={newCustomer.source} onChange={(e) => setNewCustomer(p => ({ ...p, source: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option>موقع إلكتروني</option><option>معرض سابق</option><option>إحالة</option><option>حملة إعلانية</option><option>LinkedIn</option></select></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">ملاحظات</label><textarea value={newCustomer.notes} onChange={(e) => setNewCustomer(p => ({ ...p, notes: e.target.value }))} placeholder="ملاحظات..." rows={2} className="w-full p-3 rounded-lg bg-surface2 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" /></div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إضافة العميل</button>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-4 sm:p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-danger" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف العميل</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{customers.find(c => c.id === deleteConfirm)?.name}</span>؟</p>
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
