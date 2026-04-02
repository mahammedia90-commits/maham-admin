/*
 * Dashboard — CEO Command Center
 * Design: Nour Theme — Liquid Gold Executive
 * مركز القيادة الرئيسي للمنظومة بالكامل
 * تعميق: AI Predictions + Crowd Live + Real-time Tickers + System Health
 */
import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '@/components/layout/AdminLayout'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency, formatNumber, DASHBOARD_HERO_URL } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import {
  Calendar, Users, DollarSign, TrendingUp, Building2, Briefcase,
  Handshake, Brain, AlertTriangle, CheckCircle2, Clock, ArrowUpRight,
  Activity, Eye, FileText, Shield, Zap, BarChart3, Target, Globe,
  Settings, Cpu, Radio, MapPin, ThermometerSun, Wifi, WifiOff,
  TrendingDown, AlertCircle, Gauge, Server, Database, Lock,
  RefreshCw, ArrowRight, Flame, Snowflake, Crown, Star
} from 'lucide-react'

// ═══════════════════════════════════════════════════════
// DATA — Revenue & Charts
// ═══════════════════════════════════════════════════════
const revenueData = [
  { month: 'يناير', revenue: 245000, expenses: 180000, profit: 65000 },
  { month: 'فبراير', revenue: 312000, expenses: 195000, profit: 117000 },
  { month: 'مارس', revenue: 428000, expenses: 220000, profit: 208000 },
  { month: 'أبريل', revenue: 389000, expenses: 210000, profit: 179000 },
  { month: 'مايو', revenue: 502000, expenses: 245000, profit: 257000 },
  { month: 'يونيو', revenue: 478000, expenses: 230000, profit: 248000 },
]

const revenueSourceData = [
  { name: 'إيجارات الأجنحة', value: 42, color: '#C9A84C' },
  { name: 'رعايات', value: 28, color: '#A8893A' },
  { name: 'تذاكر', value: 15, color: '#D4B96E' },
  { name: 'خدمات إضافية', value: 10, color: '#8B7332' },
  { name: 'أخرى', value: 5, color: '#E5D4A1' },
]

const userGrowthData = [
  { month: 'يناير', investors: 45, merchants: 120, sponsors: 18 },
  { month: 'فبراير', investors: 52, merchants: 145, sponsors: 22 },
  { month: 'مارس', investors: 68, merchants: 178, sponsors: 28 },
  { month: 'أبريل', investors: 75, merchants: 195, sponsors: 32 },
  { month: 'مايو', investors: 89, merchants: 230, sponsors: 38 },
  { month: 'يونيو', investors: 102, merchants: 268, sponsors: 45 },
]

const occupancyData = [
  { month: 'يناير', rate: 72 },
  { month: 'فبراير', rate: 78 },
  { month: 'مارس', rate: 85 },
  { month: 'أبريل', rate: 82 },
  { month: 'مايو', rate: 91 },
  { month: 'يونيو', rate: 88 },
]

// ═══════════════════════════════════════════════════════
// DATA — AI Predictions
// ═══════════════════════════════════════════════════════
const aiPredictions = [
  { id: 1, title: 'توقع إيرادات يوليو', prediction: '542,000 ر.س', confidence: 92, trend: 'up' as const, detail: 'بناءً على نمط الأشهر الـ 6 الماضية + موسمية الصيف', icon: DollarSign },
  { id: 2, title: 'احتمال تجديد الرعاة', prediction: '78%', confidence: 85, trend: 'up' as const, detail: '35 من 45 راعي متوقع تجديدهم — 3 بحاجة تدخل فوري', icon: Handshake },
  { id: 3, title: 'توقع الطلب على الأجنحة', prediction: 'ارتفاع 15%', confidence: 88, trend: 'up' as const, detail: 'الأسبوع القادم سيشهد زيادة في الطلب بسبب معرض التقنية', icon: TrendingUp },
  { id: 4, title: 'مخاطر التأخر في الدفع', prediction: '12 عميل', confidence: 79, trend: 'down' as const, detail: '12 عميل لديهم احتمال تأخر > 70% — يُنصح بالتواصل المبكر', icon: AlertTriangle },
  { id: 5, title: 'معدل رضا العملاء المتوقع', prediction: '4.6/5', confidence: 91, trend: 'up' as const, detail: 'تحسن مستمر بفضل نظام الدعم 360 — أعلى من المتوسط الصناعي', icon: Star },
]

// ═══════════════════════════════════════════════════════
// DATA — Live Crowd Monitoring
// ═══════════════════════════════════════════════════════
const crowdZones = [
  { id: 1, zone: 'القاعة الرئيسية A', current: 1250, capacity: 1500, temp: 23, status: 'normal' as const },
  { id: 2, zone: 'جناح التقنية B', current: 890, capacity: 1000, temp: 24, status: 'warning' as const },
  { id: 3, zone: 'منطقة الطعام C', current: 420, capacity: 800, temp: 22, status: 'normal' as const },
  { id: 4, zone: 'قاعة المؤتمرات D', current: 380, capacity: 400, temp: 25, status: 'critical' as const },
  { id: 5, zone: 'المدخل الرئيسي', current: 156, capacity: 500, temp: 28, status: 'normal' as const },
  { id: 6, zone: 'منطقة VIP', current: 45, capacity: 100, temp: 21, status: 'normal' as const },
]

// ═══════════════════════════════════════════════════════
// DATA — System Health
// ═══════════════════════════════════════════════════════
const systemModules = [
  { name: 'ERP المالي', status: 'online' as const, uptime: 99.97, latency: 45, icon: DollarSign },
  { name: 'CRM', status: 'online' as const, uptime: 99.92, latency: 62, icon: Users },
  { name: 'العقل التنفيذي AI', status: 'online' as const, uptime: 99.85, latency: 120, icon: Brain },
  { name: 'بوابة المستثمر', status: 'online' as const, uptime: 99.99, latency: 38, icon: Building2 },
  { name: 'بوابة التاجر', status: 'online' as const, uptime: 99.98, latency: 42, icon: Briefcase },
  { name: 'نظام العقود', status: 'warning' as const, uptime: 98.5, latency: 250, icon: FileText },
  { name: 'ZATCA Integration', status: 'online' as const, uptime: 99.7, latency: 180, icon: Shield },
  { name: 'قاعدة البيانات', status: 'online' as const, uptime: 99.99, latency: 12, icon: Database },
]

const radarData = [
  { subject: 'المالية', score: 92 },
  { subject: 'المبيعات', score: 85 },
  { subject: 'التسويق', score: 78 },
  { subject: 'العمليات', score: 88 },
  { subject: 'الموارد البشرية', score: 82 },
  { subject: 'القانونية', score: 90 },
]

// ═══════════════════════════════════════════════════════
// DATA — Pending & Alerts & Activity
// ═══════════════════════════════════════════════════════
const pendingRequests = [
  { id: 1, type: 'طلب إنشاء فعالية', from: 'أحمد المالكي', role: 'مستثمر', time: 'منذ 2 ساعة', priority: 'عالية' },
  { id: 2, type: 'طلب حجز جناح', from: 'شركة النور للتجارة', role: 'تاجر', time: 'منذ 3 ساعات', priority: 'متوسطة' },
  { id: 3, type: 'طلب رعاية ذهبية', from: 'مجموعة الراجحي', role: 'راعي', time: 'منذ 5 ساعات', priority: 'عالية' },
  { id: 4, type: 'تحقق KYC', from: 'محمد العتيبي', role: 'تاجر', time: 'منذ 6 ساعات', priority: 'عادية' },
  { id: 5, type: 'طلب تعديل عقد', from: 'فهد القحطاني', role: 'مستثمر', time: 'منذ 8 ساعات', priority: 'متوسطة' },
]

const aiAlerts = [
  { id: 1, type: 'warning', icon: AlertTriangle, title: 'شذوذ مالي مكتشف', desc: 'انخفاض غير طبيعي في إيرادات القسم B3 بنسبة 23%', time: 'منذ 30 دقيقة' },
  { id: 2, type: 'info', icon: Target, title: 'فرصة نمو', desc: 'AI يوصي بزيادة أسعار الأجنحة في المنطقة A بنسبة 12%', time: 'منذ ساعة' },
  { id: 3, type: 'success', icon: CheckCircle2, title: 'KYC مكتمل', desc: '15 تاجر أكملوا التحقق من الهوية اليوم', time: 'منذ 2 ساعة' },
  { id: 4, type: 'warning', icon: Users, title: 'سعة حشود', desc: 'الفعالية #12 وصلت 85% من السعة القصوى — مراقبة مطلوبة', time: 'منذ 3 ساعات' },
]

const recentActivity = [
  { id: 1, action: 'تمت الموافقة على طلب إنشاء فعالية', user: 'نور كرم', time: 'منذ 15 دقيقة', icon: CheckCircle2, color: 'text-emerald-400' },
  { id: 2, action: 'تم إصدار فاتورة #INV-2024-0892', user: 'النظام المالي', time: 'منذ 30 دقيقة', icon: FileText, color: 'text-gold' },
  { id: 3, action: 'مستثمر جديد أكمل التسجيل', user: 'خالد الشمري', time: 'منذ ساعة', icon: Building2, color: 'text-blue-400' },
  { id: 4, action: 'تم تحديث حالة العقد #C-2024-156', user: 'إدارة العقود', time: 'منذ 2 ساعة', icon: Shield, color: 'text-purple-400' },
  { id: 5, action: 'تنبيه AI: توقع ارتفاع الطلب الأسبوع القادم', user: 'العقل التنفيذي', time: 'منذ 3 ساعات', icon: Brain, color: 'text-gold' },
  { id: 6, action: 'تم إغلاق تذكرة دعم #T-4521', user: 'خدمة العملاء', time: 'منذ 4 ساعات', icon: CheckCircle2, color: 'text-emerald-400' },
]

const portalStatus = [
  { name: 'بوابة المستثمر', domain: 'investor.mahamexpo.sa', status: 'نشط', users: 102, icon: Building2, path: '/portal/investor', color: 'from-blue-500/20 to-blue-600/5' },
  { name: 'بوابة التاجر', domain: 'merchant.mahamexpo.sa', status: 'نشط', users: 268, icon: Briefcase, path: '/portal/merchant', color: 'from-emerald-500/20 to-emerald-600/5' },
  { name: 'بوابة الراعي', domain: 'sponsor.mahamexpo.sa', status: 'نشط', users: 45, icon: Handshake, path: '/portal/sponsor', color: 'from-purple-500/20 to-purple-600/5' },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

// ═══════════════════════════════════════════════════════
// Real-time Ticker Component
// ═══════════════════════════════════════════════════════
function LiveTicker() {
  const [tick, setTick] = useState(0)
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 3000); return () => clearInterval(t) }, [])
  const items = [
    { label: 'إيرادات اليوم', value: `${(78500 + tick * 150).toLocaleString()} ر.س`, icon: DollarSign, color: 'text-emerald-400' },
    { label: 'زوار الآن', value: `${3141 + (tick % 20) * 7}`, icon: Users, color: 'text-blue-400' },
    { label: 'عقود اليوم', value: `${4 + (tick % 3)}`, icon: FileText, color: 'text-gold' },
    { label: 'تذاكر مباعة', value: `${1250 + tick * 3}`, icon: Activity, color: 'text-purple-400' },
    { label: 'AI Score', value: '87.4', icon: Brain, color: 'text-gold' },
    { label: 'SLA الدعم', value: '98.2%', icon: Gauge, color: 'text-emerald-400' },
  ]
  return (
    <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/30 border border-border/30 shrink-0 min-w-[160px]">
          <item.icon size={14} className={item.color} />
          <div>
            <p className="text-[9px] text-muted-foreground">{item.label}</p>
            <p className={cn('text-sm font-bold font-mono', item.color)}>{item.value}</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-auto" />
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function DashboardPage() {
  const [, navigate] = useLocation()
  const [activeChart, setActiveChart] = useState<'revenue' | 'growth' | 'occupancy'>('revenue')
  const [dashSection, setDashSection] = useState<'overview' | 'crowd' | 'predictions' | 'health'>('overview')
  const aiHealthScore = 87

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Hero Banner */}
        <motion.div {...fadeUp} className="relative rounded-2xl overflow-hidden border border-gold/15">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${DASHBOARD_HERO_URL})` }} />
          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-black/50" />
          <div className="relative p-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">مركز القيادة</h1>
              <p className="text-white/80 text-lg drop-shadow-md">المنظومة تعمل بكفاءة {aiHealthScore}% — العقل التنفيذي نشط</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#healthGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${aiHealthScore * 2.64} 264`} />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C9A84C" />
                      <stop offset="100%" stopColor="#D4B96E" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gold">{aiHealthScore}</span>
                  <span className="text-[9px] text-white/50">صحة النظام</span>
                </div>
              </div>
              <button onClick={() => navigate('/ai')} className="px-5 py-2.5 rounded-xl bg-gold/15 border border-gold/25 text-gold hover:bg-gold/25 transition-all text-sm font-medium flex items-center gap-2">
                <Brain size={16} />
                العقل التنفيذي
              </button>
            </div>
          </div>
        </motion.div>

        {/* Live Ticker */}
        <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
          <LiveTicker />
        </motion.div>

        {/* KPI Stats */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard title="إجمالي الإيرادات" value="2.35M" icon={DollarSign} trend={18.5} trendLabel="عن الشهر السابق" />
          <StatsCard title="الفعاليات النشطة" value="12" icon={Calendar} trend={8} trendLabel="فعاليات جديدة" delay={0.05} />
          <StatsCard title="المستثمرون" value="102" icon={Building2} trend={15} trendLabel="مستثمر جديد" delay={0.1} />
          <StatsCard title="التجار" value="268" icon={Briefcase} trend={22} trendLabel="تاجر جديد" delay={0.15} />
          <StatsCard title="الرعاة" value="45" icon={Handshake} trend={12} trendLabel="راعي جديد" delay={0.2} />
          <StatsCard title="معدل الإشغال" value="88%" icon={Target} trend={5} trendLabel="عن الشهر السابق" delay={0.25} />
        </motion.div>

        {/* Dashboard Section Tabs */}
        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="flex gap-2 bg-card/30 rounded-xl p-1.5 border border-border/30 overflow-x-auto">
          {([
            { key: 'overview' as const, label: 'نظرة عامة', icon: Eye },
            { key: 'crowd' as const, label: 'مراقبة الحشود الحية', icon: Radio },
            { key: 'predictions' as const, label: 'تنبؤات AI', icon: Brain },
            { key: 'health' as const, label: 'صحة الأنظمة', icon: Server },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setDashSection(tab.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap', dashSection === tab.key ? 'bg-gold/15 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground hover:bg-card/50')}>
              <tab.icon size={14} />
              {tab.label}
              {tab.key === 'crowd' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION: Overview */}
          {/* ═══════════════════════════════════════════════════════ */}
          {dashSection === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts - 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card rounded-2xl p-6 border border-gold/10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-foreground">التحليلات المالية</h3>
                      <div className="flex gap-1 bg-card/50 rounded-lg p-1 border border-border/50">
                        {([
                          { key: 'revenue' as const, label: 'الإيرادات' },
                          { key: 'growth' as const, label: 'النمو' },
                          { key: 'occupancy' as const, label: 'الإشغال' },
                        ]).map(tab => (
                          <button key={tab.key} onClick={() => setActiveChart(tab.key)} className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all', activeChart === tab.key ? 'bg-gold/15 text-gold border border-gold/20' : 'text-muted-foreground hover:text-foreground')}>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        {activeChart === 'revenue' ? (
                          <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px' }} formatter={(value: number) => [`${value.toLocaleString()} ر.س`, '']} />
                            <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: '11px' }} />
                            <Bar dataKey="revenue" name="الإيرادات" fill="#C9A84C" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="expenses" name="المصروفات" fill="rgba(201,168,76,0.25)" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="profit" name="الأرباح" fill="#D4B96E" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        ) : activeChart === 'growth' ? (
                          <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="investors" name="المستثمرون" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 4 }} />
                            <Line type="monotone" dataKey="merchants" name="التجار" stroke="#34D399" strokeWidth={2} dot={{ fill: '#34D399', r: 4 }} />
                            <Line type="monotone" dataKey="sponsors" name="الرعاة" stroke="#C084FC" strokeWidth={2} dot={{ fill: '#C084FC', r: 4 }} />
                          </LineChart>
                        ) : (
                          <AreaChart data={occupancyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                            <YAxis stroke="var(--muted-foreground)" fontSize={11} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
                            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, 'معدل الإشغال']} />
                            <defs>
                              <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="rate" stroke="#C9A84C" strokeWidth={2} fill="url(#occupancyGrad)" dot={{ fill: '#C9A84C', r: 4 }} />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Sources + Portal Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl p-6 border border-gold/10">
                      <h3 className="text-sm font-bold text-foreground mb-4">توزيع الإيرادات</h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RPieChart>
                            <Pie data={revenueSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                              {revenueSourceData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
                            </Pie>
                            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, '']} />
                          </RPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 mt-2">
                        {revenueSourceData.map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="font-mono text-foreground">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 border border-gold/10">
                      <h3 className="text-sm font-bold text-foreground mb-4">حالة البوابات</h3>
                      <div className="space-y-3">
                        {portalStatus.map((portal) => (
                          <button key={portal.name} onClick={() => navigate(portal.path)} className={cn('w-full p-4 rounded-xl border border-gold/10 hover:border-gold/25 transition-all group text-right', `bg-gradient-to-l ${portal.color}`)}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <portal.icon size={16} className="text-gold/70" />
                                <span className="text-sm font-medium text-foreground">{portal.name}</span>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{portal.status}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{portal.domain}</span>
                              <span className="text-xs text-muted-foreground"><Users size={12} className="inline ml-1" />{portal.users} مستخدم</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Pending Requests */}
                  <div className="glass-card rounded-2xl p-6 border border-gold/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground">طلبات تحتاج موافقة</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">{pendingRequests.length} معلق</span>
                    </div>
                    <div className="space-y-3">
                      {pendingRequests.map((req) => (
                        <div key={req.id} className="p-3 rounded-xl bg-card/30 border border-border/30 hover:border-gold/15 transition-all">
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-xs font-medium text-foreground">{req.type}</span>
                            <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full', req.priority === 'عالية' ? 'bg-red-500/15 text-red-400' : req.priority === 'متوسطة' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400')}>{req.priority}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{req.from} — {req.role}</span>
                            <span className="text-[10px] text-muted-foreground">{req.time}</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => navigate('/requests')} className="flex-1 text-[10px] py-1.5 rounded-lg bg-gold/12 text-gold hover:bg-gold/22 transition-all border border-gold/20 font-semibold">مراجعة</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => navigate('/requests')} className="w-full mt-3 text-xs text-gold/70 hover:text-gold transition-all py-2.5 rounded-xl hover:bg-gold/8 border border-transparent hover:border-gold/15 font-medium">عرض كل الطلبات ←</button>
                  </div>

                  {/* AI Alerts */}
                  <div className="glass-card rounded-2xl p-6 border border-gold/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Brain size={14} className="text-gold" />
                        تنبيهات ذكية
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {aiAlerts.map((alert) => (
                        <div key={alert.id} className={cn('p-3 rounded-xl border transition-all', alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/15' : alert.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-blue-500/5 border-blue-500/15')}>
                          <div className="flex items-start gap-2.5">
                            <alert.icon size={14} className={cn('mt-0.5 shrink-0', alert.type === 'warning' ? 'text-amber-400' : alert.type === 'success' ? 'text-emerald-400' : 'text-blue-400')} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground">{alert.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{alert.desc}</p>
                              <p className="text-[9px] text-muted-foreground/60 mt-1">{alert.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-card rounded-2xl p-6 border border-gold/10">
                    <h3 className="text-sm font-bold text-foreground mb-4">النشاط الأخير</h3>
                    <div className="space-y-3">
                      {recentActivity.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center shrink-0 mt-0.5">
                            <item.icon size={13} className={item.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground leading-relaxed">{item.action}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gold/60">{item.user}</span>
                              <span className="text-[10px] text-muted-foreground">{item.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION: Live Crowd Monitoring */}
          {/* ═══════════════════════════════════════════════════════ */}
          {dashSection === 'crowd' && (
            <motion.div key="crowd" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Crowd Summary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card rounded-xl p-4 border border-gold/10">
                  <div className="flex items-center gap-2 mb-2"><Users size={16} className="text-gold" /><span className="text-xs text-muted-foreground">إجمالي الزوار الآن</span></div>
                  <p className="text-2xl font-bold text-foreground font-mono">3,141</p>
                  <p className="text-[10px] text-emerald-400 mt-1">+12% عن نفس الوقت أمس</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-gold/10">
                  <div className="flex items-center gap-2 mb-2"><MapPin size={16} className="text-blue-400" /><span className="text-xs text-muted-foreground">المناطق النشطة</span></div>
                  <p className="text-2xl font-bold text-foreground font-mono">6/8</p>
                  <p className="text-[10px] text-muted-foreground mt-1">منطقتان مغلقتان للصيانة</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-gold/10">
                  <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-amber-400" /><span className="text-xs text-muted-foreground">تنبيهات السعة</span></div>
                  <p className="text-2xl font-bold text-amber-400 font-mono">2</p>
                  <p className="text-[10px] text-amber-400 mt-1">منطقتان تجاوزتا 85%</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-gold/10">
                  <div className="flex items-center gap-2 mb-2"><ThermometerSun size={16} className="text-orange-400" /><span className="text-xs text-muted-foreground">متوسط الحرارة</span></div>
                  <p className="text-2xl font-bold text-foreground font-mono">23.8°C</p>
                  <p className="text-[10px] text-emerald-400 mt-1">ضمن النطاق المثالي</p>
                </div>
              </div>

              {/* Crowd Zones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crowdZones.map((zone) => {
                  const pct = Math.round((zone.current / zone.capacity) * 100)
                  const isWarning = pct >= 80 && pct < 95
                  const isCritical = pct >= 95
                  return (
                    <div key={zone.id} className={cn('glass-card rounded-xl p-5 border transition-all', isCritical ? 'border-red-500/30 bg-red-500/5' : isWarning ? 'border-amber-500/20 bg-amber-500/5' : 'border-gold/10')}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-foreground">{zone.zone}</h4>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', isCritical ? 'bg-red-500/15 text-red-400 border-red-500/20' : isWarning ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20')}>
                          {isCritical ? 'حرج' : isWarning ? 'تحذير' : 'طبيعي'}
                        </span>
                      </div>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <p className="text-3xl font-bold text-foreground font-mono">{zone.current.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">من {zone.capacity.toLocaleString()} كحد أقصى</p>
                        </div>
                        <div className="text-left">
                          <p className={cn('text-xl font-bold font-mono', isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400')}>{pct}%</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><ThermometerSun size={10} />{zone.temp}°C</p>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-card/50 overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', isCritical ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-emerald-400')} style={{ width: `${pct}%` }} />
                      </div>
                      {(isWarning || isCritical) && (
                        <div className={cn('mt-3 p-2 rounded-lg text-[10px] flex items-center gap-2', isCritical ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400')}>
                          <AlertTriangle size={12} />
                          {isCritical ? 'يجب تحويل الزوار فوراً — السعة القصوى وشيكة' : 'مراقبة مطلوبة — الاقتراب من الحد الأقصى'}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Crowd Flow Timeline */}
              <div className="glass-card rounded-2xl p-6 border border-gold/10">
                <h3 className="text-sm font-bold text-foreground mb-4">تدفق الزوار — آخر 12 ساعة</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '06:00', visitors: 120 }, { time: '07:00', visitors: 350 }, { time: '08:00', visitors: 890 },
                      { time: '09:00', visitors: 1450 }, { time: '10:00', visitors: 2100 }, { time: '11:00', visitors: 2800 },
                      { time: '12:00', visitors: 3100 }, { time: '13:00', visitors: 2900 }, { time: '14:00', visitors: 3141 },
                      { time: '15:00', visitors: 2800 }, { time: '16:00', visitors: 2200 }, { time: '17:00', visitors: 1500 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={11} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px' }} />
                      <defs>
                        <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="visitors" stroke="#C9A84C" strokeWidth={2} fill="url(#crowdGrad)" dot={{ fill: '#C9A84C', r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION: AI Predictions */}
          {/* ═══════════════════════════════════════════════════════ */}
          {dashSection === 'predictions' && (
            <motion.div key="predictions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiPredictions.map((pred) => (
                  <div key={pred.id} className="glass-card rounded-xl p-5 border border-gold/10 hover:border-gold/25 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <pred.icon size={18} className="text-gold" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">ثقة</span>
                        <span className={cn('text-xs font-bold font-mono', pred.confidence >= 90 ? 'text-emerald-400' : pred.confidence >= 80 ? 'text-gold' : 'text-amber-400')}>{pred.confidence}%</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{pred.title}</h4>
                    <p className={cn('text-xl font-bold font-mono mb-2', pred.trend === 'up' ? 'text-emerald-400' : 'text-red-400')}>
                      {pred.trend === 'up' ? <TrendingUp size={16} className="inline ml-1" /> : <TrendingDown size={16} className="inline ml-1" />}
                      {pred.prediction}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{pred.detail}</p>
                    <div className="mt-3 w-full h-1.5 rounded-full bg-card/50 overflow-hidden">
                      <div className={cn('h-full rounded-full', pred.confidence >= 90 ? 'bg-emerald-400' : pred.confidence >= 80 ? 'bg-gold' : 'bg-amber-400')} style={{ width: `${pred.confidence}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-gold/10">
                  <h3 className="text-sm font-bold text-foreground mb-4">أداء الأقسام — رادار AI</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'Cairo' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)', fontSize: 9 }} />
                        <Radar name="الأداء" dataKey="score" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-gold/10">
                  <h3 className="text-sm font-bold text-foreground mb-4">توصيات AI التنفيذية</h3>
                  <div className="space-y-3">
                    {[
                      { priority: 'عالية', title: 'زيادة أسعار المنطقة A بنسبة 12%', reason: 'الطلب يفوق العرض بـ 3x — فرصة إيرادات 180K ر.س', action: 'تطبيق فوري', color: 'border-red-500/20 bg-red-500/5' },
                      { priority: 'عالية', title: 'التواصل مع 12 عميل متأخر بالدفع', reason: 'إجمالي المبالغ المعلقة: 890,000 ر.س — خطر تأخر > 30 يوم', action: 'إرسال تذكيرات', color: 'border-amber-500/20 bg-amber-500/5' },
                      { priority: 'متوسطة', title: 'توظيف 3 مندوبي مبيعات إضافيين', reason: 'نسبة العملاء/المندوب = 45:1 — المعيار المثالي 30:1', action: 'فتح شواغر', color: 'border-blue-500/20 bg-blue-500/5' },
                      { priority: 'متوسطة', title: 'إطلاق حملة تسويقية لمعرض التقنية', reason: 'الحدث بعد 3 أسابيع — الحجوزات عند 62% فقط', action: 'إعداد الحملة', color: 'border-purple-500/20 bg-purple-500/5' },
                      { priority: 'منخفضة', title: 'تحديث قوالب العقود', reason: '3 قوالب لم تُحدث منذ 6 أشهر — تغييرات ZATCA جديدة', action: 'مراجعة قانونية', color: 'border-gold/20 bg-gold/5' },
                    ].map((rec, i) => (
                      <div key={i} className={cn('p-3 rounded-xl border', rec.color)}>
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-bold text-foreground">{rec.title}</span>
                          <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full', rec.priority === 'عالية' ? 'bg-red-500/15 text-red-400' : rec.priority === 'متوسطة' ? 'bg-blue-500/15 text-blue-400' : 'bg-gold/15 text-gold')}>{rec.priority}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{rec.reason}</p>
                        <button className="mt-2 text-[10px] text-gold hover:text-gold/80 font-medium flex items-center gap-1">
                          <Zap size={10} />{rec.action} <ArrowRight size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION: System Health */}
          {/* ═══════════════════════════════════════════════════════ */}
          {dashSection === 'health' && (
            <motion.div key="health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* System Health Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card rounded-xl p-4 border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-2"><Wifi size={16} className="text-emerald-400" /><span className="text-xs text-muted-foreground">حالة النظام</span></div>
                  <p className="text-xl font-bold text-emerald-400">متصل</p>
                  <p className="text-[10px] text-muted-foreground mt-1">7/8 أنظمة تعمل بشكل مثالي</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-gold/10">
                  <div className="flex items-center gap-2 mb-2"><Gauge size={16} className="text-gold" /><span className="text-xs text-muted-foreground">متوسط Uptime</span></div>
                  <p className="text-xl font-bold text-foreground font-mono">99.86%</p>
                  <p className="text-[10px] text-emerald-400 mt-1">أعلى من SLA المطلوب (99.5%)</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-gold/10">
                  <div className="flex items-center gap-2 mb-2"><Activity size={16} className="text-blue-400" /><span className="text-xs text-muted-foreground">متوسط Latency</span></div>
                  <p className="text-xl font-bold text-foreground font-mono">93ms</p>
                  <p className="text-[10px] text-emerald-400 mt-1">ضمن النطاق المثالي (&lt;200ms)</p>
                </div>
                <div className="glass-card rounded-xl p-4 border border-gold/10">
                  <div className="flex items-center gap-2 mb-2"><Lock size={16} className="text-purple-400" /><span className="text-xs text-muted-foreground">الأمان</span></div>
                  <p className="text-xl font-bold text-emerald-400">A+</p>
                  <p className="text-[10px] text-muted-foreground mt-1">SSL + WAF + DDoS Protection</p>
                </div>
              </div>

              {/* System Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systemModules.map((mod) => (
                  <div key={mod.name} className={cn('glass-card rounded-xl p-4 border transition-all', mod.status === 'online' ? 'border-emerald-500/15 hover:border-emerald-500/30' : mod.status === 'warning' ? 'border-amber-500/20 bg-amber-500/5' : 'border-red-500/20 bg-red-500/5')}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center">
                        <mod.icon size={16} className="text-gold" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={cn('w-2 h-2 rounded-full', mod.status === 'online' ? 'bg-emerald-400' : mod.status === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-red-400 animate-pulse')} />
                        <span className={cn('text-[10px] font-medium', mod.status === 'online' ? 'text-emerald-400' : mod.status === 'warning' ? 'text-amber-400' : 'text-red-400')}>
                          {mod.status === 'online' ? 'متصل' : mod.status === 'warning' ? 'بطيء' : 'منقطع'}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-foreground mb-2">{mod.name}</h4>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Uptime: <span className="text-foreground font-mono">{mod.uptime}%</span></span>
                      <span className="text-muted-foreground">Latency: <span className={cn('font-mono', mod.latency < 100 ? 'text-emerald-400' : mod.latency < 200 ? 'text-gold' : 'text-amber-400')}>{mod.latency}ms</span></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* API Integrations Status */}
              <div className="glass-card rounded-2xl p-6 border border-gold/10">
                <h3 className="text-sm font-bold text-foreground mb-4">حالة التكاملات الخارجية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { name: 'ZATCA (هيئة الزكاة)', status: 'متصل', lastSync: 'منذ 5 دقائق', health: 99 },
                    { name: 'GOSI (التأمينات)', status: 'متصل', lastSync: 'منذ 15 دقيقة', health: 98 },
                    { name: 'قوى (وزارة العمل)', status: 'متصل', lastSync: 'منذ 30 دقيقة', health: 97 },
                    { name: 'SAMA (البنك المركزي)', status: 'متصل', lastSync: 'منذ ساعة', health: 99 },
                    { name: 'أبشر (الجوازات)', status: 'متصل', lastSync: 'منذ 2 ساعة', health: 96 },
                    { name: 'WPS (حماية الأجور)', status: 'بطيء', lastSync: 'منذ 4 ساعات', health: 85 },
                  ].map((api) => (
                    <div key={api.name} className="p-3 rounded-xl bg-card/30 border border-border/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{api.name}</span>
                        <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full', api.status === 'متصل' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400')}>{api.status}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>آخر مزامنة: {api.lastSync}</span>
                        <span className="font-mono">{api.health}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Access */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
          <h3 className="text-sm font-bold text-foreground mb-4">وصول سريع</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'الفعاليات', icon: Calendar, path: '/events', color: 'from-blue-500/15 to-blue-600/5' },
              { label: 'المالية', icon: DollarSign, path: '/finance', color: 'from-emerald-500/15 to-emerald-600/5' },
              { label: 'CRM', icon: Users, path: '/crm', color: 'from-purple-500/15 to-purple-600/5' },
              { label: 'التقارير', icon: BarChart3, path: '/reports', color: 'from-amber-500/15 to-amber-600/5' },
              { label: 'العقل AI', icon: Brain, path: '/ai', color: 'from-gold/15 to-gold/5' },
              { label: 'الإعدادات', icon: Settings, path: '/settings', color: 'from-gray-500/15 to-gray-600/5' },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)} className={cn('p-4 rounded-xl border border-gold/10 hover:border-gold/25 transition-all group text-center', `bg-gradient-to-b ${item.color}`)}>
                <item.icon size={22} className="mx-auto mb-2 text-gold/60 group-hover:text-gold transition-colors" />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
