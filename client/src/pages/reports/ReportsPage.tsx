// Design: Nour Theme — Reports Module (Deepened)
// 4 tabs: Financial, Operational, Marketing, Custom
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, DollarSign, Settings, Megaphone, Plus,
  Download, Calendar, TrendingUp, BarChart3, PieChart,
  Eye, Clock, Printer, Filter, Search, RefreshCw,
  ArrowUpRight, ArrowDownRight, Target, Users, Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart as RPieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'financial', label: 'التقارير المالية', icon: DollarSign },
  { id: 'operational', label: 'التقارير التشغيلية', icon: Settings },
  { id: 'marketing', label: 'التقارير التسويقية', icon: Megaphone },
  { id: 'custom', label: 'تقارير مخصصة', icon: FileText },
]

const revenueMonthly = [
  { month: 'يناير', revenue: 2450000, expenses: 1800000, profit: 650000 },
  { month: 'فبراير', revenue: 3120000, expenses: 1950000, profit: 1170000 },
  { month: 'مارس', revenue: 4280000, expenses: 2200000, profit: 2080000 },
  { month: 'أبريل', revenue: 3890000, expenses: 2100000, profit: 1790000 },
  { month: 'مايو', revenue: 5020000, expenses: 2450000, profit: 2570000 },
  { month: 'يونيو', revenue: 4780000, expenses: 2300000, profit: 2480000 },
]

const revenueBySegment = [
  { name: 'إيجارات أجنحة', value: 42, color: '#C9A84C' },
  { name: 'رعايات', value: 28, color: '#3b82f6' },
  { name: 'تذاكر', value: 15, color: '#22c55e' },
  { name: 'خدمات إضافية', value: 10, color: '#f59e0b' },
  { name: 'أخرى', value: 5, color: '#8b5cf6' },
]

const financialReports = [
  { id: 1, name: 'تقرير الإيرادات الشهري', period: 'مارس 2026', generated: '2026-04-01', status: 'ready', size: '2.4 MB', type: 'PDF', revenue: 4250000, growth: 18 },
  { id: 2, name: 'تقرير المصروفات التفصيلي', period: 'مارس 2026', generated: '2026-04-01', status: 'ready', size: '1.8 MB', type: 'Excel', revenue: 2100000, growth: -5 },
  { id: 3, name: 'تقرير التدفق النقدي', period: 'Q1 2026', generated: '2026-04-01', status: 'processing', size: '—', type: 'PDF', revenue: 12500000, growth: 22 },
  { id: 4, name: 'تقرير الفواتير المستحقة', period: 'أبريل 2026', generated: '2026-04-01', status: 'ready', size: '890 KB', type: 'PDF', revenue: 1850000, growth: 0 },
  { id: 5, name: 'تقرير ZATCA الضريبي', period: 'Q1 2026', generated: '2026-03-31', status: 'ready', size: '3.1 MB', type: 'XML', revenue: 0, growth: 0 },
  { id: 6, name: 'تقرير العمولات والرسوم', period: 'مارس 2026', generated: '2026-04-01', status: 'ready', size: '1.2 MB', type: 'PDF', revenue: 890000, growth: 12 },
  { id: 7, name: 'تقرير التسويات البنكية', period: 'مارس 2026', generated: '2026-04-01', status: 'ready', size: '2.1 MB', type: 'Excel', revenue: 0, growth: 0 },
  { id: 8, name: 'تقرير الميزانية vs الفعلي', period: 'Q1 2026', generated: '2026-04-01', status: 'ready', size: '4.5 MB', type: 'PDF', revenue: 0, growth: 0 },
]

const occupancyData = [
  { month: 'يناير', rate: 72, events: 8 },
  { month: 'فبراير', rate: 78, events: 10 },
  { month: 'مارس', rate: 85, events: 12 },
  { month: 'أبريل', rate: 82, events: 11 },
  { month: 'مايو', rate: 91, events: 14 },
  { month: 'يونيو', rate: 88, events: 13 },
]

const operationalReports = [
  { id: 1, name: 'تقرير إشغال المعارض', metric: '88%', trend: 12, period: 'يونيو 2026', category: 'إشغال' },
  { id: 2, name: 'تقرير أداء الفرق', metric: '92%', trend: 5, period: 'يونيو 2026', category: 'أداء' },
  { id: 3, name: 'تقرير الصيانة والتجهيزات', metric: '15 طلب', trend: -8, period: 'يونيو 2026', category: 'صيانة' },
  { id: 4, name: 'تقرير الأمن والسلامة', metric: '0 حوادث', trend: 0, period: 'يونيو 2026', category: 'أمن' },
  { id: 5, name: 'تقرير رضا العملاء', metric: '4.3/5', trend: 3, period: 'يونيو 2026', category: 'رضا' },
  { id: 6, name: 'تقرير التصاريح والتراخيص', metric: '98%', trend: 2, period: 'يونيو 2026', category: 'تراخيص' },
  { id: 7, name: 'تقرير سلسلة التوريد', metric: '95%', trend: 4, period: 'يونيو 2026', category: 'توريد' },
  { id: 8, name: 'تقرير الحضور والحشود', metric: '12,450', trend: 18, period: 'يونيو 2026', category: 'حضور' },
]

const campaignPerformance = [
  { month: 'يناير', impressions: 1200000, clicks: 45000, conversions: 1800 },
  { month: 'فبراير', impressions: 1800000, clicks: 68000, conversions: 2500 },
  { month: 'مارس', impressions: 2500000, clicks: 95000, conversions: 3200 },
  { month: 'أبريل', impressions: 2200000, clicks: 82000, conversions: 2800 },
  { month: 'مايو', impressions: 3100000, clicks: 120000, conversions: 4100 },
  { month: 'يونيو', impressions: 3500000, clicks: 135000, conversions: 4800 },
]

const marketingReports = [
  { id: 1, name: 'تقرير أداء الحملات الرقمية', campaigns: 8, impressions: '2.5M', clicks: '125K', conversions: '3.2%', spend: 450000, roi: '320%' },
  { id: 2, name: 'تقرير السوشيال ميديا', campaigns: 12, impressions: '5.8M', clicks: '320K', conversions: '1.8%', spend: 180000, roi: '580%' },
  { id: 3, name: 'تقرير البريد الإلكتروني', campaigns: 6, impressions: '45K', clicks: '8.5K', conversions: '12%', spend: 25000, roi: '890%' },
  { id: 4, name: 'تقرير Google Ads', campaigns: 4, impressions: '1.2M', clicks: '48K', conversions: '2.8%', spend: 320000, roi: '210%' },
  { id: 5, name: 'تقرير المحتوى والـ SEO', campaigns: 3, impressions: '850K', clicks: '42K', conversions: '4.5%', spend: 85000, roi: '450%' },
]

const channelDistribution = [
  { name: 'Google Ads', value: 35, color: '#C9A84C' },
  { name: 'سوشيال ميديا', value: 28, color: '#3b82f6' },
  { name: 'بريد إلكتروني', value: 18, color: '#22c55e' },
  { name: 'محتوى SEO', value: 12, color: '#f59e0b' },
  { name: 'إحالات', value: 7, color: '#8b5cf6' },
]

const customReports = [
  { id: 1, name: 'تقرير ROI المستثمرين', creator: 'أحمد الراشد', created: '2026-03-28', schedule: 'أسبوعي', lastRun: '2026-04-01', recipients: 5, format: 'PDF' },
  { id: 2, name: 'تقرير KYC التجار', creator: 'سارة العلي', created: '2026-03-15', schedule: 'يومي', lastRun: '2026-04-01', recipients: 3, format: 'Excel' },
  { id: 3, name: 'تقرير تسليمات الرعاة', creator: 'خالد الحربي', created: '2026-03-20', schedule: 'شهري', lastRun: '2026-04-01', recipients: 8, format: 'PDF' },
  { id: 4, name: 'تقرير مقارنة الفعاليات', creator: 'نور كرم', created: '2026-02-10', schedule: 'ربع سنوي', lastRun: '2026-04-01', recipients: 12, format: 'Dashboard' },
  { id: 5, name: 'تقرير أداء المناطق', creator: 'فاطمة أحمد', created: '2026-03-01', schedule: 'أسبوعي', lastRun: '2026-04-01', recipients: 6, format: 'PDF' },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('financial')

  return (
    <AdminLayout>
      <PageHeader title="التقارير" subtitle="التقارير المالية والتشغيلية والتسويقية والمخصصة" actions={
        <div className="flex gap-2">
          <button onClick={() => toast.info('جدولة تقرير — قريباً')} className="h-9 px-4 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"><Clock size={14} /> جدولة</button>
          <button onClick={() => toast.info('تقرير مخصص — قريباً')} className="h-9 px-4 rounded-xl bg-gradient-to-l from-gold via-gold-light to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all flex items-center gap-2"><Plus size={16} /> تقرير مخصص</button>
        </div>
      } />

      <div className="flex gap-1 p-1 bg-card/50 rounded-xl border border-border/50 overflow-x-auto mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/20 shadow-lg' : 'text-muted-foreground hover:text-foreground hover:bg-surface2/50')}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي الإيرادات H1" value="23.5M" icon={DollarSign} trend={22} trendLabel="نمو" delay={0} />
                <StatsCard title="صافي الربح" value="10.7M" icon={TrendingUp} trend={15} trendLabel="زيادة" delay={0.1} />
                <StatsCard title="تقارير جاهزة" value="7" icon={FileText} delay={0.2} />
                <StatsCard title="قيد المعالجة" value="1" icon={Clock} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">الإيرادات vs المصروفات vs الأرباح</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenueMonthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="revenue" fill="#C9A84C" name="الإيرادات" radius={[4,4,0,0]} />
                      <Bar dataKey="expenses" fill="rgba(201,168,76,0.25)" name="المصروفات" radius={[4,4,0,0]} />
                      <Bar dataKey="profit" fill="#22c55e" name="الأرباح" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">توزيع الإيرادات</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RPieChart>
                      <Pie data={revenueBySegment} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                        {revenueBySegment.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => `${v}%`} />
                    </RPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {revenueBySegment.map(s => (
                      <div key={s.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                        <span className="font-mono text-foreground">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {financialReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', r.status === 'ready' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}><FileText size={18} /></div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{r.name}</h4>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {r.period}</span>
                            <span className="text-[10px] text-muted-foreground">{r.type} • {r.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {r.revenue > 0 && <span className="text-sm font-mono font-bold text-foreground">{formatCurrency(r.revenue)}</span>}
                        {r.growth !== 0 && <span className={cn('text-[10px] font-bold flex items-center gap-0.5', r.growth > 0 ? 'text-success' : 'text-danger')}>{r.growth > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(r.growth)}%</span>}
                        <button onClick={() => toast.info('تحميل التقرير — قريباً')} className={cn('h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1 transition-all', r.status === 'ready' ? 'bg-gold/10 text-gold hover:bg-gold/20' : 'bg-surface2 text-muted-foreground cursor-not-allowed')}>
                          <Download size={12} /> {r.status === 'ready' ? 'تحميل' : 'جاري...'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'operational' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="معدل الإشغال" value="88%" icon={Target} trend={12} trendLabel="زيادة" delay={0} />
                <StatsCard title="رضا العملاء" value="4.3/5" icon={Users} trend={3} trendLabel="تحسن" delay={0.1} />
                <StatsCard title="الفعاليات النشطة" value="13" icon={Activity} trend={8} trendLabel="جديدة" delay={0.2} />
                <StatsCard title="حوادث أمنية" value="0" icon={FileText} delay={0.3} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-foreground mb-4">معدل الإشغال وعدد الفعاليات — 6 أشهر</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v}%`} />
                    <YAxis yAxisId="right" orientation="left" tick={{ fontSize: 10, fill: '#888' }} />
                    <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar yAxisId="left" dataKey="rate" fill="#C9A84C" name="الإشغال %" radius={[4,4,0,0]} />
                    <Line yAxisId="right" type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} name="الفعاليات" dot={{ fill: '#3b82f6', r: 4 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {operationalReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 hover:border-gold/30 transition-colors cursor-pointer" onClick={() => toast.info(`عرض ${r.name} — قريباً`)}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">{r.category}</span>
                      <span className="text-[10px] text-muted-foreground">{r.period}</span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground mb-2">{r.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gold">{r.metric}</span>
                      {r.trend !== 0 && <span className={cn('text-xs font-bold flex items-center gap-1', r.trend > 0 ? 'text-success' : 'text-danger')}><TrendingUp size={12} className={r.trend < 0 ? 'rotate-180' : ''} /> {r.trend > 0 ? '+' : ''}{r.trend}%</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="إجمالي المشاهدات" value="14.3M" icon={Eye} trend={45} trendLabel="نمو" delay={0} />
                <StatsCard title="إجمالي النقرات" value="618K" icon={Target} trend={32} trendLabel="زيادة" delay={0.1} />
                <StatsCard title="معدل التحويل" value="3.8%" icon={TrendingUp} trend={12} trendLabel="تحسن" delay={0.2} />
                <StatsCard title="إجمالي الإنفاق" value={formatCurrency(1060000)} icon={DollarSign} delay={0.3} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">أداء الحملات — 6 أشهر</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={campaignPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" dataKey="impressions" stroke="#C9A84C" fill="rgba(201,168,76,0.1)" name="المشاهدات" />
                      <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" name="النقرات" />
                      <Area type="monotone" dataKey="conversions" stroke="#22c55e" fill="rgba(34,197,94,0.1)" name="التحويلات" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">توزيع القنوات</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RPieChart>
                      <Pie data={channelDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                        {channelDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => `${v}%`} />
                    </RPieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {channelDistribution.map(c => (
                      <div key={c.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-muted-foreground">{c.name}</span></div>
                        <span className="font-mono text-foreground">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border/50 bg-surface2/20">
                    {['التقرير', 'الحملات', 'المشاهدات', 'النقرات', 'التحويل', 'الإنفاق', 'ROI'].map(h => (
                      <th key={h} className="text-right p-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {marketingReports.map((r, i) => (
                      <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-border/20 hover:bg-surface2/30 transition-colors cursor-pointer">
                        <td className="p-3 text-sm font-bold text-foreground">{r.name}</td>
                        <td className="p-3 text-sm text-muted-foreground">{r.campaigns}</td>
                        <td className="p-3 text-sm font-mono text-foreground">{r.impressions}</td>
                        <td className="p-3 text-sm font-mono text-foreground">{r.clicks}</td>
                        <td className="p-3"><span className="text-sm font-bold text-gold">{r.conversions}</span></td>
                        <td className="p-3 text-sm font-mono text-warning">{formatCurrency(r.spend)}</td>
                        <td className="p-3"><span className="text-sm font-bold text-success">{r.roi}</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="تقارير مخصصة" value="5" icon={FileText} delay={0} />
                <StatsCard title="مجدولة" value="4" icon={Clock} delay={0.1} />
                <StatsCard title="مستلمون" value="34" icon={Users} delay={0.2} />
              </div>
              <div className="space-y-3">
                {customReports.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5 hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><PieChart size={18} className="text-gold" /></div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{r.name}</h4>
                          <p className="text-[10px] text-muted-foreground">أنشأه: {r.creator} • {formatDate(r.created)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-[10px] text-muted-foreground">الجدولة</p>
                          <p className="text-xs font-bold text-foreground">{r.schedule}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-muted-foreground">الصيغة</p>
                          <p className="text-xs font-mono text-foreground">{r.format}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-muted-foreground">مستلمون</p>
                          <p className="text-xs font-bold text-foreground">{r.recipients}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-muted-foreground">آخر تشغيل</p>
                          <p className="text-xs font-mono text-foreground">{formatDate(r.lastRun)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toast.info('تشغيل الآن — قريباً')} className="h-8 px-3 rounded-lg bg-surface2/50 text-xs font-medium text-foreground hover:bg-surface2 transition-all flex items-center gap-1"><RefreshCw size={12} /> تشغيل</button>
                          <button onClick={() => toast.info('عرض التقرير — قريباً')} className="h-8 px-3 rounded-lg bg-gold/10 text-xs font-medium text-gold hover:bg-gold/20 transition-all flex items-center gap-1"><Eye size={12} /> عرض</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  )
}
