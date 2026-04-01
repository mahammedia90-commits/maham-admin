/* ═══════════════════════════════════════════════════════════════
   بوابة الراعي — مركز تحكم شامل
   Nour Theme · Liquid Gold Executive
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
  Gift, Handshake, FileCheck, Percent
} from 'lucide-react'
import { BarChart, Bar, AreaChart, Area, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar } from 'recharts'

const tabs = ['نظرة عامة', 'الرعاة', 'حزم الرعاية', 'العقود', 'ROI والأداء', 'التقارير'] as const
type TabType = typeof tabs[number]

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
  { id: 1, name: 'STC', tier: 'بلاتيني', totalValue: 5200000, events: 6, roi: 340, status: 'active', since: '2023-01-15', logo: 'S' },
  { id: 2, name: 'البنك الأهلي', tier: 'بلاتيني', totalValue: 4800000, events: 5, roi: 310, status: 'active', since: '2023-03-20', logo: 'أ' },
  { id: 3, name: 'أرامكو', tier: 'بلاتيني', totalValue: 8500000, events: 8, roi: 420, status: 'active', since: '2022-06-10', logo: 'ر' },
  { id: 4, name: 'موبايلي', tier: 'ذهبي', totalValue: 2400000, events: 4, roi: 280, status: 'active', since: '2024-01-05', logo: 'م' },
  { id: 5, name: 'زين', tier: 'ذهبي', totalValue: 1800000, events: 3, roi: 250, status: 'active', since: '2024-04-15', logo: 'ز' },
  { id: 6, name: 'نيوم', tier: 'فضي', totalValue: 1200000, events: 2, roi: 190, status: 'pending', since: '2025-01-20', logo: 'ن' },
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

export default function SponsorPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')

  const tierColor = (tier: string) => {
    switch(tier) {
      case 'بلاتيني': return '#C9A84C'
      case 'ذهبي': return '#DAA520'
      case 'فضي': return '#A8A8A8'
      case 'برونزي': return '#CD7F32'
      default: return '#6B6560'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        <PageHeader
          title="بوابة الراعي"
          subtitle="إدارة الرعاة وحزم الرعاية والعقود وتحليل العائد على الاستثمار"
          actions={
            <div className="flex items-center gap-2">
              <button onClick={() => toast.info('تصدير — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button onClick={() => toast.info('إضافة راعي — قريباً')} className="nour-btn-gold text-xs flex items-center gap-1.5"><Crown size={14} /> راعي جديد</button>
            </div>
          }
        />

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-hide" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
              'px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300',
              activeTab === tab ? 'bg-gradient-to-l from-[rgba(201,168,76,0.15)] to-[rgba(201,168,76,0.08)] text-[#C9A84C] border border-[rgba(201,168,76,0.2)] shadow-[0_0_12px_rgba(201,168,76,0.08)]' : 'text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)]'
            )}>{tab}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* ═══ نظرة عامة ═══ */}
            {activeTab === 'نظرة عامة' && (
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <StatsCard title="إجمالي الرعاة" value="28" icon={Crown} trend={12} trendLabel="جديد" delay={0} />
                  <StatsCard title="قيمة الرعايات" value={formatCurrency(49700000)} icon={DollarSign} trend={45} trendLabel="نمو" delay={0.1} />
                  <StatsCard title="متوسط ROI" value="310%" icon={TrendingUp} trend={28} trendLabel="تحسن" delay={0.2} />
                  <StatsCard title="معدل التجديد" value="87%" icon={Handshake} trend={5} trendLabel="أعلى" delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {/* Sponsorship Trend */}
                  <div className="lg:col-span-2 glass-card p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">اتجاه عقود الرعاية</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={sponsorshipTrend}>
                        <defs>
                          <linearGradient id="goldGradSp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000000).toFixed(0)}M`} />
                        <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} />
                        <Area type="monotone" dataKey="قيمة" stroke="#C9A84C" fill="url(#goldGradSp)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tier Distribution */}
                  <div className="glass-card p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">توزيع المستويات</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie>
                        <Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                          {tierDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 11 }} />
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

                {/* Top Sponsors + AI */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div className="glass-card p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Crown size={16} className="text-[#C9A84C]" /> أبرز الرعاة</h3>
                      <button onClick={() => setActiveTab('الرعاة')} className="text-xs text-[#C9A84C] hover:opacity-80 flex items-center gap-1">عرض الكل <ChevronLeft size={12} /></button>
                    </div>
                    <div className="space-y-3">
                      {sponsors.slice(0, 4).map((s, i) => (
                        <motion.div key={s.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-[rgba(201,168,76,0.03)] transition-colors" style={{ border: '1px solid rgba(201,168,76,0.06)' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: `${tierColor(s.tier)}20`, border: `1px solid ${tierColor(s.tier)}40`, color: tierColor(s.tier) }}>{s.logo}</div>
                            <div><p className="text-xs font-medium text-foreground">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.tier} · {s.events} فعاليات</p></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${tierColor(s.tier)}15`, color: tierColor(s.tier), border: `1px solid ${tierColor(s.tier)}30` }}>ROI {s.roi}%</span>
                            <span className="text-xs font-bold text-[#C9A84C]">{formatCurrency(s.totalValue)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Zap size={16} className="text-[#C9A84C]" /> رؤى الذكاء الاصطناعي</h3>
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
                          insight.type === 'info' && 'bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)]',
                        )}>
                          <insight.icon size={14} className={cn('shrink-0 mt-0.5', insight.type === 'success' && 'text-emerald-400', insight.type === 'warning' && 'text-amber-400', insight.type === 'info' && 'text-[#C9A84C]')} />
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
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث عن راعي..." className="w-full h-9 sm:h-9 sm:h-10 pr-9 pl-4 rounded-xl text-xs sm:text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                  </div>
                  <button onClick={() => toast.info('تصفية — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Filter size={14} /> تصفية</button>
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead><tr className="border-b border-border/50">
                        {['الراعي', 'المستوى', 'الفعاليات', 'إجمالي القيمة', 'ROI', 'الحالة', 'منذ', ''].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {sponsors.filter(s => !searchQuery || s.name.includes(searchQuery)).map((s) => (
                          <tr key={s.id} className="border-b border-border/30 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: `${tierColor(s.tier)}20`, border: `1px solid ${tierColor(s.tier)}40`, color: tierColor(s.tier) }}>{s.logo}</div><p className="font-medium text-foreground text-xs">{s.name}</p></div></td>
                            <td className="p-4"><span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${tierColor(s.tier)}15`, color: tierColor(s.tier), border: `1px solid ${tierColor(s.tier)}30` }}>{s.tier}</span></td>
                            <td className="p-4 text-xs text-center font-bold">{s.events}</td>
                            <td className="p-4 text-xs font-bold text-[#C9A84C]">{formatCurrency(s.totalValue)}</td>
                            <td className="p-4"><span className="text-xs font-bold text-emerald-400">{s.roi}%</span></td>
                            <td className="p-4"><StatusBadge status={s.status} /></td>
                            <td className="p-4 text-[10px] text-muted-foreground">{formatDate(s.since)}</td>
                            <td className="p-4"><button className="p-1.5 rounded-lg hover:bg-[rgba(201,168,76,0.1)] text-muted-foreground hover:text-[#C9A84C] transition-all"><Eye size={14} /></button></td>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {packages.map((pkg, i) => (
                  <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-3 sm:p-4 lg:p-6 hover:border-[rgba(201,168,76,0.2)] transition-all duration-300" style={{ borderTop: `3px solid ${pkg.color}` }}>
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
                      <div className="text-[10px] text-muted-foreground">
                        <span className="font-bold text-foreground">{pkg.current}</span> / {pkg.maxSponsors} رعاة
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-[rgba(255,255,255,0.05)]">
                        <div className="h-full rounded-full transition-all" style={{ width: `${(pkg.current / pkg.maxSponsors) * 100}%`, background: pkg.color }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <StatsCard title="العقود النشطة" value="4" icon={FileCheck} delay={0} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(9800000)} icon={DollarSign} delay={0.1} />
                  <StatsCard title="نسبة التحصيل" value="72%" icon={Percent} trend={12} trendLabel="تحسن" delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead><tr className="border-b border-border/50">
                        {['رقم العقد', 'الراعي', 'الفعالية', 'الحزمة', 'القيمة', 'الفترة', 'الحالة', 'الدفع'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {sponsorContracts.map((c) => (
                          <tr key={c.id} className="border-b border-border/30 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <td className="p-4 text-xs font-mono text-[#C9A84C]">{c.id}</td>
                            <td className="p-4 text-xs font-medium text-foreground">{c.sponsor}</td>
                            <td className="p-4 text-xs text-muted-foreground">{c.event}</td>
                            <td className="p-4"><span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>{c.package}</span></td>
                            <td className="p-4 text-xs font-bold text-[#C9A84C]">{formatCurrency(c.value)}</td>
                            <td className="p-4 text-[10px] text-muted-foreground">{formatDate(c.startDate)} — {formatDate(c.endDate)}</td>
                            <td className="p-4"><StatusBadge status={c.status} /></td>
                            <td className="p-4"><StatusBadge status={c.paymentStatus} /></td>
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
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <StatsCard title="متوسط ROI" value="310%" icon={TrendingUp} trend={28} trendLabel="تحسن" delay={0} />
                  <StatsCard title="إجمالي الوصول" value="12.5M" icon={Globe} trend={45} trendLabel="نمو" delay={0.1} />
                  <StatsCard title="رضا الرعاة" value="95%" icon={Star} trend={5} trendLabel="أعلى" delay={0.2} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div className="glass-card p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">مؤشرات الأداء الرئيسية</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={roiMetrics}>
                        <PolarGrid stroke="rgba(201,168,76,0.1)" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B6560', fontSize: 10 }} />
                        <Radar name="الأداء" dataKey="value" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.15} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">ROI حسب المستوى</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { tier: 'بلاتيني', roi: 357, sponsors: 3 },
                        { tier: 'ذهبي', roi: 265, sponsors: 5 },
                        { tier: 'فضي', roi: 190, sponsors: 8 },
                        { tier: 'برونزي', roi: 145, sponsors: 12 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="tier" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                        <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} />
                        <Bar dataKey="roi" fill="#C9A84C" radius={[6, 6, 0, 0]} name="ROI %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { title: 'تقرير الرعاة', desc: 'ملخص شامل لجميع الرعاة ومستوياتهم', icon: Crown, date: '2026-03-28' },
                  { title: 'تقرير ROI', desc: 'تحليل العائد على الاستثمار لكل راعي', icon: TrendingUp, date: '2026-03-25' },
                  { title: 'تقرير الإيرادات', desc: 'تحليل إيرادات الرعايات والتحصيل', icon: DollarSign, date: '2026-03-20' },
                  { title: 'تقرير الأداء', desc: 'مؤشرات أداء حزم الرعاية', icon: BarChart3, date: '2026-03-15' },
                  { title: 'تقرير التجديد', desc: 'توقعات تجديد العقود والفرص', icon: Handshake, date: '2026-03-10' },
                  { title: 'تقرير AI التنبؤي', desc: 'توقعات الذكاء الاصطناعي لسوق الرعاية', icon: Zap, date: '2026-03-05' },
                ].map((report, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-3 sm:p-4 lg:p-5 hover:border-[rgba(201,168,76,0.2)] transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center group-hover:bg-[rgba(201,168,76,0.15)] transition-all"><report.icon size={18} className="text-[#C9A84C]" /></div>
                      <div className="flex-1"><h4 className="text-sm font-bold text-foreground">{report.title}</h4><p className="text-[10px] text-muted-foreground mt-0.5">{report.desc}</p></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {formatDate(report.date)}</span>
                      <button onClick={() => toast.info('تحميل — قريباً')} className="text-[10px] text-[#C9A84C] flex items-center gap-1 hover:opacity-80"><Download size={10} /> تحميل</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
