/* ═══════════════════════════════════════════════════════════════
   بوابة الراعي — مركز تحكم شامل (معمّق)
   Nour Theme · Liquid Gold Executive
   9 تابات: نظرة عامة | الرعاة | حزم الرعاية | العقود | ROI والأداء | التقارير | التسليمات | التواصل | الفعاليات القادمة
   ═══════════════════════════════════════════════════════════════ */
import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Award, Crown, Target, Eye, Download, Filter, Search, Calendar,
  CheckCircle2, Clock, AlertTriangle, BarChart3, Zap, TrendingUp,
  DollarSign, ChevronLeft, Plus, Star, Users, Globe, Megaphone,
  Gift, Handshake, FileCheck, Percent, Package, Image, Video,
  MessageSquare, Send, Phone, Mail, Paperclip, MapPin, CalendarDays
} from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar } from 'recharts'

const tabs = ['نظرة عامة', 'الرعاة', 'حزم الرعاية', 'العقود', 'ROI والأداء', 'التقارير', 'التسليمات', 'التواصل', 'الفعاليات القادمة'] as const
type TabType = typeof tabs[number]

/* ── بيانات تجريبية ── */
const sponsorshipTrend = [
  { month: 'يناير', عقود: 8, قيمة: 3200000 },
  { month: 'فبراير', عقود: 12, قيمة: 5100000 },
  { month: 'مارس', عقود: 15, قيمة: 6800000 },
  { month: 'أبريل', عقود: 18, قيمة: 8500000 },
  { month: 'مايو', عقود: 22, قيمة: 11200000 },
  { month: 'يونيو', عقود: 28, قيمة: 14800000 },
]

const tierDistribution = [
  { name: 'بلاتيني', value: 15, color: '#C9A84C' },
  { name: 'ذهبي', value: 30, color: '#DAA520' },
  { name: 'فضي', value: 35, color: '#A8A8A8' },
  { name: 'برونزي', value: 20, color: '#CD7F32' },
]

const roiMetrics = [
  { metric: 'الظهور الإعلامي', value: 92 },
  { metric: 'التفاعل الرقمي', value: 85 },
  { metric: 'الحضور المباشر', value: 78 },
  { metric: 'العائد المالي', value: 88 },
  { metric: 'رضا الراعي', value: 95 },
  { metric: 'الوصول الجغرافي', value: 72 },
]

const sponsors = [
  { id: 1, name: 'STC', tier: 'بلاتيني', totalValue: 5200000, events: 6, roi: 340, status: 'active', since: '2023-01-15', logo: 'S', email: 'sponsor@stc.com.sa', phone: '+966501000001' },
  { id: 2, name: 'البنك الأهلي', tier: 'بلاتيني', totalValue: 4800000, events: 5, roi: 310, status: 'active', since: '2023-03-20', logo: 'أ', email: 'sponsor@alahli.com', phone: '+966501000002' },
  { id: 3, name: 'أرامكو', tier: 'بلاتيني', totalValue: 8500000, events: 8, roi: 420, status: 'active', since: '2022-06-10', logo: 'ر', email: 'sponsor@aramco.com', phone: '+966501000003' },
  { id: 4, name: 'موبايلي', tier: 'ذهبي', totalValue: 2400000, events: 4, roi: 280, status: 'active', since: '2024-01-05', logo: 'م', email: 'sponsor@mobily.com.sa', phone: '+966501000004' },
  { id: 5, name: 'زين', tier: 'ذهبي', totalValue: 1800000, events: 3, roi: 250, status: 'active', since: '2024-04-15', logo: 'ز', email: 'sponsor@zain.com', phone: '+966501000005' },
  { id: 6, name: 'نيوم', tier: 'فضي', totalValue: 1200000, events: 2, roi: 190, status: 'pending', since: '2025-01-20', logo: 'ن', email: 'sponsor@neom.com', phone: '+966501000006' },
]

const packages = [
  { id: 1, name: 'الحزمة البلاتينية', price: 2500000, features: ['شعار رئيسي في كل المواد', 'جناح VIP حصري', 'كلمة افتتاحية', '10 تذاكر VIP', 'تغطية إعلامية كاملة', 'تقرير ROI مفصل'], maxSponsors: 3, current: 2, color: '#C9A84C' },
  { id: 2, name: 'الحزمة الذهبية', price: 1500000, features: ['شعار في المواد الرئيسية', 'جناح مميز', '5 تذاكر VIP', 'تغطية إعلامية', 'تقرير أداء'], maxSponsors: 5, current: 4, color: '#DAA520' },
  { id: 3, name: 'الحزمة الفضية', price: 800000, features: ['شعار في الكتيبات', 'مساحة عرض', '3 تذاكر', 'ذكر في البيانات الصحفية'], maxSponsors: 8, current: 5, color: '#A8A8A8' },
  { id: 4, name: 'الحزمة البرونزية', price: 400000, features: ['شعار في الموقع', 'تذكرتان', 'ذكر في وسائل التواصل'], maxSponsors: 12, current: 7, color: '#CD7F32' },
]

const sponsorContracts = [
  { id: 'SC-2026-001', sponsor: 'STC', event: 'معرض الرياض الدولي', package: 'بلاتيني', value: 2500000, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', paymentStatus: 'paid' },
  { id: 'SC-2026-002', sponsor: 'البنك الأهلي', event: 'موسم الرياض', package: 'بلاتيني', value: 2300000, startDate: '2026-02-01', endDate: '2026-11-30', status: 'active', paymentStatus: 'partial' },
  { id: 'SC-2026-003', sponsor: 'أرامكو', event: 'بوليفارد وورلد', package: 'بلاتيني', value: 3500000, startDate: '2026-01-15', endDate: '2027-01-14', status: 'active', paymentStatus: 'paid' },
  { id: 'SC-2026-004', sponsor: 'موبايلي', event: 'مؤتمر التقنية', package: 'ذهبي', value: 1500000, startDate: '2026-03-01', endDate: '2026-09-30', status: 'active', paymentStatus: 'pending' },
]

const deliverables = [
  { id: 1, sponsor: 'STC', item: 'شعار على اللافتات الرئيسية', type: 'branding', dueDate: '2026-04-15', status: 'completed', proof: 'صورة مرفقة' },
  { id: 2, sponsor: 'STC', item: 'منشور Instagram (3 منشورات)', type: 'digital', dueDate: '2026-04-20', status: 'completed', proof: '3 روابط' },
  { id: 3, sponsor: 'البنك الأهلي', item: 'جناح VIP — تصميم وتنفيذ', type: 'physical', dueDate: '2026-04-25', status: 'in_progress', proof: '' },
  { id: 4, sponsor: 'البنك الأهلي', item: 'فيديو ترويجي 30 ثانية', type: 'digital', dueDate: '2026-04-30', status: 'pending', proof: '' },
  { id: 5, sponsor: 'أرامكو', item: 'كلمة افتتاحية — 10 دقائق', type: 'event', dueDate: '2026-05-01', status: 'pending', proof: '' },
  { id: 6, sponsor: 'أرامكو', item: 'تقرير ROI ربع سنوي', type: 'report', dueDate: '2026-05-15', status: 'pending', proof: '' },
  { id: 7, sponsor: 'موبايلي', item: 'شعار في الكتيب الرسمي', type: 'branding', dueDate: '2026-04-10', status: 'completed', proof: 'PDF مرفق' },
  { id: 8, sponsor: 'موبايلي', item: 'بانر إعلاني على الموقع', type: 'digital', dueDate: '2026-04-18', status: 'in_progress', proof: '' },
]

const sponsorMessages = [
  { id: 1, from: 'STC', subject: 'طلب تعديل موقع الجناح', date: '2026-03-30 14:30', unread: true, priority: 'high' },
  { id: 2, from: 'أرامكو', subject: 'تأكيد موعد الكلمة الافتتاحية', date: '2026-03-29 10:15', unread: true, priority: 'medium' },
  { id: 3, from: 'البنك الأهلي', subject: 'استفسار عن تقرير ROI', date: '2026-03-28 16:45', unread: false, priority: 'low' },
  { id: 4, from: 'موبايلي', subject: 'طلب إضافة بانر إعلاني', date: '2026-03-27 09:00', unread: false, priority: 'medium' },
]

const upcomingEvents = [
  { id: 1, name: 'معرض الرياض الدولي للتقنية', date: '2026-05-15', location: 'مركز الرياض للمعارض', sponsors: ['STC', 'أرامكو'], availableSlots: 2, totalSlots: 5, status: 'open' },
  { id: 2, name: 'مؤتمر الاستثمار السعودي', date: '2026-06-20', location: 'فندق الريتز كارلتون', sponsors: ['البنك الأهلي'], availableSlots: 4, totalSlots: 6, status: 'open' },
  { id: 3, name: 'بوليفارد وورلد — الموسم الجديد', date: '2026-09-01', location: 'بوليفارد سيتي', sponsors: ['أرامكو', 'STC', 'موبايلي'], availableSlots: 1, totalSlots: 4, status: 'open' },
  { id: 4, name: 'معرض الأغذية والضيافة', date: '2026-10-10', location: 'واجهة الرياض', sponsors: [], availableSlots: 6, totalSlots: 6, status: 'upcoming' },
]

export default function SponsorPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')
  const [msgInput, setMsgInput] = useState('')

  const tierColor = (tier: string) => {
    switch(tier) {
      case 'بلاتيني': return '#C9A84C'
      case 'ذهبي': return '#DAA520'
      case 'فضي': return '#A8A8A8'
      case 'برونزي': return '#CD7F32'
      default: return '#6B6560'
    }
  }

  const delivTypeIcon = (type: string) => {
    switch(type) {
      case 'branding': return Image
      case 'digital': return Globe
      case 'physical': return Package
      case 'event': return CalendarDays
      case 'report': return BarChart3
      default: return FileCheck
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="بوابة الراعي"
          subtitle="إدارة الرعاة وحزم الرعاية والعقود وتحليل العائد على الاستثمار"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => toast.info('تصدير — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button onClick={() => toast.info('إضافة راعي — قريباً')} className="nour-btn-gold text-xs flex items-center gap-1.5"><Crown size={14} /> راعي جديد</button>
            </div>
          }
        />

        {/* Tabs — scrollable on mobile */}
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-thin" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
              'px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all duration-300',
              activeTab === tab ? 'bg-gradient-to-l from-gold/15 to-gold/8 text-gold border border-gold/20 shadow-[0_0_12px_rgba(201,168,76,0.08)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}>{tab}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* ═══ نظرة عامة ═══ */}
            {activeTab === 'نظرة عامة' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="إجمالي الرعاة" value="28" icon={Crown} trend={12} trendLabel="جديد" delay={0} />
                  <StatsCard title="قيمة الرعايات" value={formatCurrency(49700000)} icon={DollarSign} trend={45} trendLabel="نمو" delay={0.1} />
                  <StatsCard title="متوسط ROI" value="310%" icon={TrendingUp} trend={28} trendLabel="تحسن" delay={0.2} />
                  <StatsCard title="معدل التجديد" value="87%" icon={Handshake} trend={5} trendLabel="أعلى" delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">اتجاه عقود الرعاية</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={sponsorshipTrend}>
                        <defs><linearGradient id="goldGradSp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000000).toFixed(0)}M`} />
                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--card-foreground)', fontSize: 12, backdropFilter: 'blur(20px)' }} />
                        <Area type="monotone" dataKey="قيمة" stroke="#C9A84C" fill="url(#goldGradSp)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">توزيع المستويات</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <RechartsPie>
                        <Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                          {tierDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--card-foreground)', fontSize: 11, backdropFilter: 'blur(20px)' }} />
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {tierDistribution.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                          <span className="font-bold text-foreground">{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="glass-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Crown size={16} className="text-gold" /> أبرز الرعاة</h3>
                      <button onClick={() => setActiveTab('الرعاة')} className="text-xs text-gold hover:opacity-80 flex items-center gap-1">عرض الكل <ChevronLeft size={12} /></button>
                    </div>
                    <div className="space-y-3">
                      {sponsors.slice(0, 4).map((s, i) => (
                        <motion.div key={s.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-gold/[0.03] transition-colors" style={{ border: '1px solid rgba(201,168,76,0.06)' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: `${tierColor(s.tier)}20`, border: `1px solid ${tierColor(s.tier)}40`, color: tierColor(s.tier) }}>{s.logo}</div>
                            <div><p className="text-xs font-medium text-foreground">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.tier} · {s.events} فعاليات</p></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${tierColor(s.tier)}15`, color: tierColor(s.tier), border: `1px solid ${tierColor(s.tier)}30` }}>ROI {s.roi}%</span>
                            <span className="text-xs font-bold text-gold hidden sm:inline">{formatCurrency(s.totalValue)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-4 sm:p-6 border-gold/15">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Zap size={16} className="text-gold" /> رؤى الذكاء الاصطناعي</h3>
                    <div className="space-y-3">
                      {[
                        { icon: TrendingUp, text: 'معدل ROI للرعاة البلاتينيين ارتفع 28% — أفضل أداء منذ 3 سنوات', type: 'success' as const },
                        { icon: Handshake, text: 'معدل تجديد العقود 87% — يُنصح ببدء مفاوضات التجديد المبكر', type: 'success' as const },
                        { icon: AlertTriangle, text: '3 عقود رعاية تنتهي خلال 60 يوماً — يجب التواصل الفوري', type: 'warning' as const },
                        { icon: Target, text: 'قطاع التقنية يحقق أعلى ROI (420%) — فرصة لاستقطاب رعاة جدد', type: 'info' as const },
                      ].map((insight, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn(
                          'p-3 rounded-lg flex items-start gap-3 text-xs',
                          insight.type === 'success' && 'bg-emerald-500/5 border border-emerald-500/10',
                          insight.type === 'warning' && 'bg-amber-500/5 border border-amber-500/10',
                          insight.type === 'info' && 'bg-gold/5 border border-gold/10',
                        )}>
                          <insight.icon size={14} className={cn('shrink-0 mt-0.5', insight.type === 'success' && 'text-emerald-400', insight.type === 'warning' && 'text-amber-400', insight.type === 'info' && 'text-gold')} />
                          <span className="text-muted-foreground leading-relaxed">{insight.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ الرعاة ═══ */}
            {activeTab === 'الرعاة' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث عن راعي..." className="w-full h-10 pr-9 pl-4 rounded-xl text-sm bg-card border border-border focus:border-gold/30 outline-none transition-all" />
                  </div>
                  <button onClick={() => toast.info('تصفية — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5 justify-center"><Filter size={14} /> تصفية</button>
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead><tr className="border-b border-border/50">
                        {['الراعي', 'المستوى', 'الفعاليات', 'إجمالي القيمة', 'ROI', 'الحالة', 'منذ', ''].map(h => <th key={h} className="text-right p-3 sm:p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {sponsors.filter(s => !searchQuery || s.name.includes(searchQuery)).map((s) => (
                          <tr key={s.id} className="border-b border-border/30 hover:bg-gold/[0.03] transition-colors">
                            <td className="p-3 sm:p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: `${tierColor(s.tier)}20`, border: `1px solid ${tierColor(s.tier)}40`, color: tierColor(s.tier) }}>{s.logo}</div><p className="font-medium text-foreground text-xs">{s.name}</p></div></td>
                            <td className="p-3 sm:p-4"><span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${tierColor(s.tier)}15`, color: tierColor(s.tier), border: `1px solid ${tierColor(s.tier)}30` }}>{s.tier}</span></td>
                            <td className="p-3 sm:p-4 text-xs text-center font-bold">{s.events}</td>
                            <td className="p-3 sm:p-4 text-xs font-bold text-gold">{formatCurrency(s.totalValue)}</td>
                            <td className="p-3 sm:p-4"><span className="text-xs font-bold text-emerald-400">{s.roi}%</span></td>
                            <td className="p-3 sm:p-4"><StatusBadge status={s.status} /></td>
                            <td className="p-3 sm:p-4 text-[10px] text-muted-foreground">{formatDate(s.since)}</td>
                            <td className="p-3 sm:p-4"><button className="p-1.5 rounded-lg hover:bg-gold/10 text-muted-foreground hover:text-gold transition-all"><Eye size={14} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ حزم الرعاية ═══ */}
            {activeTab === 'حزم الرعاية' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {packages.map((pkg, i) => (
                  <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 sm:p-6 hover:border-gold/20 transition-all duration-300" style={{ borderTop: `3px solid ${pkg.color}` }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{pkg.name}</h3>
                        <p className="text-lg font-bold mt-1" style={{ color: pkg.color }}>{formatCurrency(pkg.price)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${pkg.color}15`, border: `1px solid ${pkg.color}30` }}>
                        <Crown size={22} style={{ color: pkg.color }} />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {pkg.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 size={12} style={{ color: pkg.color }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                      <div className="text-[10px] text-muted-foreground"><span className="font-bold text-foreground">{pkg.current}</span> / {pkg.maxSponsors} رعاة</div>
                      <div className="w-24 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full transition-all" style={{ width: `${(pkg.current / pkg.maxSponsors) * 100}%`, background: pkg.color }} /></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <StatsCard title="العقود النشطة" value="4" icon={FileCheck} delay={0} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(9800000)} icon={DollarSign} delay={0.1} />
                  <StatsCard title="نسبة التحصيل" value="72%" icon={Percent} trend={12} trendLabel="تحسن" delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead><tr className="border-b border-border/50">
                        {['رقم العقد', 'الراعي', 'الفعالية', 'الحزمة', 'القيمة', 'الفترة', 'الحالة', 'الدفع'].map(h => <th key={h} className="text-right p-3 sm:p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {sponsorContracts.map((c) => (
                          <tr key={c.id} className="border-b border-border/30 hover:bg-gold/[0.03] transition-colors">
                            <td className="p-3 sm:p-4 text-xs font-mono text-gold">{c.id}</td>
                            <td className="p-3 sm:p-4 text-xs font-medium text-foreground">{c.sponsor}</td>
                            <td className="p-3 sm:p-4 text-xs text-muted-foreground">{c.event}</td>
                            <td className="p-3 sm:p-4"><span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">{c.package}</span></td>
                            <td className="p-3 sm:p-4 text-xs font-bold text-gold">{formatCurrency(c.value)}</td>
                            <td className="p-3 sm:p-4 text-[10px] text-muted-foreground">{formatDate(c.startDate)} — {formatDate(c.endDate)}</td>
                            <td className="p-3 sm:p-4"><StatusBadge status={c.status} /></td>
                            <td className="p-3 sm:p-4"><StatusBadge status={c.paymentStatus} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ ROI والأداء ═══ */}
            {activeTab === 'ROI والأداء' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <StatsCard title="متوسط ROI" value="310%" icon={TrendingUp} trend={28} trendLabel="تحسن" delay={0} />
                  <StatsCard title="إجمالي الوصول" value="12.5M" icon={Globe} trend={45} trendLabel="نمو" delay={0.1} />
                  <StatsCard title="رضا الرعاة" value="95%" icon={Star} trend={5} trendLabel="أعلى" delay={0.2} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">مؤشرات الأداء الرئيسية</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={roiMetrics}>
                        <PolarGrid stroke="rgba(201,168,76,0.1)" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B6560', fontSize: 10 }} />
                        <Radar name="الأداء" dataKey="value" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.15} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">ROI حسب المستوى</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={[
                        { tier: 'بلاتيني', roi: 357, sponsors: 3 },
                        { tier: 'ذهبي', roi: 265, sponsors: 5 },
                        { tier: 'فضي', roi: 190, sponsors: 8 },
                        { tier: 'برونزي', roi: 145, sponsors: 12 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="tier" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--card-foreground)', fontSize: 12, backdropFilter: 'blur(20px)' }} />
                        <Bar dataKey="roi" fill="#C9A84C" radius={[6, 6, 0, 0]} name="ROI %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'تقرير الرعاة', desc: 'ملخص شامل لجميع الرعاة ومستوياتهم', icon: Crown, date: '2026-03-28' },
                  { title: 'تقرير ROI', desc: 'تحليل العائد على الاستثمار لكل راعي', icon: TrendingUp, date: '2026-03-25' },
                  { title: 'تقرير الإيرادات', desc: 'تحليل إيرادات الرعايات والتحصيل', icon: DollarSign, date: '2026-03-20' },
                  { title: 'تقرير الأداء', desc: 'مؤشرات أداء حزم الرعاية', icon: BarChart3, date: '2026-03-15' },
                  { title: 'تقرير التجديد', desc: 'توقعات تجديد العقود والفرص', icon: Handshake, date: '2026-03-10' },
                  { title: 'تقرير AI التنبؤي', desc: 'توقعات الذكاء الاصطناعي لسوق الرعاية', icon: Zap, date: '2026-03-05' },
                ].map((report, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 sm:p-5 hover:border-gold/20 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center group-hover:bg-gold/15 transition-all"><report.icon size={18} className="text-gold" /></div>
                      <div className="flex-1"><h4 className="text-sm font-bold text-foreground">{report.title}</h4><p className="text-[10px] text-muted-foreground mt-0.5">{report.desc}</p></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {formatDate(report.date)}</span>
                      <button onClick={() => toast.info('تحميل — قريباً')} className="text-[10px] text-gold flex items-center gap-1 hover:opacity-80"><Download size={10} /> تحميل</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ═══ التسليمات ═══ */}
            {activeTab === 'التسليمات' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="إجمالي التسليمات" value={deliverables.length.toString()} icon={Package} delay={0} />
                  <StatsCard title="مكتملة" value={deliverables.filter(d => d.status === 'completed').length.toString()} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="قيد التنفيذ" value={deliverables.filter(d => d.status === 'in_progress').length.toString()} icon={Clock} delay={0.2} />
                  <StatsCard title="معلقة" value={deliverables.filter(d => d.status === 'pending').length.toString()} icon={AlertTriangle} delay={0.3} />
                </div>

                {/* Progress bar */}
                <div className="glass-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">نسبة الإنجاز الإجمالية</h3>
                    <span className="text-sm font-bold text-gold">{Math.round((deliverables.filter(d => d.status === 'completed').length / deliverables.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-l from-gold to-gold/60 transition-all" style={{ width: `${(deliverables.filter(d => d.status === 'completed').length / deliverables.length) * 100}%` }} />
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="p-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Package size={16} className="text-gold" /> سجل التسليمات</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead><tr className="border-b border-border/50">
                        {['النوع', 'الراعي', 'البند', 'الموعد', 'الحالة', 'الإثبات'].map(h => <th key={h} className="text-right p-3 sm:p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {deliverables.map((d) => {
                          const Icon = delivTypeIcon(d.type)
                          return (
                            <tr key={d.id} className="border-b border-border/30 hover:bg-gold/[0.03] transition-colors">
                              <td className="p-3 sm:p-4"><div className="w-8 h-8 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center"><Icon size={14} className="text-gold" /></div></td>
                              <td className="p-3 sm:p-4 text-xs font-medium text-foreground">{d.sponsor}</td>
                              <td className="p-3 sm:p-4 text-xs text-muted-foreground">{d.item}</td>
                              <td className="p-3 sm:p-4 text-[10px] text-muted-foreground">{formatDate(d.dueDate)}</td>
                              <td className="p-3 sm:p-4"><StatusBadge status={d.status} /></td>
                              <td className="p-3 sm:p-4 text-[10px] text-muted-foreground">{d.proof || '—'}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ التواصل ═══ */}
            {activeTab === 'التواصل' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="رسائل غير مقروءة" value={sponsorMessages.filter(m => m.unread).length.toString()} icon={MessageSquare} delay={0} />
                  <StatsCard title="متوسط وقت الرد" value="2.1 ساعة" icon={Clock} delay={0.1} />
                  <StatsCard title="تذاكر مفتوحة" value="3" icon={AlertTriangle} delay={0.2} />
                  <StatsCard title="رضا التواصل" value="94%" icon={Star} delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 glass-card overflow-hidden">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><MessageSquare size={16} className="text-gold" /> صندوق الرسائل</h3>
                      <button className="text-[10px] text-gold">تحديد الكل كمقروء</button>
                    </div>
                    <div className="divide-y divide-border/30">
                      {sponsorMessages.map((msg, i) => (
                        <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={cn('p-4 hover:bg-gold/[0.02] transition-colors cursor-pointer', msg.unread && 'bg-gold/[0.03] border-r-2 border-gold')}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs shrink-0">{msg.from.charAt(0)}</div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2"><p className="text-xs font-bold text-foreground truncate">{msg.from}</p>{msg.unread && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}</div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.subject}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[10px] text-muted-foreground">{msg.date.split(' ')[1]}</span>
                              <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full', msg.priority === 'high' && 'bg-red-500/10 text-red-400', msg.priority === 'medium' && 'bg-amber-500/10 text-amber-400', msg.priority === 'low' && 'bg-emerald-500/10 text-emerald-400')}>{msg.priority === 'high' ? 'عاجل' : msg.priority === 'medium' ? 'متوسط' : 'عادي'}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass-card p-4">
                      <h3 className="text-sm font-bold text-foreground mb-3">رسالة سريعة</h3>
                      <textarea value={msgInput} onChange={(e) => setMsgInput(e.target.value)} placeholder="اكتب رسالتك..." className="w-full h-24 p-3 rounded-xl text-sm bg-card border border-border focus:border-gold/30 outline-none resize-none transition-all" />
                      <div className="flex items-center justify-between mt-2">
                        <button className="p-2 rounded-lg hover:bg-gold/10 text-muted-foreground"><Paperclip size={14} /></button>
                        <button className="nour-btn-gold text-xs flex items-center gap-1.5"><Send size={12} /> إرسال</button>
                      </div>
                    </div>
                    <div className="glass-card p-4">
                      <h3 className="text-sm font-bold text-foreground mb-3">جهات اتصال الرعاة</h3>
                      <div className="space-y-2">
                        {sponsors.slice(0, 4).map((s) => (
                          <div key={s.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gold/[0.03] transition-colors">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `${tierColor(s.tier)}20`, color: tierColor(s.tier), border: `1px solid ${tierColor(s.tier)}30` }}>{s.logo}</div>
                              <span className="text-xs text-foreground truncate max-w-[120px]">{s.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="p-1 rounded hover:bg-gold/10 text-muted-foreground hover:text-gold"><Phone size={12} /></button>
                              <button className="p-1 rounded hover:bg-gold/10 text-muted-foreground hover:text-gold"><Mail size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ الفعاليات القادمة ═══ */}
            {activeTab === 'الفعاليات القادمة' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="فعاليات قادمة" value={upcomingEvents.length.toString()} icon={CalendarDays} delay={0} />
                  <StatsCard title="فرص رعاية متاحة" value={upcomingEvents.reduce((s, e) => s + e.availableSlots, 0).toString()} icon={Crown} delay={0.1} />
                  <StatsCard title="رعاة مؤكدون" value={upcomingEvents.reduce((s, e) => s + e.sponsors.length, 0).toString()} icon={CheckCircle2} delay={0.2} />
                  <StatsCard title="نسبة التغطية" value={`${Math.round((upcomingEvents.reduce((s, e) => s + (e.totalSlots - e.availableSlots), 0) / upcomingEvents.reduce((s, e) => s + e.totalSlots, 0)) * 100)}%`} icon={Target} delay={0.3} />
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event, i) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 sm:p-6 hover:border-gold/20 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gold/8 border border-gold/15 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] text-muted-foreground">{event.date.split('-')[1] === '05' ? 'مايو' : event.date.split('-')[1] === '06' ? 'يونيو' : event.date.split('-')[1] === '09' ? 'سبتمبر' : 'أكتوبر'}</span>
                            <span className="text-lg font-bold text-gold">{event.date.split('-')[2]}</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-foreground">{event.name}</h3>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={10} /> {event.location}</p>
                            {event.sponsors.length > 0 && (
                              <div className="flex items-center gap-1 mt-2 flex-wrap">
                                <span className="text-[10px] text-muted-foreground">الرعاة:</span>
                                {event.sponsors.map((sp) => (
                                  <span key={sp} className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/15">{sp}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <StatusBadge status={event.status} />
                          <div className="text-[10px] text-muted-foreground text-left sm:text-right">
                            <span className="font-bold text-gold">{event.availableSlots}</span> / {event.totalSlots} فرص متاحة
                          </div>
                          <div className="w-20 h-1.5 rounded-full bg-white/5">
                            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${((event.totalSlots - event.availableSlots) / event.totalSlots) * 100}%` }} />
                          </div>
                          <button onClick={() => toast.info('تفاصيل الفعالية — قريباً')} className="nour-btn-outline text-[10px] flex items-center gap-1 mt-1"><Eye size={10} /> التفاصيل</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
