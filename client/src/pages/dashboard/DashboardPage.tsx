import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Users, DollarSign, TrendingUp, FileText, Brain,
  ArrowUpRight, Activity, BarChart3, PieChart, Clock, Zap,
  Building2, Briefcase, Handshake, Eye
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AdminLayout from '@/components/layout/AdminLayout'
import StatsCard from '@/components/shared/StatsCard'
import PageHeader from '@/components/shared/PageHeader'
import { cn, formatCurrency, formatNumber, DASHBOARD_HERO_URL } from '@/lib/utils'
import { dashboardApi } from '@/api'

const revenueData = [
  { month: 'يناير', revenue: 120000, expenses: 80000 },
  { month: 'فبراير', revenue: 150000, expenses: 90000 },
  { month: 'مارس', revenue: 180000, expenses: 95000 },
  { month: 'أبريل', revenue: 220000, expenses: 110000 },
  { month: 'مايو', revenue: 280000, expenses: 120000 },
  { month: 'يونيو', revenue: 350000, expenses: 140000 },
]

const eventTypeData = [
  { name: 'معارض تجارية', value: 45, color: '#C9A84C' },
  { name: 'مؤتمرات', value: 25, color: '#A0A0A0' },
  { name: 'فعاليات خاصة', value: 20, color: '#D4B96A' },
  { name: 'ورش عمل', value: 10, color: '#6B6B6B' },
]

const requestsData = [
  { day: 'السبت', pending: 12, approved: 8, rejected: 2 },
  { day: 'الأحد', pending: 15, approved: 12, rejected: 3 },
  { day: 'الاثنين', pending: 18, approved: 14, rejected: 1 },
  { day: 'الثلاثاء', pending: 10, approved: 9, rejected: 4 },
  { day: 'الأربعاء', pending: 22, approved: 18, rejected: 2 },
  { day: 'الخميس', pending: 8, approved: 6, rejected: 1 },
]

const recentActivities = [
  { id: 1, action: 'تم إنشاء فعالية جديدة', user: 'أحمد محمد', time: 'منذ 5 دقائق', type: 'event' },
  { id: 2, action: 'تم الموافقة على طلب حجز', user: 'سارة العلي', time: 'منذ 15 دقيقة', type: 'request' },
  { id: 3, action: 'تم إصدار فاتورة جديدة', user: 'النظام', time: 'منذ 30 دقيقة', type: 'finance' },
  { id: 4, action: 'تسجيل مستثمر جديد', user: 'خالد الحربي', time: 'منذ ساعة', type: 'user' },
  { id: 5, action: 'تحديث حالة الفعالية', user: 'فاطمة أحمد', time: 'منذ ساعتين', type: 'event' },
]

const aiInsights = [
  { id: 1, title: 'فرصة نمو', desc: 'زيادة متوقعة 35% في الحجوزات الشهر القادم بناءً على تحليل الاتجاهات', icon: TrendingUp, color: 'text-success' },
  { id: 2, title: 'تنبيه مالي', desc: '3 فواتير متأخرة تحتاج متابعة عاجلة — إجمالي 45,000 ر.س', icon: DollarSign, color: 'text-warning' },
  { id: 3, title: 'توصية تشغيلية', desc: 'يُنصح بزيادة فريق الدعم خلال فترة المعرض القادم', icon: Zap, color: 'text-info' },
]

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Hero Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl h-44"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${DASHBOARD_HERO_URL})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40" />
          <div className="relative z-10 flex items-center justify-between h-full px-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white"
              >
                مرحباً بك في <span className="text-gold">ماهم إكسبو</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm mt-2"
              >
                نظرة شاملة على أداء المنصة — آخر تحديث: اليوم
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex items-center gap-3"
            >
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <Activity size={16} className="text-success" />
                <span className="text-sm text-white font-medium">النظام يعمل بكفاءة</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="إجمالي الفعاليات" value="24" icon={Calendar} trend={12} trendLabel="هذا الشهر" delay={0} />
          <StatsCard title="المستخدمون النشطون" value="1,847" icon={Users} trend={8} trendLabel="هذا الأسبوع" delay={0.1} />
          <StatsCard title="الإيرادات" value={formatCurrency(1350000)} icon={DollarSign} trend={23} trendLabel="هذا الربع" delay={0.2} />
          <StatsCard title="الطلبات المعلقة" value="38" icon={FileText} trend={-5} trendLabel="عن الأمس" delay={0.3} />
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Brain size={16} className="text-gold" />
            </div>
            <h2 className="text-sm font-bold text-foreground">رؤى الذكاء الاصطناعي</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 font-medium">AI</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-4 rounded-xl bg-surface2/50 border border-border/30 hover:border-gold/20 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <insight.icon size={16} className={insight.color} />
                  <span className="text-xs font-bold text-foreground">{insight.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">الإيرادات والمصروفات</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" /> الإيرادات</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-chrome" /> المصروفات</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="chromeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A0A0A0" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#A0A0A0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A84C" fill="url(#goldGrad)" strokeWidth={2} name="الإيرادات" />
                <Area type="monotone" dataKey="expenses" stroke="#A0A0A0" fill="url(#chromeGrad)" strokeWidth={2} name="المصروفات" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Event Types Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-bold text-foreground mb-4">أنواع الفعاليات</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RPieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
              </RPieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {eventTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </span>
                  <span className="font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Requests Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-bold text-foreground mb-4">حركة الطلبات الأسبوعية</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={requestsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="approved" fill="#C9A84C" radius={[4, 4, 0, 0]} name="موافق" />
                <Bar dataKey="pending" fill="#A0A0A0" radius={[4, 4, 0, 0]} name="معلق" />
                <Bar dataKey="rejected" fill="#6B6B6B" radius={[4, 4, 0, 0]} name="مرفوض" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">آخر النشاطات</h3>
              <button className="text-xs text-gold hover:text-gold-light transition-colors">عرض الكل</button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface2/50 transition-colors"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    activity.type === 'event' && 'bg-gold/10 text-gold',
                    activity.type === 'request' && 'bg-info/10 text-info',
                    activity.type === 'finance' && 'bg-success/10 text-success',
                    activity.type === 'user' && 'bg-chrome/10 text-chrome',
                  )}>
                    {activity.type === 'event' && <Calendar size={14} />}
                    {activity.type === 'request' && <FileText size={14} />}
                    {activity.type === 'finance' && <DollarSign size={14} />}
                    {activity.type === 'user' && <Users size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.action}</p>
                    <p className="text-[11px] text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock size={10} />
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'بوابة المستثمر', icon: Building2, path: '/portals/investor', color: 'from-gold/20 to-gold/5' },
            { label: 'بوابة التاجر', icon: Briefcase, path: '/portals/merchant', color: 'from-chrome/20 to-chrome/5' },
            { label: 'بوابة الراعي', icon: Handshake, path: '/portals/sponsor', color: 'from-gold/15 to-gold/5' },
            { label: 'العقل التنفيذي', icon: Brain, path: '/ai', color: 'from-gold/20 to-chrome/10' },
          ].map((item, i) => (
            <motion.a
              key={item.path}
              href={item.path}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.05 }}
              className={cn(
                'glass-card p-4 bg-gradient-to-br group hover:border-gold/30 transition-all cursor-pointer',
                item.color
              )}
              onClick={(e) => { e.preventDefault(); window.location.href = item.path }}
            >
              <item.icon size={20} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <ArrowUpRight size={14} className="text-muted-foreground mt-1 group-hover:text-gold transition-colors" />
            </motion.a>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
