/* ═══════════════════════════════════════════════════════════════
   بوابة المستثمر — مركز تحكم شامل (معمّق)
   Nour Theme · Liquid Gold Executive
   9 تابات: نظرة عامة | المحفظة | المستثمرون | الفرص | العقود | التقارير | التواصل | العناية الواجبة | إدارة المخاطر
   ═══════════════════════════════════════════════════════════════ */
import { useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, TrendingUp, DollarSign, Users, Shield, AlertTriangle,
  CheckCircle2, ArrowUpRight, Briefcase, Target, Wallet, Calendar,
  Eye, Download, Filter, Search, ChevronLeft, Zap, Star, Award,
  FileText, LineChart, Globe, MessageSquare, Send, Paperclip,
  ClipboardCheck, FileSearch, ShieldCheck, BarChart3, ArrowDownRight,
  Phone, Mail, Video, Clock, UserCheck, AlertCircle, Activity
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

const tabs = ['نظرة عامة', 'المحفظة الاستثمارية', 'المستثمرون', 'الفرص', 'العقود', 'التقارير', 'التواصل', 'العناية الواجبة', 'إدارة المخاطر'] as const
type TabType = typeof tabs[number]

/* ── بيانات تجريبية ── */
const investmentTrend = [
  { month: 'يناير', استثمارات: 2400000, عوائد: 180000 },
  { month: 'فبراير', استثمارات: 3100000, عوائد: 240000 },
  { month: 'مارس', استثمارات: 4200000, عوائد: 380000 },
  { month: 'أبريل', استثمارات: 5800000, عوائد: 520000 },
  { month: 'مايو', استثمارات: 7200000, عوائد: 680000 },
  { month: 'يونيو', استثمارات: 8900000, عوائد: 890000 },
]

const sectorDistribution = [
  { name: 'معارض تجارية', value: 35, color: '#C9A84C' },
  { name: 'مؤتمرات', value: 25, color: '#B8860B' },
  { name: 'فعاليات ترفيهية', value: 20, color: '#DAA520' },
  { name: 'معارض صناعية', value: 12, color: '#8B7355' },
  { name: 'أخرى', value: 8, color: '#6B6560' },
]

const riskMatrix = [
  { category: 'منخفض', count: 18, percentage: 42, color: '#22c55e' },
  { category: 'متوسط', count: 15, percentage: 35, color: '#C9A84C' },
  { category: 'مرتفع', count: 7, percentage: 16, color: '#f59e0b' },
  { category: 'حرج', count: 3, percentage: 7, color: '#ef4444' },
]

const topInvestors = [
  { id: 1, name: 'مجموعة الراجحي للاستثمار', totalInvested: 12500000, activeDeals: 5, roi: 18.5, status: 'active', tier: 'بلاتيني', joinDate: '2024-01-15', sector: 'معارض تجارية', email: 'invest@rajhi.com', phone: '+966501234567', lastContact: '2026-03-28' },
  { id: 2, name: 'شركة سابك للاستثمارات', totalInvested: 8700000, activeDeals: 3, roi: 15.2, status: 'active', tier: 'ذهبي', joinDate: '2024-03-20', sector: 'مؤتمرات', email: 'invest@sabic.com', phone: '+966507654321', lastContact: '2026-03-25' },
  { id: 3, name: 'صندوق الاستثمارات العامة', totalInvested: 25000000, activeDeals: 8, roi: 22.1, status: 'active', tier: 'بلاتيني', joinDate: '2023-11-01', sector: 'متنوع', email: 'pif@gov.sa', phone: '+966509876543', lastContact: '2026-03-30' },
  { id: 4, name: 'مجموعة بن لادن', totalInvested: 6200000, activeDeals: 2, roi: 12.8, status: 'pending', tier: 'فضي', joinDate: '2024-06-10', sector: 'فعاليات ترفيهية', email: 'invest@binladin.com', phone: '+966504567890', lastContact: '2026-03-15' },
  { id: 5, name: 'شركة أرامكو فنتشرز', totalInvested: 15800000, activeDeals: 6, roi: 19.7, status: 'active', tier: 'بلاتيني', joinDate: '2024-02-28', sector: 'معارض صناعية', email: 'ventures@aramco.com', phone: '+966503456789', lastContact: '2026-03-29' },
]

const opportunities = [
  { id: 1, title: 'معرض الرياض الدولي للتقنية 2026', type: 'معرض تجاري', minInvestment: 500000, targetRaise: 5000000, raised: 3200000, deadline: '2026-06-15', expectedROI: 18, risk: 'منخفض', status: 'active' },
  { id: 2, title: 'مؤتمر الذكاء الاصطناعي السعودي', type: 'مؤتمر', minInvestment: 250000, targetRaise: 3000000, raised: 2100000, deadline: '2026-08-20', expectedROI: 22, risk: 'منخفض', status: 'active' },
  { id: 3, title: 'معرض جدة للسيارات الفاخرة', type: 'معرض متخصص', minInvestment: 1000000, targetRaise: 8000000, raised: 1500000, deadline: '2026-10-01', expectedROI: 25, risk: 'مرتفع', status: 'active' },
  { id: 4, title: 'فعالية موسم الرياض — بوليفارد', type: 'فعالية ترفيهية', minInvestment: 2000000, targetRaise: 15000000, raised: 9800000, deadline: '2026-12-01', expectedROI: 30, risk: 'متوسط', status: 'active' },
]

const contracts = [
  { id: 'INV-2026-001', investor: 'مجموعة الراجحي', event: 'معرض الرياض الدولي', value: 2500000, startDate: '2026-01-15', endDate: '2026-12-31', status: 'active', paymentStatus: 'paid' },
  { id: 'INV-2026-002', investor: 'شركة سابك', event: 'مؤتمر AI السعودي', value: 1800000, startDate: '2026-02-01', endDate: '2026-09-30', status: 'active', paymentStatus: 'paid' },
  { id: 'INV-2026-003', investor: 'صندوق الاستثمارات', event: 'موسم الرياض', value: 5000000, startDate: '2026-03-01', endDate: '2027-02-28', status: 'active', paymentStatus: 'pending' },
  { id: 'INV-2026-004', investor: 'مجموعة بن لادن', event: 'معرض جدة للسيارات', value: 3200000, startDate: '2026-04-15', endDate: '2026-11-30', status: 'pending', paymentStatus: 'unpaid' },
]

const messages = [
  { id: 1, from: 'مجموعة الراجحي', subject: 'استفسار عن فرصة معرض الرياض', date: '2026-03-30 14:30', unread: true, priority: 'high' },
  { id: 2, from: 'صندوق الاستثمارات العامة', subject: 'طلب تقرير أداء الربع الأول', date: '2026-03-29 10:15', unread: true, priority: 'medium' },
  { id: 3, from: 'شركة أرامكو فنتشرز', subject: 'تأكيد حضور اجتماع المراجعة', date: '2026-03-28 16:45', unread: false, priority: 'low' },
  { id: 4, from: 'شركة سابك', subject: 'طلب تعديل شروط العقد INV-2026-002', date: '2026-03-27 09:00', unread: false, priority: 'high' },
  { id: 5, from: 'مجموعة بن لادن', subject: 'استفسار عن جدول الدفعات', date: '2026-03-26 11:30', unread: false, priority: 'medium' },
]

const dueDiligenceChecks = [
  { id: 1, investor: 'مجموعة الراجحي', kycStatus: 'approved', financialCheck: 'approved', legalCheck: 'approved', complianceScore: 98, lastAudit: '2026-02-15', riskLevel: 'منخفض' },
  { id: 2, investor: 'شركة سابك', kycStatus: 'approved', financialCheck: 'approved', legalCheck: 'approved', complianceScore: 95, lastAudit: '2026-01-20', riskLevel: 'منخفض' },
  { id: 3, investor: 'صندوق الاستثمارات العامة', kycStatus: 'approved', financialCheck: 'approved', legalCheck: 'approved', complianceScore: 99, lastAudit: '2026-03-01', riskLevel: 'منخفض' },
  { id: 4, investor: 'مجموعة بن لادن', kycStatus: 'pending', financialCheck: 'approved', legalCheck: 'pending', complianceScore: 72, lastAudit: '2025-11-10', riskLevel: 'متوسط' },
  { id: 5, investor: 'شركة أرامكو فنتشرز', kycStatus: 'approved', financialCheck: 'approved', legalCheck: 'approved', complianceScore: 97, lastAudit: '2026-02-28', riskLevel: 'منخفض' },
]

const riskRadarData = [
  { subject: 'السوق', A: 85, fullMark: 100 },
  { subject: 'الائتمان', A: 72, fullMark: 100 },
  { subject: 'التشغيل', A: 90, fullMark: 100 },
  { subject: 'السيولة', A: 68, fullMark: 100 },
  { subject: 'الامتثال', A: 95, fullMark: 100 },
  { subject: 'السمعة', A: 88, fullMark: 100 },
]

const riskAlerts = [
  { id: 1, title: 'تأخر سداد دفعة — مجموعة بن لادن', severity: 'critical', date: '2026-03-30', amount: 1600000, daysOverdue: 15 },
  { id: 2, title: 'انخفاض تصنيف ائتماني — شركة XYZ', severity: 'warning', date: '2026-03-28', amount: 0, daysOverdue: 0 },
  { id: 3, title: 'تجاوز حد التعرض القطاعي — معارض تجارية 42%', severity: 'warning', date: '2026-03-25', amount: 0, daysOverdue: 0 },
  { id: 4, title: 'انتهاء صلاحية وثائق KYC — مستثمر #4', severity: 'info', date: '2026-03-20', amount: 0, daysOverdue: 0 },
]

const tierColors: Record<string, string> = {
  'بلاتيني': 'bg-gradient-to-l from-purple-500/15 to-purple-500/5 text-purple-400 border border-purple-500/20',
  'ذهبي': 'bg-gradient-to-l from-gold/15 to-gold/5 text-gold border border-gold/20',
  'فضي': 'bg-gradient-to-l from-gray-400/15 to-gray-400/5 text-gray-300 border border-gray-400/20',
}

const ddStatusIcon = (s: string) => s === 'approved' ? <CheckCircle2 size={14} className="text-emerald-400" /> : s === 'pending' ? <Clock size={14} className="text-amber-400" /> : <AlertCircle size={14} className="text-red-400" />

export default function InvestorPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')
  const [msgInput, setMsgInput] = useState('')

  const totalInvested = topInvestors.reduce((s, i) => s + i.totalInvested, 0)
  const avgROI = (topInvestors.reduce((s, i) => s + i.roi, 0) / topInvestors.length).toFixed(1)
  const totalDeals = topInvestors.reduce((s, i) => s + i.activeDeals, 0)

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="بوابة المستثمر"
          subtitle="مركز التحكم الشامل لإدارة الاستثمارات والمستثمرين والفرص الاستثمارية"
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <button className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button className="nour-btn-gold text-xs flex items-center gap-1.5"><Target size={14} /> فرصة جديدة</button>
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
                  <StatsCard title="إجمالي الاستثمارات" value={formatCurrency(totalInvested)} icon={DollarSign} trend={23.5} trendLabel="نمو سنوي" delay={0} />
                  <StatsCard title="المستثمرون النشطون" value={topInvestors.filter(i => i.status === 'active').length.toString()} icon={Users} trend={12} trendLabel="جديد" delay={0.1} />
                  <StatsCard title="متوسط العائد ROI" value={`${avgROI}%`} icon={TrendingUp} trend={3.2} trendLabel="تحسن" delay={0.2} />
                  <StatsCard title="الصفقات النشطة" value={totalDeals.toString()} icon={Briefcase} trend={8} trendLabel="جديدة" delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 glass-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground">اتجاه الاستثمارات والعوائد</h3>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" /> استثمارات</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} /> عوائد</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={investmentTrend}>
                        <defs>
                          <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient>
                          <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} />
                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--card-foreground)', fontSize: 12, backdropFilter: 'blur(20px)' }} />
                        <Area type="monotone" dataKey="استثمارات" stroke="#C9A84C" fill="url(#investGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="عوائد" stroke="#22c55e" fill="url(#returnGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">توزيع القطاعات</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <RechartsPie>
                        <Pie data={sectorDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                          {sectorDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--card-foreground)', fontSize: 11, backdropFilter: 'blur(20px)' }} />
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {sectorDistribution.map((s) => (
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
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Shield size={16} className="text-gold" /> مصفوفة المخاطر</h3>
                    <div className="space-y-3">
                      {riskMatrix.map((r) => (
                        <div key={r.category} className="flex items-center gap-3">
                          <span className="text-xs w-14 text-muted-foreground">{r.category}</span>
                          <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${r.percentage}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-lg flex items-center justify-end px-2" style={{ background: `${r.color}20`, borderRight: `3px solid ${r.color}` }}>
                              <span className="text-[10px] font-bold" style={{ color: r.color }}>{r.count} صفقة</span>
                            </motion.div>
                          </div>
                          <span className="text-xs font-bold w-10 text-left" style={{ color: r.color }}>{r.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-4 sm:p-6 border-gold/15">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Zap size={16} className="text-gold" /> رؤى الذكاء الاصطناعي</h3>
                    <div className="space-y-3">
                      {[
                        { icon: TrendingUp, text: 'نمو الاستثمارات بنسبة 23.5% مقارنة بالربع السابق — أعلى معدل نمو منذ التأسيس', type: 'success' as const },
                        { icon: AlertTriangle, text: '3 صفقات في منطقة الخطر الحرج تحتاج مراجعة فورية من فريق إدارة المخاطر', type: 'warning' as const },
                        { icon: Target, text: 'فرصة استثمارية في قطاع المؤتمرات التقنية — عائد متوقع 22% مع مخاطر منخفضة', type: 'info' as const },
                        { icon: Star, text: 'صندوق الاستثمارات العامة حقق أعلى ROI بنسبة 22.1% — يُنصح بتوسيع الشراكة', type: 'success' as const },
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

            {/* ═══ المحفظة الاستثمارية ═══ */}
            {activeTab === 'المحفظة الاستثمارية' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(68200000)} icon={Wallet} trend={15.3} trendLabel="نمو" delay={0} />
                  <StatsCard title="العوائد المحققة" value={formatCurrency(8900000)} icon={TrendingUp} trend={22.1} trendLabel="هذا الربع" delay={0.1} />
                  <StatsCard title="الصفقات المفتوحة" value="24" icon={Briefcase} delay={0.2} />
                  <StatsCard title="معدل النجاح" value="94.2%" icon={CheckCircle2} trend={2.1} trendLabel="تحسن" delay={0.3} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">أداء المحفظة الشهري</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={investmentTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} />
                        <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--card-foreground)', fontSize: 12, backdropFilter: 'blur(20px)' }} />
                        <Bar dataKey="استثمارات" fill="#C9A84C" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="عوائد" fill="#22c55e" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">تصنيف الاستثمارات حسب الحالة</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'نشطة ومربحة', count: 18, value: 42000000, color: '#22c55e', pct: 62 },
                        { label: 'قيد التنفيذ', count: 8, value: 18500000, color: '#C9A84C', pct: 27 },
                        { label: 'قيد المراجعة', count: 4, value: 5200000, color: '#f59e0b', pct: 8 },
                        { label: 'مكتملة', count: 12, value: 2500000, color: '#6B6560', pct: 3 },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{item.label} ({item.count})</span>
                            <span className="font-bold" style={{ color: item.color }}>{formatCurrency(item.value)}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ المستثمرون ═══ */}
            {activeTab === 'المستثمرون' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث عن مستثمر..." className="w-full h-10 pr-9 pl-4 rounded-xl text-sm bg-card border border-border focus:border-gold/30 outline-none transition-all" />
                  </div>
                  <button className="nour-btn-outline text-xs flex items-center gap-1.5 justify-center"><Filter size={14} /> تصفية</button>
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead><tr className="border-b border-border/50">
                        {['المستثمر', 'التصنيف', 'إجمالي الاستثمار', 'الصفقات', 'العائد ROI', 'القطاع', 'الحالة', ''].map(h => <th key={h} className="text-right p-3 sm:p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {topInvestors.filter(i => !searchQuery || i.name.includes(searchQuery)).map((inv) => (
                          <tr key={inv.id} className="border-b border-border/30 hover:bg-gold/[0.03] transition-colors">
                            <td className="p-3 sm:p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">{inv.name.charAt(0)}</div><div><p className="font-medium text-foreground text-xs">{inv.name}</p><p className="text-[10px] text-muted-foreground">انضم {formatDate(inv.joinDate)}</p></div></div></td>
                            <td className="p-3 sm:p-4"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', tierColors[inv.tier])}>{inv.tier}</span></td>
                            <td className="p-3 sm:p-4 text-xs font-bold text-gold">{formatCurrency(inv.totalInvested)}</td>
                            <td className="p-3 sm:p-4 text-xs text-center">{inv.activeDeals}</td>
                            <td className="p-3 sm:p-4"><span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5"><ArrowUpRight size={10} />{inv.roi}%</span></td>
                            <td className="p-3 sm:p-4 text-xs text-muted-foreground">{inv.sector}</td>
                            <td className="p-3 sm:p-4"><StatusBadge status={inv.status} /></td>
                            <td className="p-3 sm:p-4"><button className="p-1.5 rounded-lg hover:bg-gold/10 text-muted-foreground hover:text-gold transition-all"><Eye size={14} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ الفرص ═══ */}
            {activeTab === 'الفرص' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.map((opp, i) => (
                    <motion.div key={opp.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 sm:p-5 hover:border-gold/20 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div><h4 className="text-sm font-bold text-foreground mb-1">{opp.title}</h4><span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/8 text-gold/70 border border-gold/15">{opp.type}</span></div>
                        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', opp.risk === 'منخفض' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15', opp.risk === 'متوسط' && 'bg-amber-500/10 text-amber-400 border border-amber-500/15', opp.risk === 'مرتفع' && 'bg-red-500/10 text-red-400 border border-red-500/15')}>مخاطر {opp.risk}ة</span>
                      </div>
                      <div className="mb-3">
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}><motion.div initial={{ width: 0 }} animate={{ width: `${(opp.raised / opp.targetRaise) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-l from-gold to-gold/60" /></div>
                        <div className="flex items-center justify-between text-[10px] mt-1"><span className="text-muted-foreground">{formatCurrency(opp.raised)}</span><span className="text-muted-foreground">{formatCurrency(opp.targetRaise)}</span></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] mb-3">
                        <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(201,168,76,0.04)' }}><span className="text-muted-foreground block">الحد الأدنى</span><span className="font-bold text-foreground">{formatCurrency(opp.minInvestment)}</span></div>
                        <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(34,197,94,0.04)' }}><span className="text-muted-foreground block">العائد المتوقع</span><span className="font-bold text-emerald-400">{opp.expectedROI}%</span></div>
                        <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.02)' }}><span className="text-muted-foreground block">الموعد النهائي</span><span className="font-bold text-foreground">{formatDate(opp.deadline)}</span></div>
                      </div>
                      <button className="w-full py-2 rounded-lg text-xs font-medium bg-gold/8 text-gold border border-gold/15 hover:bg-gold/15 transition-all">عرض التفاصيل</button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <StatsCard title="العقود النشطة" value="3" icon={FileText} delay={0} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(12500000)} icon={DollarSign} delay={0.1} />
                  <StatsCard title="نسبة التحصيل" value="78%" icon={CheckCircle2} trend={5} trendLabel="تحسن" delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead><tr className="border-b border-border/50">
                        {['رقم العقد', 'المستثمر', 'الفعالية', 'القيمة', 'الفترة', 'حالة العقد', 'حالة الدفع'].map(h => <th key={h} className="text-right p-3 sm:p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {contracts.map((c) => (
                          <tr key={c.id} className="border-b border-border/30 hover:bg-gold/[0.03] transition-colors">
                            <td className="p-3 sm:p-4 text-xs font-mono text-gold">{c.id}</td>
                            <td className="p-3 sm:p-4 text-xs font-medium text-foreground">{c.investor}</td>
                            <td className="p-3 sm:p-4 text-xs text-muted-foreground">{c.event}</td>
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

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'تقرير الأداء الاستثماري', desc: 'تحليل شامل لأداء المحفظة والعوائد', icon: LineChart, date: '2026-03-28' },
                  { title: 'تقرير المخاطر', desc: 'تقييم المخاطر لجميع الصفقات النشطة', icon: Shield, date: '2026-03-25' },
                  { title: 'تقرير المستثمرين', desc: 'ملخص نشاط وتصنيف المستثمرين', icon: Users, date: '2026-03-20' },
                  { title: 'تقرير الفرص', desc: 'تحليل الفرص الاستثمارية المتاحة', icon: Target, date: '2026-03-15' },
                  { title: 'تقرير العقود', desc: 'حالة العقود والتحصيل المالي', icon: FileText, date: '2026-03-10' },
                  { title: 'تقرير AI التنبؤي', desc: 'توقعات الذكاء الاصطناعي للربع القادم', icon: Zap, date: '2026-03-05' },
                ].map((report, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 sm:p-5 hover:border-gold/20 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center group-hover:bg-gold/15 transition-all"><report.icon size={18} className="text-gold" /></div>
                      <div className="flex-1"><h4 className="text-sm font-bold text-foreground">{report.title}</h4><p className="text-[10px] text-muted-foreground mt-0.5">{report.desc}</p></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} /> {formatDate(report.date)}</span>
                      <button className="text-[10px] text-gold flex items-center gap-1 hover:text-gold/80"><Download size={10} /> تحميل</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ═══ التواصل ═══ */}
            {activeTab === 'التواصل' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="رسائل غير مقروءة" value={messages.filter(m => m.unread).length.toString()} icon={MessageSquare} delay={0} />
                  <StatsCard title="اجتماعات هذا الأسبوع" value="4" icon={Video} delay={0.1} />
                  <StatsCard title="مكالمات مجدولة" value="7" icon={Phone} delay={0.2} />
                  <StatsCard title="متوسط وقت الرد" value="2.4 ساعة" icon={Clock} delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Messages list */}
                  <div className="lg:col-span-2 glass-card overflow-hidden">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><MessageSquare size={16} className="text-gold" /> صندوق الرسائل</h3>
                      <button className="text-[10px] text-gold">تحديد الكل كمقروء</button>
                    </div>
                    <div className="divide-y divide-border/30">
                      {messages.map((msg, i) => (
                        <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className={cn('p-4 hover:bg-gold/[0.02] transition-colors cursor-pointer', msg.unread && 'bg-gold/[0.03] border-r-2 border-gold')}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs shrink-0">{msg.from.charAt(0)}</div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-bold text-foreground truncate">{msg.from}</p>
                                  {msg.unread && <span className="w-2 h-2 rounded-full bg-gold shrink-0" />}
                                </div>
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

                  {/* Quick compose + contacts */}
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
                      <h3 className="text-sm font-bold text-foreground mb-3">جهات الاتصال السريعة</h3>
                      <div className="space-y-2">
                        {topInvestors.slice(0, 4).map((inv) => (
                          <div key={inv.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gold/[0.03] transition-colors">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center text-gold text-[10px] font-bold">{inv.name.charAt(0)}</div>
                              <span className="text-xs text-foreground truncate max-w-[120px]">{inv.name}</span>
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

            {/* ═══ العناية الواجبة Due Diligence ═══ */}
            {activeTab === 'العناية الواجبة' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="مكتمل KYC" value={`${dueDiligenceChecks.filter(d => d.kycStatus === 'approved').length}/${dueDiligenceChecks.length}`} icon={UserCheck} delay={0} />
                  <StatsCard title="متوسط الامتثال" value={`${Math.round(dueDiligenceChecks.reduce((s, d) => s + d.complianceScore, 0) / dueDiligenceChecks.length)}%`} icon={ShieldCheck} trend={3} trendLabel="تحسن" delay={0.1} />
                  <StatsCard title="فحوصات معلقة" value={dueDiligenceChecks.filter(d => d.kycStatus === 'pending' || d.legalCheck === 'pending').length.toString()} icon={ClipboardCheck} delay={0.2} />
                  <StatsCard title="آخر تدقيق" value="01/03/2026" icon={FileSearch} delay={0.3} />
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="p-4 border-b border-border/50">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><ClipboardCheck size={16} className="text-gold" /> سجل العناية الواجبة</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[750px]">
                      <thead><tr className="border-b border-border/50">
                        {['المستثمر', 'KYC', 'الفحص المالي', 'الفحص القانوني', 'درجة الامتثال', 'مستوى المخاطر', 'آخر تدقيق'].map(h => <th key={h} className="text-right p-3 sm:p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {dueDiligenceChecks.map((dd) => (
                          <tr key={dd.id} className="border-b border-border/30 hover:bg-gold/[0.03] transition-colors">
                            <td className="p-3 sm:p-4 text-xs font-medium text-foreground">{dd.investor}</td>
                            <td className="p-3 sm:p-4">{ddStatusIcon(dd.kycStatus)}</td>
                            <td className="p-3 sm:p-4">{ddStatusIcon(dd.financialCheck)}</td>
                            <td className="p-3 sm:p-4">{ddStatusIcon(dd.legalCheck)}</td>
                            <td className="p-3 sm:p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                  <div className="h-full rounded-full" style={{ width: `${dd.complianceScore}%`, background: dd.complianceScore >= 90 ? '#22c55e' : dd.complianceScore >= 70 ? '#C9A84C' : '#ef4444' }} />
                                </div>
                                <span className="text-xs font-bold" style={{ color: dd.complianceScore >= 90 ? '#22c55e' : dd.complianceScore >= 70 ? '#C9A84C' : '#ef4444' }}>{dd.complianceScore}%</span>
                              </div>
                            </td>
                            <td className="p-3 sm:p-4"><span className={cn('text-[10px] px-2 py-0.5 rounded-full', dd.riskLevel === 'منخفض' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400')}>{dd.riskLevel}</span></td>
                            <td className="p-3 sm:p-4 text-[10px] text-muted-foreground">{formatDate(dd.lastAudit)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ إدارة المخاطر ═══ */}
            {activeTab === 'إدارة المخاطر' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatsCard title="مؤشر المخاطر العام" value="منخفض" icon={Shield} delay={0} />
                  <StatsCard title="تنبيهات نشطة" value={riskAlerts.filter(a => a.severity === 'critical').length.toString()} icon={AlertTriangle} delay={0.1} />
                  <StatsCard title="نسبة التعرض" value="68%" icon={Activity} trend={-2.5} trendLabel="تحسن" delay={0.2} />
                  <StatsCard title="صفقات مراقبة" value="7" icon={Eye} delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-gold" /> رادار المخاطر</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={riskRadarData}>
                        <PolarGrid stroke="rgba(201,168,76,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B6560', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6B6560', fontSize: 9 }} />
                        <Radar name="المخاطر" dataKey="A" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.15} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-4 sm:p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400" /> تنبيهات المخاطر</h3>
                    <div className="space-y-3">
                      {riskAlerts.map((alert, i) => (
                        <motion.div key={alert.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn(
                          'p-3 rounded-lg flex items-start gap-3',
                          alert.severity === 'critical' && 'bg-red-500/5 border border-red-500/15',
                          alert.severity === 'warning' && 'bg-amber-500/5 border border-amber-500/15',
                          alert.severity === 'info' && 'bg-blue-500/5 border border-blue-500/15',
                        )}>
                          <AlertCircle size={14} className={cn('shrink-0 mt-0.5', alert.severity === 'critical' && 'text-red-400', alert.severity === 'warning' && 'text-amber-400', alert.severity === 'info' && 'text-blue-400')} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{alert.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                              <span>{formatDate(alert.date)}</span>
                              {alert.amount > 0 && <span className="text-red-400 font-bold">{formatCurrency(alert.amount)}</span>}
                              {alert.daysOverdue > 0 && <span className="text-red-400">{alert.daysOverdue} يوم تأخير</span>}
                            </div>
                          </div>
                          <button className="text-[10px] text-gold shrink-0 hover:text-gold/80">معالجة</button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 sm:p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">حدود التعرض القطاعي</h3>
                  <div className="space-y-3">
                    {sectorDistribution.map((sector) => {
                      const limit = 40
                      const isOver = sector.value > limit
                      return (
                        <div key={sector.name} className="flex items-center gap-3">
                          <span className="text-xs w-28 text-muted-foreground truncate">{sector.name}</span>
                          <div className="flex-1 h-6 rounded-lg overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${sector.value}%` }} transition={{ duration: 1 }} className="h-full rounded-lg" style={{ background: isOver ? 'rgba(239,68,68,0.2)' : `${sector.color}30` }} />
                            <div className="absolute top-0 h-full border-r-2 border-dashed" style={{ right: `${100 - limit}%`, borderColor: 'rgba(255,255,255,0.15)' }} />
                          </div>
                          <span className={cn('text-xs font-bold w-10', isOver ? 'text-red-400' : 'text-emerald-400')}>{sector.value}%</span>
                          {isOver && <AlertTriangle size={12} className="text-red-400" />}
                        </div>
                      )
                    })}
                    <p className="text-[10px] text-muted-foreground mt-2">الخط المتقطع = حد التعرض الأقصى (40%)</p>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
