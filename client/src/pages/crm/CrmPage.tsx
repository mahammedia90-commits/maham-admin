/**
 * ═══════════════════════════════════════════════════════
 * Nour Theme — إدارة علاقات العملاء (CRM)
 * Design: Dark/Light glassmorphism, Gold accents, RTL-first
 * Features: Pipeline Kanban, Lead Scoring, HubSpot, Activities, CRUD
 * ═══════════════════════════════════════════════════════
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Target, Phone, Mail, Star, Plus,
  Eye, Edit, TrendingUp, UserCheck, Search,
  X, Building2, MapPin, Calendar, MessageSquare,
  ArrowRight, Trash2, AlertTriangle, Globe, Activity,
  BarChart3, Zap, RefreshCw, Clock, CheckCircle,
  ArrowUpRight, Filter, Download, Link2, Layers,
  DollarSign, Crown, Flame, Award, FileText
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatNumber, formatDate, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
interface Customer {
  id: number; name: string; company: string; email: string; phone: string
  stage: string; value: number; source: string; score: number; city: string
  lastContact: string; assignedTo: string; notes: string; tags: string[]
}

interface ActivityItem {
  id: number; type: 'call' | 'email' | 'meeting' | 'note' | 'deal'; desc: string
  customer: string; user: string; date: string; outcome?: string
}

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
const tabs = [
  { key: 'pipeline', label: 'Pipeline', icon: Layers },
  { key: 'table', label: 'جدول العملاء', icon: Users },
  { key: 'scoring', label: 'Lead Scoring', icon: Target },
  { key: 'activities', label: 'النشاطات', icon: Activity },
  { key: 'hubspot', label: 'HubSpot', icon: Link2 },
  { key: 'analytics', label: 'التحليلات', icon: BarChart3 },
]

const pipelineStages = [
  { key: 'new', name: 'عملاء جدد', color: 'border-gold/30 bg-gold/5' },
  { key: 'contact', name: 'تواصل أولي', color: 'border-blue-500/25 bg-blue-500/5' },
  { key: 'quote', name: 'عرض سعر', color: 'border-purple-500/25 bg-purple-500/5' },
  { key: 'negotiation', name: 'تفاوض', color: 'border-amber-500/25 bg-amber-500/5' },
  { key: 'closed', name: 'إغلاق', color: 'border-emerald-500/25 bg-emerald-500/5' },
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

const activitiesData: ActivityItem[] = [
  { id: 1, type: 'call', desc: 'مكالمة متابعة — مناقشة تفاصيل الرعاية البلاتينية', customer: 'سلطان المنصور', user: 'سارة العلي', date: '2026-03-31 14:30', outcome: 'إيجابي — سيرسل الموافقة خلال 48 ساعة' },
  { id: 2, type: 'email', desc: 'إرسال عرض سعر مخصص — رعاية فضية + جناح مميز', customer: 'ماجد الحربي', user: 'خالد الحربي', date: '2026-03-31 11:15', outcome: 'تم الإرسال — بانتظار الرد' },
  { id: 3, type: 'meeting', desc: 'اجتماع تعريفي — عرض خدمات ماهم إكسبو', customer: 'خالد العتيبي', user: 'سارة العلي', date: '2026-03-30 10:00', outcome: 'ممتاز — مهتم برعاية استراتيجية 1.2M' },
  { id: 4, type: 'deal', desc: 'إغلاق صفقة — 4 أجنحة في معرض الأغذية الدولي', customer: 'فهد الراجحي', user: 'خالد الحربي', date: '2026-03-28 16:45', outcome: 'تم الإغلاق — 320,000 ر.س' },
  { id: 5, type: 'note', desc: 'ملاحظة داخلية — العميل يفضل التواصل عبر WhatsApp', customer: 'ريم الغامدي', user: 'فاطمة أحمد', date: '2026-03-28 09:30' },
  { id: 6, type: 'call', desc: 'مكالمة أولى — تعريف بخدمات المعارض', customer: 'نورة السبيعي', user: 'أحمد محمد', date: '2026-03-31 09:00', outcome: 'مهتمة — طلبت عرض سعر' },
  { id: 7, type: 'email', desc: 'متابعة — إرسال كتيب المعرض + خريطة الأجنحة', customer: 'هند المطيري', user: 'فاطمة أحمد', date: '2026-03-27 15:20', outcome: 'تم الإرسال' },
  { id: 8, type: 'meeting', desc: 'اجتماع تفاوض — مناقشة الأسعار والخدمات الإضافية', customer: 'تركي الشمري', user: 'أحمد محمد', date: '2026-03-29 13:00', outcome: 'تفاوض مستمر — خصم 8% مقترح' },
]

const conversionFunnel = [
  { stage: 'زوار الموقع', count: 12500, color: '#C9A84C' },
  { stage: 'استفسارات', count: 3200, color: '#D4B96E' },
  { stage: 'عملاء محتملين', count: 850, color: '#3B82F6' },
  { stage: 'عروض سعر', count: 320, color: '#8B5CF6' },
  { stage: 'تفاوض', count: 145, color: '#F59E0B' },
  { stage: 'إغلاق', count: 67, color: '#10B981' },
]

const monthlyDeals = [
  { month: 'يناير', deals: 5, value: 1200000 },
  { month: 'فبراير', deals: 8, value: 2100000 },
  { month: 'مارس', deals: 12, value: 3400000 },
  { month: 'أبريل', deals: 7, value: 1800000 },
  { month: 'مايو', deals: 15, value: 4200000 },
  { month: 'يونيو', deals: 10, value: 2800000 },
]

const hubspotSync = {
  lastSync: '2026-03-31 16:45',
  status: 'متصل',
  contactsSynced: 154,
  dealsSynced: 67,
  activitiesSynced: 342,
  errors: 0,
  syncHistory: [
    { date: '2026-03-31 16:45', type: 'تلقائي', contacts: 3, deals: 1, status: 'نجح' },
    { date: '2026-03-31 12:00', type: 'تلقائي', contacts: 0, deals: 2, status: 'نجح' },
    { date: '2026-03-30 16:45', type: 'يدوي', contacts: 12, deals: 5, status: 'نجح' },
    { date: '2026-03-30 08:00', type: 'تلقائي', contacts: 1, deals: 0, status: 'نجح' },
    { date: '2026-03-29 16:45', type: 'تلقائي', contacts: 5, deals: 3, status: 'خطأ جزئي' },
  ],
  mappings: [
    { hubspot: 'Contact Name', maham: 'اسم العميل', status: 'active' },
    { hubspot: 'Company', maham: 'الشركة', status: 'active' },
    { hubspot: 'Deal Amount', maham: 'قيمة الفرصة', status: 'active' },
    { hubspot: 'Deal Stage', maham: 'مرحلة Pipeline', status: 'active' },
    { hubspot: 'Lead Score', maham: 'تقييم العميل', status: 'active' },
    { hubspot: 'Last Activity', maham: 'آخر نشاط', status: 'active' },
    { hubspot: 'Owner', maham: 'المسؤول', status: 'active' },
    { hubspot: 'Tags', maham: 'التصنيفات', status: 'inactive' },
  ]
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export default function CrmPage() {
  const [activeTab, setActiveTab] = useState('pipeline')
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

  const activityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone size={14} className="text-blue-400" />
      case 'email': return <Mail size={14} className="text-purple-400" />
      case 'meeting': return <Users size={14} className="text-gold" />
      case 'deal': return <CheckCircle size={14} className="text-emerald-400" />
      default: return <FileText size={14} className="text-muted-foreground" />
    }
  }

  return (
    <AdminLayout>
      <PageHeader
        title="إدارة علاقات العملاء"
        subtitle={`${stats.total} عميل — قيمة الفرص: ${(stats.totalValue / 1000000).toFixed(1)}M ر.س`}
        actions={
          <button onClick={() => setShowAddModal(true)} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2">
            <Plus size={16} /> عميل جديد
          </button>
        }
      />

      {/* إحصائيات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <StatsCard title="إجمالي العملاء" value={formatNumber(stats.total)} icon={Users} trend={15} trendLabel="هذا الشهر" delay={0} />
        <StatsCard title="عملاء نشطون" value={formatNumber(stats.active)} icon={UserCheck} trend={8} trendLabel="هذا الأسبوع" delay={0.05} />
        <StatsCard title="معدل التحويل" value={`${stats.conversionRate}%`} icon={Target} trend={5} trendLabel="تحسن" delay={0.1} />
        <StatsCard title="قيمة الفرص" value={`${(stats.totalValue / 1000000).toFixed(1)}M`} icon={TrendingUp} trend={22} trendLabel="هذا الربع" delay={0.15} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground hover:bg-card/50')}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {/* ═══════════════════════ PIPELINE TAB ═══════════════════════ */}
          {activeTab === 'pipeline' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-5">
                {pipelineStages.map((stage, i) => {
                  const stageCustomers = customers.filter(c => c.stage === stage.key)
                  const stageValue = stageCustomers.reduce((s, c) => s + c.value, 0)
                  return (
                    <motion.div key={stage.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                      className={cn('glass-card p-3 border rounded-xl', stage.color)}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-foreground">{stage.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-card/50 text-muted-foreground">{stageCustomers.length}</span>
                      </div>
                      <p className="text-sm font-bold font-mono text-gold mb-3">{(stageValue / 1000).toFixed(0)}K <span className="text-[10px] text-muted-foreground font-normal">ر.س</span></p>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {stageCustomers.map((c) => (
                          <div key={c.id} onClick={() => setDetailCustomer(c)}
                            className="p-2.5 rounded-lg bg-card/30 border border-border/20 hover:border-gold/20 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-foreground truncate">{c.name}</span>
                              <button onClick={(e) => { e.stopPropagation(); moveStage(c.id, 'next') }} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-card/50 text-muted-foreground hover:text-gold transition-all" title="نقل للمرحلة التالية">
                                <ArrowRight size={10} />
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{c.company}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] font-mono text-gold">{(c.value / 1000).toFixed(0)}K</span>
                              <div className="flex items-center gap-0.5">
                                <div className="w-10 h-1 rounded-full bg-card/50">
                                  <div className={cn('h-full rounded-full', c.score >= 80 ? 'bg-emerald-400' : c.score >= 50 ? 'bg-amber-400' : 'bg-red-400')} style={{ width: `${c.score}%` }} />
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
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4 rounded-xl border border-gold/10">
                <h3 className="text-sm font-bold text-foreground mb-3">مصادر العملاء</h3>
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie>
                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', color: 'var(--card-foreground)' }} />
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
          )}

          {/* ═══════════════════════ TABLE TAB ═══════════════════════ */}
          {activeTab === 'table' && (
            <div className="glass-card overflow-hidden rounded-xl border border-gold/10">
              <div className="flex items-center justify-between p-4 border-b border-border/50 flex-wrap gap-3">
                <div className="relative w-64">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو الشركة..."
                    className="w-full h-9 pr-10 pl-4 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" />
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
                      <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="border-b border-border/30 hover:bg-card/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">{c.name.charAt(0)}</div>
                            <div><p className="text-sm font-medium text-foreground">{c.name}</p><p className="text-[10px] text-muted-foreground">{c.email}</p></div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{c.company}</td>
                        <td className="px-3 py-3">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full',
                            c.stage === 'new' ? 'bg-gold/10 text-gold' : c.stage === 'contact' ? 'bg-blue-500/10 text-blue-400' :
                            c.stage === 'quote' ? 'bg-purple-500/10 text-purple-400' : c.stage === 'negotiation' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                          )}>{pipelineStages.find(s => s.key === c.stage)?.name}</span>
                        </td>
                        <td className="px-3 py-3"><span className="font-mono text-sm font-bold text-foreground">{(c.value / 1000).toFixed(0)}K</span></td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-12 h-1.5 rounded-full bg-card/50"><div className={cn('h-full rounded-full', c.score >= 80 ? 'bg-emerald-400' : c.score >= 50 ? 'bg-amber-400' : 'bg-red-400')} style={{ width: `${c.score}%` }} /></div>
                            <span className="text-[10px] font-mono text-muted-foreground">{c.score}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{c.assignedTo}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-0.5">
                            <button onClick={() => setDetailCustomer(c)} className="p-1.5 rounded-lg hover:bg-card/50 text-muted-foreground hover:text-gold transition-colors"><Eye size={14} /></button>
                            <button onClick={() => toast.info(`جاري الاتصال بـ ${c.name}...`)} className="p-1.5 rounded-lg hover:bg-card/50 text-muted-foreground hover:text-blue-400 transition-colors"><Phone size={14} /></button>
                            <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════ LEAD SCORING TAB ═══════════════════════ */}
          {activeTab === 'scoring' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatsCard title="عملاء VIP" value="3" icon={Crown} delay={0} />
                <StatsCard title="متوسط التقييم" value="78.6" icon={Target} trend={5} delay={0.1} />
                <StatsCard title="ساخن (فوق 85)" value="5" icon={Flame} delay={0.2} />
                <StatsCard title="يحتاج متابعة" value="4" icon={AlertTriangle} delay={0.3} />
              </div>
              <div className="glass-card rounded-xl border border-gold/10 overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-sm font-bold text-foreground">تقييم العملاء المحتملين — Lead Scoring</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">تقييم تلقائي بالذكاء الاصطناعي بناءً على: حجم الشركة، القطاع، التفاعل، القيمة المحتملة</p>
                </div>
                <div className="divide-y divide-border/30">
                  {[...customers].sort((a, b) => b.score - a.score).map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-4 p-4 hover:bg-card/30 transition-colors">
                      <div className="text-center w-8">
                        <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                      </div>
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold', c.score >= 90 ? 'bg-gold/15 text-gold border border-gold/20' : c.score >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : c.score >= 60 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20')}>
                        {c.score}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">{c.name}</p>
                          {c.tags.includes('VIP') && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold">VIP</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">{c.company} — {c.city}</p>
                      </div>
                      <div className="text-left w-24">
                        <p className="text-sm font-bold font-mono text-foreground">{formatCurrency(c.value)}</p>
                        <p className="text-[10px] text-muted-foreground">{pipelineStages.find(s => s.key === c.stage)?.name}</p>
                      </div>
                      <div className="w-32">
                        <div className="h-2 bg-card/50 rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full transition-all', c.score >= 90 ? 'bg-gold' : c.score >= 80 ? 'bg-emerald-400' : c.score >= 60 ? 'bg-amber-400' : 'bg-red-400')} style={{ width: `${c.score}%` }} />
                        </div>
                        <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
                          <span>{c.score >= 80 ? 'ساخن' : c.score >= 60 ? 'دافئ' : 'بارد'}</span>
                          <span>{c.source}</span>
                        </div>
                      </div>
                      <button onClick={() => setDetailCustomer(c)} className="p-2 rounded-lg hover:bg-card/50 text-muted-foreground hover:text-gold transition-colors">
                        <Eye size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════ ACTIVITIES TAB ═══════════════════════ */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatsCard title="نشاطات اليوم" value="12" icon={Activity} delay={0} />
                <StatsCard title="مكالمات" value="5" icon={Phone} delay={0.1} />
                <StatsCard title="اجتماعات" value="3" icon={Users} delay={0.2} />
                <StatsCard title="صفقات مغلقة" value="2" icon={CheckCircle} delay={0.3} />
              </div>
              <div className="glass-card rounded-xl border border-gold/10">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">سجل النشاطات</h3>
                  <button onClick={() => toast.info('إضافة نشاط — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 text-gold text-xs font-medium border border-gold/20 hover:bg-gold/20 transition-all flex items-center gap-1.5">
                    <Plus size={12} /> نشاط جديد
                  </button>
                </div>
                <div className="divide-y divide-border/30">
                  {activitiesData.map((act, i) => (
                    <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-start gap-4 p-4 hover:bg-card/30 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-card/50 border border-border/30 flex items-center justify-center mt-0.5">
                        {activityIcon(act.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{act.desc}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Users size={10} />{act.customer}</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{act.date}</span>
                          <span>{act.user}</span>
                        </div>
                        {act.outcome && (
                          <p className="text-[11px] text-gold mt-1 flex items-center gap-1"><ArrowUpRight size={10} />{act.outcome}</p>
                        )}
                      </div>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap',
                        act.type === 'call' ? 'bg-blue-500/10 text-blue-400' :
                        act.type === 'email' ? 'bg-purple-500/10 text-purple-400' :
                        act.type === 'meeting' ? 'bg-gold/10 text-gold' :
                        act.type === 'deal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-card/50 text-muted-foreground'
                      )}>{act.type === 'call' ? 'مكالمة' : act.type === 'email' ? 'بريد' : act.type === 'meeting' ? 'اجتماع' : act.type === 'deal' ? 'صفقة' : 'ملاحظة'}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════ HUBSPOT TAB ═══════════════════════ */}
          {activeTab === 'hubspot' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatsCard title="جهات اتصال" value={formatNumber(hubspotSync.contactsSynced)} icon={Users} delay={0} />
                <StatsCard title="صفقات" value={formatNumber(hubspotSync.dealsSynced)} icon={DollarSign} delay={0.1} />
                <StatsCard title="نشاطات" value={formatNumber(hubspotSync.activitiesSynced)} icon={Activity} delay={0.2} />
                <StatsCard title="أخطاء" value={formatNumber(hubspotSync.errors)} icon={AlertTriangle} delay={0.3} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* حالة الاتصال */}
                <div className="glass-card rounded-xl border border-gold/10 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-foreground">حالة تكامل HubSpot</h3>
                    <span className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {hubspotSync.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-card/30 border border-border/20">
                      <p className="text-[10px] text-muted-foreground mb-0.5">آخر مزامنة</p>
                      <p className="text-sm font-bold text-foreground">{hubspotSync.lastSync}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-lg bg-card/30 text-center">
                        <p className="text-lg font-bold font-mono text-gold">{hubspotSync.contactsSynced}</p>
                        <p className="text-[9px] text-muted-foreground">جهات اتصال</p>
                      </div>
                      <div className="p-2 rounded-lg bg-card/30 text-center">
                        <p className="text-lg font-bold font-mono text-gold">{hubspotSync.dealsSynced}</p>
                        <p className="text-[9px] text-muted-foreground">صفقات</p>
                      </div>
                      <div className="p-2 rounded-lg bg-card/30 text-center">
                        <p className="text-lg font-bold font-mono text-gold">{hubspotSync.activitiesSynced}</p>
                        <p className="text-[9px] text-muted-foreground">نشاطات</p>
                      </div>
                    </div>
                    <button onClick={() => toast.success('تمت المزامنة بنجاح')} className="w-full h-9 rounded-xl bg-gold/10 text-gold text-xs font-bold border border-gold/20 hover:bg-gold/20 transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={12} /> مزامنة الآن
                    </button>
                  </div>
                </div>

                {/* ربط الحقول */}
                <div className="glass-card rounded-xl border border-gold/10 p-4">
                  <h3 className="text-sm font-bold text-foreground mb-4">ربط الحقول — Field Mapping</h3>
                  <div className="space-y-2">
                    {hubspotSync.mappings.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-card/30 border border-border/20">
                        <div className="flex-1 text-left">
                          <p className="text-[11px] font-mono text-blue-400">{m.hubspot}</p>
                        </div>
                        <ArrowRight size={12} className="text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-[11px] text-foreground">{m.maham}</p>
                        </div>
                        <span className={cn('w-2 h-2 rounded-full', m.status === 'active' ? 'bg-emerald-400' : 'bg-muted-foreground/30')} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* سجل المزامنة */}
              <div className="glass-card rounded-xl border border-gold/10 overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="text-sm font-bold text-foreground">سجل المزامنة</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-border/50">
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-muted-foreground">التاريخ</th>
                      <th className="px-3 py-2.5 text-right text-[11px] font-semibold text-muted-foreground">النوع</th>
                      <th className="px-3 py-2.5 text-center text-[11px] font-semibold text-muted-foreground">جهات اتصال</th>
                      <th className="px-3 py-2.5 text-center text-[11px] font-semibold text-muted-foreground">صفقات</th>
                      <th className="px-3 py-2.5 text-center text-[11px] font-semibold text-muted-foreground">الحالة</th>
                    </tr></thead>
                    <tbody>
                      {hubspotSync.syncHistory.map((s, i) => (
                        <tr key={i} className="border-b border-border/20 hover:bg-card/30">
                          <td className="px-4 py-2.5 text-xs text-foreground">{s.date}</td>
                          <td className="px-3 py-2.5"><span className={cn('text-[10px] px-2 py-0.5 rounded-full', s.type === 'يدوي' ? 'bg-gold/10 text-gold' : 'bg-blue-500/10 text-blue-400')}>{s.type}</span></td>
                          <td className="px-3 py-2.5 text-center text-xs font-mono text-foreground">{s.contacts}</td>
                          <td className="px-3 py-2.5 text-center text-xs font-mono text-foreground">{s.deals}</td>
                          <td className="px-3 py-2.5 text-center"><span className={cn('text-[10px] px-2 py-0.5 rounded-full', s.status === 'نجح' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400')}>{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════ ANALYTICS TAB ═══════════════════════ */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Conversion Funnel */}
                <div className="glass-card rounded-xl border border-gold/10 p-4">
                  <h3 className="text-sm font-bold text-foreground mb-4">قمع التحويل — Conversion Funnel</h3>
                  <div className="space-y-2">
                    {conversionFunnel.map((step, i) => {
                      const maxCount = conversionFunnel[0].count
                      const pct = (step.count / maxCount) * 100
                      const convRate = i > 0 ? ((step.count / conversionFunnel[i - 1].count) * 100).toFixed(1) : '100'
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-24 text-left">
                            <p className="text-[11px] text-foreground">{step.stage}</p>
                          </div>
                          <div className="flex-1 h-7 bg-card/30 rounded-lg overflow-hidden relative">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} className="h-full rounded-lg" style={{ backgroundColor: step.color + '40' }}>
                              <div className="h-full rounded-lg" style={{ backgroundColor: step.color, width: '100%', opacity: 0.7 }} />
                            </motion.div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">{formatNumber(step.count)}</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground w-12 text-left">{convRate}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Monthly Deals */}
                <div className="glass-card rounded-xl border border-gold/10 p-4">
                  <h3 className="text-sm font-bold text-foreground mb-4">الصفقات الشهرية</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyDeals}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v / 1000000}M`} />
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px', color: 'var(--card-foreground)' }} formatter={(v: number) => [formatCurrency(v), 'القيمة']} />
                      <Bar dataKey="value" fill="#C9A84C" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* أداء فريق المبيعات */}
              <div className="glass-card rounded-xl border border-gold/10 p-4">
                <h3 className="text-sm font-bold text-foreground mb-4">أداء فريق المبيعات</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: 'أحمد محمد', deals: 5, value: 2330000, rate: 35, avatar: 'أ' },
                    { name: 'سارة العلي', deals: 4, value: 2600000, rate: 42, avatar: 'س' },
                    { name: 'خالد الحربي', deals: 3, value: 1145000, rate: 28, avatar: 'خ' },
                    { name: 'فاطمة أحمد', deals: 2, value: 750000, rate: 22, avatar: 'ف' },
                  ].map((rep, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-3 rounded-xl bg-card/30 border border-border/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">{rep.avatar}</div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{rep.name}</p>
                          <p className="text-[10px] text-muted-foreground">{rep.deals} صفقات</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold font-mono text-gold mb-1">{formatCurrency(rep.value)}</p>
                      <div className="h-1.5 bg-card/50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${rep.rate}%` }} />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-1">معدل التحويل: {rep.rate}%</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* ═══════════════════════ DETAIL MODAL ═══════════════════════ */}
      <AnimatePresence>
        {detailCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDetailCustomer(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-card w-full max-w-lg rounded-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xl">{detailCustomer.name.charAt(0)}</div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{detailCustomer.name}</h2>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 size={10} />{detailCustomer.company}</p>
                    </div>
                  </div>
                  <button onClick={() => setDetailCustomer(null)} className="p-2 rounded-lg hover:bg-card/50 text-muted-foreground"><X size={18} /></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 sm:mb-4">
                  <div className="p-3 rounded-xl bg-card/30 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">البريد</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><Mail size={11} className="text-gold" />{detailCustomer.email}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card/30 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">الجوال</p>
                    <p className="text-xs text-foreground flex items-center gap-1" dir="ltr"><Phone size={11} className="text-gold" />{detailCustomer.phone}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card/30 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">المدينة</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><MapPin size={11} className="text-gold" />{detailCustomer.city}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card/30 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">المصدر</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><Globe size={11} className="text-gold" />{detailCustomer.source}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card/30 border border-border/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">آخر تواصل</p>
                    <p className="text-xs text-foreground flex items-center gap-1"><Calendar size={11} className="text-gold" />{formatDate(detailCustomer.lastContact)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card/30 border border-border/30">
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
                    <p className="text-[10px] text-muted-foreground">التقييم</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-2 rounded-full bg-card/50"><div className={cn('h-full rounded-full', detailCustomer.score >= 80 ? 'bg-emerald-400' : detailCustomer.score >= 50 ? 'bg-amber-400' : 'bg-red-400')} style={{ width: `${detailCustomer.score}%` }} /></div>
                      <span className="text-sm font-bold text-foreground">{detailCustomer.score}%</span>
                    </div>
                  </div>
                </div>

                {detailCustomer.notes && (
                  <div className="p-3 rounded-xl bg-card/30 border border-border/30 mb-3">
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
                  <button onClick={() => { moveStage(detailCustomer.id, 'next'); setDetailCustomer(null) }} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center justify-center gap-2">
                    <ArrowRight size={14} /> نقل للمرحلة التالية
                  </button>
                  <button onClick={() => { toast.info(`جاري إرسال بريد لـ ${detailCustomer.name}...`); setDetailCustomer(null) }} className="h-10 px-4 rounded-xl bg-card/30 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all flex items-center gap-2">
                    <Mail size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════ ADD MODAL ═══════════════════════ */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-4 sm:p-6 rounded-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center"><Plus size={18} className="text-gold" /></div>
                <div><h3 className="text-base font-bold text-foreground">عميل جديد</h3><p className="text-xs text-muted-foreground">أدخل بيانات العميل المحتمل</p></div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الاسم <span className="text-red-400">*</span></label><input type="text" value={newCustomer.name} onChange={(e) => setNewCustomer(p => ({ ...p, name: e.target.value }))} placeholder="اسم العميل" className="w-full h-9 px-3 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الشركة <span className="text-red-400">*</span></label><input type="text" value={newCustomer.company} onChange={(e) => setNewCustomer(p => ({ ...p, company: e.target.value }))} placeholder="اسم الشركة" className="w-full h-9 px-3 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">البريد</label><input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer(p => ({ ...p, email: e.target.value }))} placeholder="email@company.sa" className="w-full h-9 px-3 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">الجوال</label><input type="text" value={newCustomer.phone} onChange={(e) => setNewCustomer(p => ({ ...p, phone: e.target.value }))} placeholder="+966500000000" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">القيمة (ر.س)</label><input type="number" value={newCustomer.value} onChange={(e) => setNewCustomer(p => ({ ...p, value: e.target.value }))} placeholder="0" dir="ltr" className="w-full h-9 px-3 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-all" /></div>
                  <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">المصدر</label><select value={newCustomer.source} onChange={(e) => setNewCustomer(p => ({ ...p, source: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground focus:outline-none focus:border-gold/50"><option>موقع إلكتروني</option><option>معرض سابق</option><option>إحالة</option><option>حملة إعلانية</option><option>LinkedIn</option></select></div>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">ملاحظات</label><textarea value={newCustomer.notes} onChange={(e) => setNewCustomer(p => ({ ...p, notes: e.target.value }))} placeholder="ملاحظات..." rows={2} className="w-full p-3 rounded-lg bg-card/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 resize-none transition-all" /></div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button onClick={handleAdd} className="flex-1 h-10 rounded-xl bg-gradient-to-l from-gold via-gold to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all">إضافة العميل</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 rounded-xl bg-card/30 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════ DELETE CONFIRM ═══════════════════════ */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-sm p-4 sm:p-6 text-center rounded-xl" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} className="text-red-400" /></div>
              <h3 className="text-base font-bold text-foreground mb-2">حذف العميل</h3>
              <p className="text-sm text-muted-foreground mb-5">هل أنت متأكد من حذف <span className="text-foreground font-medium">{customers.find(c => c.id === deleteConfirm)?.name}</span>؟</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-xl bg-card/30 border border-border/50 text-muted-foreground font-medium text-sm hover:text-foreground transition-all">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
