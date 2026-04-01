/* ═══════════════════════════════════════════════════════════════
   بوابة التاجر — مركز تحكم شامل
   Nour Theme · Liquid Gold Executive
   10 تابات: نظرة عامة | الأكشاك | التجار | الطلبات | العقود | الفعاليات | الخدمات | الفريق | طلبات الزيارة | التقارير
   ═══════════════════════════════════════════════════════════════ */
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable, { Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Store, ShoppingBag, MapPin, Users, FileCheck, CreditCard,
  Star, Eye, Download, Filter, Search, Calendar,
  Package, CheckCircle2, Clock, AlertTriangle, BarChart3,
  Zap, TrendingUp, DollarSign, ChevronLeft, Plus, Wrench,
  Globe, UserPlus, CalendarDays
} from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = ['نظرة عامة', 'الأكشاك والمواقع', 'التجار', 'الطلبات', 'العقود', 'الفعاليات', 'الخدمات', 'الفريق', 'طلبات الزيارة', 'التقارير'] as const;
type TabType = typeof tabs[number];

const bookingTrend = [
  { month: 'يناير', حجوزات: 45, إيرادات: 1200000 },
  { month: 'فبراير', حجوزات: 62, إيرادات: 1800000 },
  { month: 'مارس', حجوزات: 78, إيرادات: 2400000 },
  { month: 'أبريل', حجوزات: 95, إيرادات: 3100000 },
  { month: 'مايو', حجوزات: 110, إيرادات: 3800000 },
  { month: 'يونيو', حجوزات: 128, إيرادات: 4500000 },
];

const boothTypes = [
  { name: 'أكشاك عادية', value: 45, color: '#C9A84C' },
  { name: 'أجنحة رئيسية', value: 25, color: '#B8860B' },
  { name: 'مساحات VIP', value: 15, color: '#DAA520' },
  { name: 'أكشاك طعام', value: 15, color: '#8B7355' },
];

const booths = [
  { id: 1, code: 'A-101', zone: 'المنطقة A', area: '50 م²', type: 'جناح رئيسي', price: 120000, event: 'معرض الرياض الدولي', tenant: 'شركة التقنية المتقدمة', status: 'occupied' },
  { id: 2, code: 'B-205', zone: 'المنطقة B', area: '25 م²', type: 'كشك عادي', price: 45000, event: 'معرض الرياض الدولي', tenant: null, status: 'available' },
  { id: 3, code: 'VIP-01', zone: 'منطقة VIP', area: '100 م²', type: 'VIP', price: 250000, event: 'مؤتمر AI', tenant: 'شركة الذكاء الاصطناعي', status: 'occupied' },
  { id: 4, code: 'C-12', zone: 'المنطقة C', area: '15 م²', type: 'كشك طعام', price: 35000, event: 'موسم الرياض', tenant: null, status: 'available' },
  { id: 5, code: 'D-310', zone: 'المنطقة D', area: '40 م²', type: 'جناح عادي', price: 85000, event: 'معرض جدة', tenant: 'مؤسسة الخليج', status: 'reserved' },
];

const merchants = [
  { id: 1, name: 'شركة التقنية المتقدمة', cr: '1010123456', category: 'تقنية', booths: 3, totalSpent: 450000, rating: 4.8, status: 'active', joinDate: '2024-02-15' },
  { id: 2, name: 'مؤسسة الخليج التجارية', cr: '1010234567', category: 'تجارة عامة', booths: 2, totalSpent: 280000, rating: 4.5, status: 'active', joinDate: '2024-04-20' },
  { id: 3, name: 'شركة الذكاء الاصطناعي', cr: '1010345678', category: 'تقنية', booths: 1, totalSpent: 250000, rating: 4.9, status: 'active', joinDate: '2024-01-10' },
  { id: 4, name: 'مطاعم الشرق', cr: '1010456789', category: 'أغذية ومشروبات', booths: 4, totalSpent: 180000, rating: 4.2, status: 'pending', joinDate: '2024-06-01' },
  { id: 5, name: 'شركة الأزياء العربية', cr: '1010567890', category: 'أزياء', booths: 2, totalSpent: 320000, rating: 4.6, status: 'active', joinDate: '2024-03-15' },
];

const requests = [
  { id: 'REQ-001', merchant: 'شركة التقنية المتقدمة', booth: 'A-101', event: 'معرض الرياض', amount: 120000, date: '2026-03-01', status: 'approved' },
  { id: 'REQ-002', merchant: 'مؤسسة الخليج', booth: 'D-310', event: 'معرض جدة', amount: 85000, date: '2026-03-05', status: 'pending' },
  { id: 'REQ-003', merchant: 'شركة الذكاء الاصطناعي', booth: 'VIP-01', event: 'مؤتمر AI', amount: 250000, date: '2026-03-10', status: 'approved' },
  { id: 'REQ-004', merchant: 'مطاعم الشرق', booth: 'C-12', event: 'موسم الرياض', amount: 35000, date: '2026-03-15', status: 'rejected' },
  { id: 'REQ-005', merchant: 'شركة الأزياء', booth: 'B-205', event: 'معرض الرياض', amount: 45000, date: '2026-03-20', status: 'pending' },
];

const merchantContracts = [
  { id: 'MC-2026-001', merchant: 'شركة التقنية المتقدمة', event: 'معرض الرياض', value: 360000, start: '2026-01-15', end: '2026-12-31', status: 'active', payment: 'paid' },
  { id: 'MC-2026-002', merchant: 'شركة الذكاء الاصطناعي', event: 'مؤتمر AI', value: 250000, start: '2026-02-01', end: '2026-09-30', status: 'active', payment: 'paid' },
  { id: 'MC-2026-003', merchant: 'مؤسسة الخليج', event: 'معرض جدة', value: 170000, start: '2026-04-01', end: '2026-11-30', status: 'pending', payment: 'unpaid' },
];

// ═══ بيانات جديدة ═══
interface MEvent { id: number; name: string; date: string; location: string; booths: number; booked: number; status: string; }
const events: MEvent[] = [
  { id: 1, name: 'معرض الرياض الدولي للتقنية 2026', date: '2026-06-15', location: 'مركز الرياض للمعارض', booths: 200, booked: 165, status: 'active' },
  { id: 2, name: 'مؤتمر الذكاء الاصطناعي السعودي', date: '2026-08-20', location: 'فندق الفيصلية', booths: 80, booked: 72, status: 'active' },
  { id: 3, name: 'معرض جدة للسيارات الفاخرة', date: '2026-10-01', location: 'جدة سوبر دوم', booths: 120, booked: 45, status: 'upcoming' },
  { id: 4, name: 'فعالية موسم الرياض — بوليفارد', date: '2026-12-01', location: 'بوليفارد سيتي', booths: 300, booked: 180, status: 'upcoming' },
];

interface MService { id: number; name: string; category: string; price: number; unit: string; requests: number; status: string; }
const services: MService[] = [
  { id: 1, name: 'كهرباء إضافية (220V)', category: 'بنية تحتية', price: 5000, unit: 'لكل كشك', requests: 45, status: 'active' },
  { id: 2, name: 'إنترنت فائق السرعة', category: 'اتصالات', price: 3000, unit: 'لكل كشك', requests: 78, status: 'active' },
  { id: 3, name: 'تصميم وتجهيز الكشك', category: 'تصميم', price: 25000, unit: 'لكل كشك', requests: 32, status: 'active' },
  { id: 4, name: 'نظام صوتي متكامل', category: 'تقنية', price: 8000, unit: 'لكل كشك', requests: 18, status: 'active' },
  { id: 5, name: 'شاشة عرض LED', category: 'تقنية', price: 15000, unit: 'لكل وحدة', requests: 25, status: 'active' },
  { id: 6, name: 'خدمة تنظيف يومية', category: 'خدمات', price: 2000, unit: 'يومياً', requests: 90, status: 'active' },
];

interface MTeam { id: number; name: string; role: string; email: string; phone: string; status: string; }
const teamMembers: MTeam[] = [
  { id: 1, name: 'أحمد الحربي', role: 'مدير عمليات التجار', email: 'ahmed@maham.sa', phone: '0501234567', status: 'active' },
  { id: 2, name: 'منى السلمي', role: 'مسؤول حجوزات', email: 'mona@maham.sa', phone: '0559876543', status: 'active' },
  { id: 3, name: 'عبدالله الزهراني', role: 'مشرف ميداني', email: 'abdullah@maham.sa', phone: '0541112233', status: 'active' },
  { id: 4, name: 'لمياء العتيبي', role: 'خدمة عملاء', email: 'lamia@maham.sa', phone: '0567778899', status: 'inactive' },
];

interface MVisit { id: string; visitor: string; company: string; purpose: string; date: string; time: string; status: string; }
const visitRequests: MVisit[] = [
  { id: 'MV-001', visitor: 'محمد الشهري', company: 'شركة النور', purpose: 'استلام كشك', date: '2026-04-05', time: '09:00', status: 'approved' },
  { id: 'MV-002', visitor: 'فاطمة العمري', company: 'مؤسسة الرواد', purpose: 'معاينة موقع', date: '2026-04-06', time: '11:00', status: 'pending' },
  { id: 'MV-003', visitor: 'سعود القحطاني', company: 'شركة البناء', purpose: 'تجهيز كشك', date: '2026-04-07', time: '14:00', status: 'approved' },
  { id: 'MV-004', visitor: 'هدى الدوسري', company: 'مطاعم الوادي', purpose: 'فحص معدات', date: '2026-04-08', time: '10:30', status: 'rejected' },
];

export default function MerchantPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة');
  const [searchQuery, setSearchQuery] = useState('');

  const totalRevenue = booths.filter(b => b.status === 'occupied').reduce((s, b) => s + b.price, 0);
  const occupancyRate = ((booths.filter(b => b.status === 'occupied').length / booths.length) * 100).toFixed(0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="بوابة التاجر" subtitle="مركز إدارة التجار والأكشاك والحجوزات والفعاليات" actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('تصدير — قريباً')}><Download className="w-3.5 h-3.5" /> تصدير</Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5" onClick={() => toast.info('تاجر جديد — قريباً')}><Plus className="w-3.5 h-3.5" /> تاجر جديد</Button>
          </div>
        } />

        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-thin" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
          {tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300', activeTab === tab ? 'bg-gradient-to-l from-gold/15 to-gold/8 text-gold border border-gold/20 shadow-[0_0_12px_rgba(201,168,76,0.08)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5')}>{tab}</button>)}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* ═══ نظرة عامة ═══ */}
            {activeTab === 'نظرة عامة' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} icon={DollarSign} trend={18.5} />
                  <StatsCard title="التجار النشطون" value={merchants.filter(m => m.status === 'active').length} icon={Store} trend={12} delay={0.1} />
                  <StatsCard title="نسبة الإشغال" value={`${occupancyRate}%`} icon={MapPin} trend={5} delay={0.2} />
                  <StatsCard title="الطلبات المعلقة" value={requests.filter(r => r.status === 'pending').length} icon={Clock} delay={0.3} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">اتجاه الحجوزات والإيرادات</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={bookingTrend}><CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" /><XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} /><YAxis yAxisId="left" tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} /><YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} /><Bar yAxisId="left" dataKey="حجوزات" fill="#C9A84C" radius={[6, 6, 0, 0]} /><Bar yAxisId="right" dataKey="إيرادات" fill="#22c55e" radius={[6, 6, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">أنواع الأكشاك</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie><Pie data={boothTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">{boothTypes.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 11 }} /></RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">{boothTypes.map(t => <div key={t.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} /><span className="text-muted-foreground">{t.name}</span></div><span className="font-bold">{t.value}%</span></div>)}</div>
                  </div>
                </div>
                <div className="glass-card p-6 border-accent/15">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> رؤى الذكاء الاصطناعي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[
                    { icon: TrendingUp, text: 'نمو الحجوزات بنسبة 18.5% — يُنصح بزيادة المساحات المتاحة', type: 'success' as const },
                    { icon: AlertTriangle, text: '2 طلبات معلقة منذ أكثر من 5 أيام تحتاج مراجعة', type: 'warning' as const },
                    { icon: Star, text: 'قطاع التقنية الأعلى طلباً — 45% من الحجوزات', type: 'info' as const },
                    { icon: Store, text: 'تاجر واحد بانتظار اعتماد — مطاعم الشرق', type: 'warning' as const },
                  ].map((ins, i) => <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn('p-3 rounded-lg flex items-start gap-3 text-xs', ins.type === 'success' && 'bg-success/5 border border-success/10', ins.type === 'warning' && 'bg-warning/5 border border-warning/10', ins.type === 'info' && 'bg-accent/5 border border-accent/10')}><ins.icon className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', ins.type === 'success' && 'text-success', ins.type === 'warning' && 'text-warning', ins.type === 'info' && 'text-accent')} /><span className="text-muted-foreground leading-relaxed">{ins.text}</span></motion.div>)}</div>
                </div>
              </div>
            )}

            {/* ═══ الأكشاك والمواقع ═══ */}
            {activeTab === 'الأكشاك والمواقع' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي الأكشاك" value={booths.length} icon={MapPin} />
                  <StatsCard title="مشغولة" value={booths.filter(b => b.status === 'occupied').length} icon={Store} delay={0.1} />
                  <StatsCard title="متاحة" value={booths.filter(b => b.status === 'available').length} icon={CheckCircle2} delay={0.2} />
                  <StatsCard title="محجوزة" value={booths.filter(b => b.status === 'reserved').length} icon={Clock} delay={0.3} />
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['الكود', 'المنطقة', 'النوع', 'المساحة', 'السعر', 'الفعالية', 'المستأجر', 'الحالة'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{booths.map(b => <tr key={b.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4 text-xs font-mono text-accent">{b.code}</td><td className="p-4 text-xs">{b.zone}</td><td className="p-4 text-xs">{b.type}</td><td className="p-4 text-xs text-muted-foreground">{b.area}</td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(b.price)}</td><td className="p-4 text-xs text-muted-foreground">{b.event}</td><td className="p-4 text-xs">{b.tenant || '—'}</td><td className="p-4"><StatusBadge status={b.status} /></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ التجار ═══ */}
            {activeTab === 'التجار' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3"><div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث عن تاجر..." className="w-full h-10 pr-9 pl-4 rounded-xl text-sm bg-card border border-border focus:border-accent/30 outline-none transition-all" /></div></div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['التاجر', 'السجل التجاري', 'الفئة', 'الأكشاك', 'إجمالي الإنفاق', 'التقييم', 'الحالة', ''].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{merchants.filter(m => !searchQuery || m.name.includes(searchQuery)).map(m => <tr key={m.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs">{m.name.charAt(0)}</div><div><p className="font-medium text-xs">{m.name}</p><p className="text-[10px] text-muted-foreground">انضم {formatDate(m.joinDate)}</p></div></div></td><td className="p-4 text-xs font-mono">{m.cr}</td><td className="p-4 text-xs">{m.category}</td><td className="p-4 text-xs text-center">{m.booths}</td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(m.totalSpent)}</td><td className="p-4"><div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 text-accent fill-accent" /><span className="font-bold">{m.rating}</span></div></td><td className="p-4"><StatusBadge status={m.status} /></td><td className="p-4"><button className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all"><Eye className="w-3.5 h-3.5" /></button></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ الطلبات ═══ */}
            {activeTab === 'الطلبات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="إجمالي الطلبات" value={requests.length} icon={Package} />
                  <StatsCard title="معتمدة" value={requests.filter(r => r.status === 'approved').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="معلقة" value={requests.filter(r => r.status === 'pending').length} icon={Clock} delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['رقم الطلب', 'التاجر', 'الكشك', 'الفعالية', 'المبلغ', 'التاريخ', 'الحالة'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{requests.map(r => <tr key={r.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4 text-xs font-mono text-accent">{r.id}</td><td className="p-4 text-xs font-medium">{r.merchant}</td><td className="p-4 text-xs">{r.booth}</td><td className="p-4 text-xs text-muted-foreground">{r.event}</td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(r.amount)}</td><td className="p-4 text-xs text-muted-foreground">{formatDate(r.date)}</td><td className="p-4"><StatusBadge status={r.status} /></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="العقود النشطة" value={merchantContracts.filter(c => c.status === 'active').length} icon={FileCheck} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(merchantContracts.reduce((s, c) => s + c.value, 0))} icon={DollarSign} delay={0.1} />
                  <StatsCard title="نسبة التحصيل" value={`${((merchantContracts.filter(c => c.payment === 'paid').length / merchantContracts.length) * 100).toFixed(0)}%`} icon={CreditCard} delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['رقم العقد', 'التاجر', 'الفعالية', 'القيمة', 'الفترة', 'الحالة', 'الدفع'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{merchantContracts.map(c => <tr key={c.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4 text-xs font-mono text-accent">{c.id}</td><td className="p-4 text-xs font-medium">{c.merchant}</td><td className="p-4 text-xs text-muted-foreground">{c.event}</td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(c.value)}</td><td className="p-4 text-[10px] text-muted-foreground">{formatDate(c.start)} — {formatDate(c.end)}</td><td className="p-4"><StatusBadge status={c.status} /></td><td className="p-4"><StatusBadge status={c.payment} /></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ الفعاليات ═══ */}
            {activeTab === 'الفعاليات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي الفعاليات" value={events.length} icon={CalendarDays} />
                  <StatsCard title="نشطة" value={events.filter(e => e.status === 'active').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="إجمالي الأكشاك" value={events.reduce((s, e) => s + e.booths, 0)} icon={MapPin} delay={0.2} />
                  <StatsCard title="نسبة الحجز" value={`${((events.reduce((s, e) => s + e.booked, 0) / events.reduce((s, e) => s + e.booths, 0)) * 100).toFixed(0)}%`} icon={TrendingUp} delay={0.3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{events.map((ev, i) => <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 hover:border-accent/20 transition-all">
                  <div className="flex items-start justify-between mb-3"><div><h4 className="text-sm font-bold mb-1">{ev.name}</h4><p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {ev.location}</p></div><StatusBadge status={ev.status} /></div>
                  <div className="mb-3"><div className="flex items-center justify-between text-[10px] mb-1"><span className="text-muted-foreground">نسبة الحجز</span><span className="font-bold text-accent">{ev.booked}/{ev.booths}</span></div><div className="h-2 rounded-full overflow-hidden bg-card/50"><motion.div initial={{ width: 0 }} animate={{ width: `${(ev.booked / ev.booths) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-accent" /></div></div>
                  <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(ev.date)}</span><Button variant="outline" size="sm" className="text-xs h-7">عرض التفاصيل</Button></div>
                </motion.div>)}</div>
              </div>
            )}

            {/* ═══ الخدمات ═══ */}
            {activeTab === 'الخدمات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="الخدمات المتاحة" value={services.length} icon={Wrench} />
                  <StatsCard title="إجمالي الطلبات" value={services.reduce((s, sv) => s + sv.requests, 0)} icon={Package} delay={0.1} />
                  <StatsCard title="الإيرادات المتوقعة" value={formatCurrency(services.reduce((s, sv) => s + (sv.price * sv.requests), 0))} icon={DollarSign} delay={0.2} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{services.map((sv, i) => <motion.div key={sv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4 hover:border-accent/20 transition-all">
                  <div className="flex items-start justify-between mb-2"><div><h4 className="text-sm font-bold">{sv.name}</h4><span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/8 text-accent/70 border border-accent/15">{sv.category}</span></div><StatusBadge status={sv.status} /></div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] mt-3"><div className="p-2 rounded-lg bg-accent/5 text-center"><span className="text-muted-foreground block">السعر</span><span className="font-bold text-accent">{formatCurrency(sv.price)}</span></div><div className="p-2 rounded-lg bg-card/50 text-center"><span className="text-muted-foreground block">الطلبات</span><span className="font-bold">{sv.requests}</span></div></div>
                  <p className="text-[10px] text-muted-foreground mt-2">{sv.unit}</p>
                </motion.div>)}</div>
              </div>
            )}

            {/* ═══ الفريق ═══ */}
            {activeTab === 'الفريق' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="أعضاء الفريق" value={teamMembers.length} icon={Users} />
                  <StatsCard title="نشطون" value={teamMembers.filter(t => t.status === 'active').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="غير نشطين" value={teamMembers.filter(t => t.status === 'inactive').length} icon={Clock} delay={0.2} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{teamMembers.map((m, i) => <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className="glass-card p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold">{m.name.charAt(0)}</div><div className="flex-1"><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-muted-foreground">{m.role}</p><p className="text-[10px] text-muted-foreground mt-1">{m.email} — {m.phone}</p></div><StatusBadge status={m.status} /></motion.div>)}</div>
              </div>
            )}

            {/* ═══ طلبات الزيارة ═══ */}
            {activeTab === 'طلبات الزيارة' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="إجمالي الطلبات" value={visitRequests.length} icon={Globe} />
                  <StatsCard title="معتمدة" value={visitRequests.filter(v => v.status === 'approved').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="معلقة" value={visitRequests.filter(v => v.status === 'pending').length} icon={Clock} delay={0.2} />
                </div>
                {(() => { const cols: Column<MVisit>[] = [
                  { key: 'id', label: 'رقم الطلب', render: v => <span className="font-mono text-xs text-accent">{v}</span> },
                  { key: 'visitor', label: 'الزائر' },
                  { key: 'company', label: 'الشركة' },
                  { key: 'purpose', label: 'الغرض' },
                  { key: 'date', label: 'التاريخ', render: (_, r) => <span className="text-xs text-muted-foreground">{r.date} — {r.time}</span> },
                  { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
                ]; return <DataTable columns={cols} data={visitRequests} searchValue={searchQuery} onSearch={setSearchQuery} searchPlaceholder="بحث في طلبات الزيارة..." emptyMessage="لا توجد طلبات" />; })()}
              </div>
            )}

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[
                { title: 'تقرير الحجوزات', desc: 'تحليل شامل لحركة الحجوزات', icon: BarChart3, date: '2026-03-28' },
                { title: 'تقرير الإيرادات', desc: 'إيرادات الأكشاك والخدمات', icon: DollarSign, date: '2026-03-25' },
                { title: 'تقرير التجار', desc: 'أداء وتصنيف التجار', icon: Store, date: '2026-03-20' },
                { title: 'تقرير الإشغال', desc: 'نسب الإشغال حسب المنطقة', icon: MapPin, date: '2026-03-15' },
                { title: 'تقرير الخدمات', desc: 'طلبات الخدمات الإضافية', icon: Wrench, date: '2026-03-10' },
                { title: 'تقرير AI التنبؤي', desc: 'توقعات الطلب للربع القادم', icon: Zap, date: '2026-03-05' },
              ].map((r, i) => <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5 hover:border-accent/20 transition-all cursor-pointer group"><div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center group-hover:bg-accent/15 transition-all"><r.icon className="w-4 h-4 text-accent" /></div><div className="flex-1"><h4 className="text-sm font-bold">{r.title}</h4><p className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</p></div></div><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {formatDate(r.date)}</span><button onClick={() => toast.info('تحميل — قريباً')} className="text-[10px] text-accent flex items-center gap-1 hover:text-accent/80"><Download className="w-2.5 h-2.5" /> تحميل</button></div></motion.div>)}</div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
