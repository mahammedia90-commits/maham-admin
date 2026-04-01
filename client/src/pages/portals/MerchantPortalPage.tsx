/* ═══════════════════════════════════════════════════════════════
   بوابة التاجر — مركز تحكم شامل
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
  Store, ShoppingBag, MapPin, Users, FileCheck, CreditCard,
  Star, Eye, Download, Filter, Search, Calendar,
  Package, CheckCircle2, Clock, AlertTriangle, BarChart3,
  Zap, TrendingUp, DollarSign, ChevronLeft, Plus
} from 'lucide-react'
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tabs = ['نظرة عامة', 'الأكشاك والمواقع', 'التجار', 'الطلبات', 'العقود', 'التقارير'] as const
type TabType = typeof tabs[number]

const bookingTrend = [
  { month: 'يناير', حجوزات: 45, إيرادات: 1200000 },
  { month: 'فبراير', حجوزات: 62, إيرادات: 1800000 },
  { month: 'مارس', حجوزات: 78, إيرادات: 2400000 },
  { month: 'أبريل', حجوزات: 95, إيرادات: 3100000 },
  { month: 'مايو', حجوزات: 110, إيرادات: 3800000 },
  { month: 'يونيو', حجوزات: 128, إيرادات: 4500000 },
]

const boothTypes = [
  { name: 'أكشاك قياسية', value: 40, color: '#C9A84C' },
  { name: 'أكشاك مميزة', value: 25, color: '#B8860B' },
  { name: 'جزر عرض', value: 15, color: '#DAA520' },
  { name: 'مساحات مفتوحة', value: 12, color: '#8B7355' },
  { name: 'VIP Lounges', value: 8, color: '#6B6560' },
]

const merchants = [
  { id: 1, name: 'شركة المراعي', category: 'أغذية ومشروبات', booths: 4, totalSpent: 850000, rating: 4.8, status: 'active', kycStatus: 'verified', joinDate: '2024-02-10' },
  { id: 2, name: 'مجموعة الشايع', category: 'تجزئة', booths: 6, totalSpent: 1200000, rating: 4.9, status: 'active', kycStatus: 'verified', joinDate: '2024-01-15' },
  { id: 3, name: 'شركة جرير', category: 'إلكترونيات', booths: 3, totalSpent: 620000, rating: 4.5, status: 'active', kycStatus: 'verified', joinDate: '2024-04-20' },
  { id: 4, name: 'مؤسسة الحكير', category: 'ترفيه', booths: 8, totalSpent: 2100000, rating: 4.7, status: 'active', kycStatus: 'pending', joinDate: '2024-03-05' },
  { id: 5, name: 'شركة باتيل', category: 'أزياء', booths: 2, totalSpent: 380000, rating: 4.3, status: 'pending', kycStatus: 'under_review', joinDate: '2024-06-01' },
]

const boothRequests = [
  { id: 'BR-2026-001', merchant: 'شركة المراعي', event: 'معرض الرياض الدولي', boothType: 'مميز', size: '6x4', price: 180000, status: 'approved', date: '2026-03-15' },
  { id: 'BR-2026-002', merchant: 'مجموعة الشايع', event: 'موسم الرياض', boothType: 'جزيرة عرض', size: '8x8', price: 350000, status: 'approved', date: '2026-03-18' },
  { id: 'BR-2026-003', merchant: 'شركة جرير', event: 'معرض التقنية', boothType: 'قياسي', size: '3x3', price: 85000, status: 'pending', date: '2026-03-20' },
  { id: 'BR-2026-004', merchant: 'مؤسسة الحكير', event: 'بوليفارد وورلد', boothType: 'VIP', size: '10x10', price: 520000, status: 'pending', date: '2026-03-22' },
  { id: 'BR-2026-005', merchant: 'شركة باتيل', event: 'معرض الأزياء', boothType: 'قياسي', size: '4x3', price: 95000, status: 'rejected', date: '2026-03-25' },
]

const contracts = [
  { id: 'MC-2026-001', merchant: 'شركة المراعي', event: 'معرض الرياض الدولي', value: 850000, startDate: '2026-01-15', endDate: '2026-06-30', status: 'active', paymentStatus: 'paid' },
  { id: 'MC-2026-002', merchant: 'مجموعة الشايع', event: 'موسم الرياض', value: 1200000, startDate: '2026-02-01', endDate: '2026-12-31', status: 'active', paymentStatus: 'partial' },
  { id: 'MC-2026-003', merchant: 'مؤسسة الحكير', event: 'بوليفارد وورلد', value: 2100000, startDate: '2026-03-01', endDate: '2027-02-28', status: 'active', paymentStatus: 'pending' },
]

export default function MerchantPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="بوابة التاجر"
          subtitle="إدارة التجار والأكشاك والحجوزات والعقود التجارية"
          actions={
            <div className="flex items-center gap-2">
              <button onClick={() => toast.info('تصدير — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Download size={14} /> تصدير</button>
              <button onClick={() => toast.info('إضافة تاجر — قريباً')} className="nour-btn-gold text-xs flex items-center gap-1.5"><Store size={14} /> تاجر جديد</button>
            </div>
          }
        />

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي التجار" value="156" icon={Store} trend={18} trendLabel="جديد" delay={0} />
                  <StatsCard title="الأكشاك المحجوزة" value="342 / 400" icon={MapPin} trend={85} trendLabel="نسبة الإشغال" delay={0.1} />
                  <StatsCard title="إيرادات الحجوزات" value={formatCurrency(12800000)} icon={DollarSign} trend={32} trendLabel="نمو" delay={0.2} />
                  <StatsCard title="طلبات معلقة" value="12" icon={Clock} trend={-3} trendLabel="أقل" delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Booking Trend Chart */}
                  <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground">اتجاه الحجوزات والإيرادات</h3>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#C9A84C' }} /> حجوزات</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} /> إيرادات</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={bookingTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                        <XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="left" tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} />
                        <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} />
                        <Bar yAxisId="left" dataKey="حجوزات" fill="#C9A84C" radius={[6, 6, 0, 0]} />
                        <Bar yAxisId="right" dataKey="إيرادات" fill="#22c55e" radius={[6, 6, 0, 0]} opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Booth Types Pie */}
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4">أنواع الأكشاك</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie>
                        <Pie data={boothTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                          {boothTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 11 }} />
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {boothTypes.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                          <span className="font-bold text-foreground">{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Merchants + AI Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Star size={16} className="text-[#C9A84C]" /> أبرز التجار</h3>
                      <button onClick={() => setActiveTab('التجار')} className="text-xs text-[#C9A84C] hover:opacity-80 flex items-center gap-1">عرض الكل <ChevronLeft size={12} /></button>
                    </div>
                    <div className="space-y-3">
                      {merchants.slice(0, 4).map((m, i) => (
                        <motion.div key={m.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-[rgba(201,168,76,0.03)] transition-colors" style={{ border: '1px solid rgba(201,168,76,0.06)' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgba(201,168,76,0.2)] to-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-[#C9A84C] font-bold text-xs">{m.name.charAt(0)}</div>
                            <div><p className="text-xs font-medium text-foreground">{m.name}</p><p className="text-[10px] text-muted-foreground">{m.category} · {m.booths} أكشاك</p></div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5 text-amber-400"><Star size={10} fill="currentColor" /><span className="text-xs font-bold">{m.rating}</span></div>
                            <span className="text-xs font-bold text-[#C9A84C]">{formatCurrency(m.totalSpent)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2"><Zap size={16} className="text-[#C9A84C]" /> رؤى الذكاء الاصطناعي</h3>
                    <div className="space-y-3">
                      {[
                        { icon: TrendingUp, text: 'نسبة إشغال الأكشاك وصلت 85% — أعلى معدل منذ إطلاق المنصة', type: 'success' as const },
                        { icon: AlertTriangle, text: '12 طلب حجز معلق لأكثر من 48 ساعة — يُنصح بتسريع المراجعة', type: 'warning' as const },
                        { icon: Package, text: 'قطاع الأغذية والمشروبات يحقق أعلى طلب — 35% من إجمالي الحجوزات', type: 'info' as const },
                        { icon: Star, text: 'مجموعة الشايع حققت أعلى تقييم (4.9) — مرشحة لبرنامج الشراكة المميزة', type: 'success' as const },
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

            {/* ═══ الأكشاك والمواقع ═══ */}
            {activeTab === 'الأكشاك والمواقع' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي الأكشاك" value="400" icon={MapPin} delay={0} />
                  <StatsCard title="محجوزة" value="342" icon={CheckCircle2} trend={85} trendLabel="إشغال" delay={0.1} />
                  <StatsCard title="متاحة" value="58" icon={Package} delay={0.2} />
                  <StatsCard title="قيد الصيانة" value="5" icon={AlertTriangle} delay={0.3} />
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">خريطة الأكشاك التفاعلية</h3>
                  <div className="h-64 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <div className="text-center">
                      <MapPin size={40} className="text-[rgba(201,168,76,0.3)] mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">خريطة الأكشاك التفاعلية</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">سيتم ربطها بنظام الخرائط عند توصيل الـ Backend</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">إحصائيات الأكشاك حسب النوع</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={boothTypes.map(b => ({ ...b, occupied: Math.round(b.value * 3.42), total: Math.round(b.value * 4) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                      <XAxis dataKey="name" tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'rgba(26,25,23,0.95)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} />
                      <Bar dataKey="total" fill="#6B6560" radius={[6, 6, 0, 0]} name="الإجمالي" />
                      <Bar dataKey="occupied" fill="#C9A84C" radius={[6, 6, 0, 0]} name="محجوز" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ═══ التجار ═══ */}
            {activeTab === 'التجار' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث عن تاجر..." className="w-full h-10 pr-9 pl-4 rounded-xl text-sm bg-card border border-border focus:border-[rgba(201,168,76,0.3)] outline-none transition-all" />
                  </div>
                  <button onClick={() => toast.info('تصفية — قريباً')} className="nour-btn-outline text-xs flex items-center gap-1.5"><Filter size={14} /> تصفية</button>
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/50">
                        {['التاجر', 'الفئة', 'الأكشاك', 'إجمالي الإنفاق', 'التقييم', 'KYC', 'الحالة', ''].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {merchants.filter(m => !searchQuery || m.name.includes(searchQuery)).map((m) => (
                          <tr key={m.id} className="border-b border-border/30 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgba(201,168,76,0.2)] to-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-[#C9A84C] font-bold text-xs">{m.name.charAt(0)}</div><div><p className="font-medium text-foreground text-xs">{m.name}</p><p className="text-[10px] text-muted-foreground">انضم {formatDate(m.joinDate)}</p></div></div></td>
                            <td className="p-4 text-xs text-muted-foreground">{m.category}</td>
                            <td className="p-4 text-xs text-center font-bold">{m.booths}</td>
                            <td className="p-4 text-xs font-bold text-[#C9A84C]">{formatCurrency(m.totalSpent)}</td>
                            <td className="p-4"><div className="flex items-center gap-0.5 text-amber-400"><Star size={10} fill="currentColor" /><span className="text-xs font-bold">{m.rating}</span></div></td>
                            <td className="p-4"><StatusBadge status={m.kycStatus} /></td>
                            <td className="p-4"><StatusBadge status={m.status} /></td>
                            <td className="p-4"><button className="p-1.5 rounded-lg hover:bg-[rgba(201,168,76,0.1)] text-muted-foreground hover:text-[#C9A84C] transition-all"><Eye size={14} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ الطلبات ═══ */}
            {activeTab === 'الطلبات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي الطلبات" value="48" icon={ShoppingBag} delay={0} />
                  <StatsCard title="معتمدة" value="28" icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="معلقة" value="12" icon={Clock} delay={0.2} />
                  <StatsCard title="مرفوضة" value="8" icon={AlertTriangle} delay={0.3} />
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/50">
                        {['رقم الطلب', 'التاجر', 'الفعالية', 'نوع الكشك', 'المساحة', 'السعر', 'الحالة', 'التاريخ'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {boothRequests.map((r) => (
                          <tr key={r.id} className="border-b border-border/30 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <td className="p-4 text-xs font-mono text-[#C9A84C]">{r.id}</td>
                            <td className="p-4 text-xs font-medium text-foreground">{r.merchant}</td>
                            <td className="p-4 text-xs text-muted-foreground">{r.event}</td>
                            <td className="p-4 text-xs">{r.boothType}</td>
                            <td className="p-4 text-xs font-mono">{r.size} م</td>
                            <td className="p-4 text-xs font-bold text-[#C9A84C]">{formatCurrency(r.price)}</td>
                            <td className="p-4"><StatusBadge status={r.status} /></td>
                            <td className="p-4 text-[10px] text-muted-foreground">{formatDate(r.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard title="العقود النشطة" value="3" icon={FileCheck} delay={0} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(4150000)} icon={DollarSign} delay={0.1} />
                  <StatsCard title="نسبة التحصيل" value="65%" icon={CreditCard} trend={8} trendLabel="تحسن" delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/50">
                        {['رقم العقد', 'التاجر', 'الفعالية', 'القيمة', 'الفترة', 'حالة العقد', 'حالة الدفع'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {contracts.map((c) => (
                          <tr key={c.id} className="border-b border-border/30 hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                            <td className="p-4 text-xs font-mono text-[#C9A84C]">{c.id}</td>
                            <td className="p-4 text-xs font-medium text-foreground">{c.merchant}</td>
                            <td className="p-4 text-xs text-muted-foreground">{c.event}</td>
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

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'تقرير الحجوزات', desc: 'تحليل شامل لحجوزات الأكشاك والمواقع', icon: MapPin, date: '2026-03-28' },
                  { title: 'تقرير التجار', desc: 'ملخص نشاط وتصنيف التجار', icon: Store, date: '2026-03-25' },
                  { title: 'تقرير الإيرادات', desc: 'تحليل الإيرادات والتحصيل المالي', icon: DollarSign, date: '2026-03-20' },
                  { title: 'تقرير الإشغال', desc: 'نسب إشغال الأكشاك حسب الفعالية', icon: BarChart3, date: '2026-03-15' },
                  { title: 'تقرير KYC', desc: 'حالة التحقق من هوية التجار', icon: FileCheck, date: '2026-03-10' },
                  { title: 'تقرير AI التنبؤي', desc: 'توقعات الطلب والإيرادات القادمة', icon: Zap, date: '2026-03-05' },
                ].map((report, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5 hover:border-[rgba(201,168,76,0.2)] transition-all duration-300 cursor-pointer group">
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
