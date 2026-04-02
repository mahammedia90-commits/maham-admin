/*
 * Dashboard — CEO Command Center
 * Design: Nour Theme — Liquid Gold Executive
 * مركز القيادة الرئيسي للمنظومة بالكامل
 */
import { useState } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/layout/AdminLayout'
import StatsCard from '@/components/shared/StatsCard'
import { cn, formatCurrency, formatNumber, DASHBOARD_HERO_URL } from '@/lib/utils'
import { dashboardApi } from '@/api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts'
import {
  Calendar, Users, DollarSign, TrendingUp, Building2, Briefcase,
  Handshake, Brain, AlertTriangle, CheckCircle2, Clock, ArrowUpRight,
  Activity, Eye, FileText, Shield, Zap, BarChart3, Target, Globe,
  Settings
} from 'lucide-react'

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

export default function DashboardPage() {
  const [, navigate] = useLocation()
  const [activeChart, setActiveChart] = useState<'revenue' | 'growth' | 'occupancy'>('revenue')
  const aiHealthScore = 87

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* Hero Banner */}
        <motion.div {...fadeUp} className="relative rounded-2xl overflow-hidden border border-gold/15">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${DASHBOARD_HERO_URL})` }} />
          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-black/50 dark:from-black/90 dark:via-black/70 dark:to-black/50" />
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

        {/* KPI Stats */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard title="إجمالي الإيرادات" value="2.35M" icon={DollarSign} trend={18.5} trendLabel="عن الشهر السابق" />
          <StatsCard title="الفعاليات النشطة" value="12" icon={Calendar} trend={8} trendLabel="فعاليات جديدة" delay={0.05} />
          <StatsCard title="المستثمرون" value="102" icon={Building2} trend={15} trendLabel="مستثمر جديد" delay={0.1} />
          <StatsCard title="التجار" value="268" icon={Briefcase} trend={22} trendLabel="تاجر جديد" delay={0.15} />
          <StatsCard title="الرعاة" value="45" icon={Handshake} trend={12} trendLabel="راعي جديد" delay={0.2} />
          <StatsCard title="معدل الإشغال" value="88%" icon={Target} trend={5} trendLabel="عن الشهر السابق" delay={0.25} />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts - 2 cols */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
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
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px', backdropFilter: 'blur(20px)' }} formatter={(value: number) => [`${value.toLocaleString()} ر.س`, '']} />
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
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px', backdropFilter: 'blur(20px)' }} />
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
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px', backdropFilter: 'blur(20px)' }} formatter={(v: number) => [`${v}%`, 'معدل الإشغال']} />
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
                      <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--card-foreground)', fontFamily: 'Cairo', fontSize: '12px', backdropFilter: 'blur(20px)' }} formatter={(v: number) => [`${v}%`, '']} />
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
          </motion.div>

          {/* Right Column */}
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="space-y-6">
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
                      <button onClick={() => navigate('/requests')} className="flex-1 text-[10px] py-1.5 rounded-lg bg-gold/12 text-gold hover:bg-gold/22 transition-all duration-300 border border-gold/20 hover:border-gold/35 font-semibold hover:shadow-[0_0_12px_oklch(0.78_0.11_85/12%)]">مراجعة</button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/requests')} className="w-full mt-3 text-xs text-gold/70 hover:text-gold transition-all duration-300 py-2.5 rounded-xl hover:bg-gold/8 border border-transparent hover:border-gold/15 font-medium">عرض كل الطلبات ←</button>
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
          </motion.div>
        </div>

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
