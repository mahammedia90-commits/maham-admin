/* ═══════════════════════════════════════════════════════════════
   بوابة المستثمر — مركز تحكم شامل
   Nour Theme · Liquid Gold Executive
   11 تاب: نظرة عامة | المحفظة | المستثمرون | الفرص | العقود | المساحات | طلبات الإيجار | المدفوعات | الفريق | طلبات الزيارة | التقارير
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
import {
  Building2, TrendingUp, DollarSign, Users, Shield, AlertTriangle,
  CheckCircle2, ArrowUpRight, Briefcase, Target, Wallet, Calendar,
  Eye, Download, Filter, Search, ChevronLeft, Zap, Star, Award,
  FileText, LineChart, Globe, MapPin, CreditCard, UserPlus, Clock,
  SquareStack, Plus
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const tabs = ['نظرة عامة', 'المحفظة', 'المستثمرون', 'الفرص', 'العقود', 'المساحات', 'طلبات الإيجار', 'المدفوعات', 'الفريق', 'طلبات الزيارة', 'التقارير'] as const;
type TabType = typeof tabs[number];

const investmentTrend = [
  { month: 'يناير', استثمارات: 2400000, عوائد: 180000 },
  { month: 'فبراير', استثمارات: 3100000, عوائد: 240000 },
  { month: 'مارس', استثمارات: 4200000, عوائد: 380000 },
  { month: 'أبريل', استثمارات: 5800000, عوائد: 520000 },
  { month: 'مايو', استثمارات: 7200000, عوائد: 680000 },
  { month: 'يونيو', استثمارات: 8900000, عوائد: 890000 },
];

const sectorDistribution = [
  { name: 'معارض تجارية', value: 35, color: '#C9A84C' },
  { name: 'مؤتمرات', value: 25, color: '#B8860B' },
  { name: 'فعاليات ترفيهية', value: 20, color: '#DAA520' },
  { name: 'معارض صناعية', value: 12, color: '#8B7355' },
  { name: 'أخرى', value: 8, color: '#6B6560' },
];

const riskMatrix = [
  { category: 'منخفض', count: 18, percentage: 42, color: '#22c55e' },
  { category: 'متوسط', count: 15, percentage: 35, color: '#C9A84C' },
  { category: 'مرتفع', count: 7, percentage: 16, color: '#f59e0b' },
  { category: 'حرج', count: 3, percentage: 7, color: '#ef4444' },
];

const topInvestors = [
  { id: 1, name: 'مجموعة الراجحي للاستثمار', totalInvested: 12500000, activeDeals: 5, roi: 18.5, status: 'active', tier: 'بلاتيني', joinDate: '2024-01-15', sector: 'معارض تجارية' },
  { id: 2, name: 'شركة سابك للاستثمارات', totalInvested: 8700000, activeDeals: 3, roi: 15.2, status: 'active', tier: 'ذهبي', joinDate: '2024-03-20', sector: 'مؤتمرات' },
  { id: 3, name: 'صندوق الاستثمارات العامة', totalInvested: 25000000, activeDeals: 8, roi: 22.1, status: 'active', tier: 'بلاتيني', joinDate: '2023-11-01', sector: 'متنوع' },
  { id: 4, name: 'مجموعة بن لادن', totalInvested: 6200000, activeDeals: 2, roi: 12.8, status: 'pending', tier: 'فضي', joinDate: '2024-06-10', sector: 'فعاليات ترفيهية' },
  { id: 5, name: 'شركة أرامكو فنتشرز', totalInvested: 15800000, activeDeals: 6, roi: 19.7, status: 'active', tier: 'بلاتيني', joinDate: '2024-02-28', sector: 'معارض صناعية' },
];

const opportunities = [
  { id: 1, title: 'معرض الرياض الدولي للتقنية 2026', type: 'معرض تجاري', minInvestment: 500000, targetRaise: 5000000, raised: 3200000, deadline: '2026-06-15', expectedROI: 18, risk: 'منخفض', status: 'active' },
  { id: 2, title: 'مؤتمر الذكاء الاصطناعي السعودي', type: 'مؤتمر', minInvestment: 250000, targetRaise: 3000000, raised: 2100000, deadline: '2026-08-20', expectedROI: 22, risk: 'منخفض', status: 'active' },
  { id: 3, title: 'معرض جدة للسيارات الفاخرة', type: 'معرض متخصص', minInvestment: 1000000, targetRaise: 8000000, raised: 1500000, deadline: '2026-10-01', expectedROI: 25, risk: 'مرتفع', status: 'active' },
  { id: 4, title: 'فعالية موسم الرياض — بوليفارد', type: 'فعالية ترفيهية', minInvestment: 2000000, targetRaise: 15000000, raised: 9800000, deadline: '2026-12-01', expectedROI: 30, risk: 'متوسط', status: 'active' },
];

const contracts = [
  { id: 'INV-2026-001', investor: 'مجموعة الراجحي', event: 'معرض الرياض الدولي', value: 2500000, startDate: '2026-01-15', endDate: '2026-12-31', status: 'active', paymentStatus: 'paid' },
  { id: 'INV-2026-002', investor: 'شركة سابك', event: 'مؤتمر AI السعودي', value: 1800000, startDate: '2026-02-01', endDate: '2026-09-30', status: 'active', paymentStatus: 'paid' },
  { id: 'INV-2026-003', investor: 'صندوق الاستثمارات', event: 'موسم الرياض', value: 5000000, startDate: '2026-03-01', endDate: '2027-02-28', status: 'active', paymentStatus: 'pending' },
  { id: 'INV-2026-004', investor: 'مجموعة بن لادن', event: 'معرض جدة للسيارات', value: 3200000, startDate: '2026-04-15', endDate: '2026-11-30', status: 'pending', paymentStatus: 'unpaid' },
];

// ═══ بيانات جديدة ═══
interface Space { id: number; name: string; event: string; area: string; type: string; price: number; status: string; }
const spaces: Space[] = [
  { id: 1, name: 'جناح A-101', event: 'معرض الرياض الدولي', area: '100 م²', type: 'جناح رئيسي', price: 250000, status: 'occupied' },
  { id: 2, name: 'جناح B-205', event: 'معرض الرياض الدولي', area: '50 م²', type: 'جناح عادي', price: 120000, status: 'available' },
  { id: 3, name: 'جناح VIP-01', event: 'مؤتمر AI السعودي', area: '200 م²', type: 'VIP', price: 500000, status: 'reserved' },
  { id: 4, name: 'كشك C-12', event: 'معرض جدة للسيارات', area: '25 م²', type: 'كشك', price: 45000, status: 'available' },
  { id: 5, name: 'جناح D-310', event: 'موسم الرياض', area: '75 م²', type: 'جناح عادي', price: 180000, status: 'occupied' },
];

interface RentalRequest { id: string; investor: string; space: string; event: string; requestDate: string; amount: number; status: string; }
const rentalRequests: RentalRequest[] = [
  { id: 'RR-001', investor: 'مجموعة الراجحي', space: 'جناح A-101', event: 'معرض الرياض الدولي', requestDate: '2026-03-01', amount: 250000, status: 'approved' },
  { id: 'RR-002', investor: 'شركة سابك', space: 'جناح VIP-01', event: 'مؤتمر AI', requestDate: '2026-03-05', amount: 500000, status: 'pending' },
  { id: 'RR-003', investor: 'أرامكو فنتشرز', space: 'جناح D-310', event: 'موسم الرياض', requestDate: '2026-03-10', amount: 180000, status: 'approved' },
  { id: 'RR-004', investor: 'مجموعة بن لادن', space: 'كشك C-12', event: 'معرض جدة', requestDate: '2026-03-15', amount: 45000, status: 'rejected' },
  { id: 'RR-005', investor: 'صندوق الاستثمارات', space: 'جناح B-205', event: 'معرض الرياض', requestDate: '2026-03-20', amount: 120000, status: 'pending' },
];

interface Payment { id: string; investor: string; amount: number; method: string; date: string; invoice: string; status: string; }
const payments: Payment[] = [
  { id: 'PAY-001', investor: 'مجموعة الراجحي', amount: 2500000, method: 'تحويل بنكي', date: '2026-01-20', invoice: 'INV-2026-001', status: 'completed' },
  { id: 'PAY-002', investor: 'شركة سابك', amount: 1800000, method: 'سداد', date: '2026-02-05', invoice: 'INV-2026-002', status: 'completed' },
  { id: 'PAY-003', investor: 'صندوق الاستثمارات', amount: 2500000, method: 'تحويل بنكي', date: '2026-03-10', invoice: 'INV-2026-003', status: 'completed' },
  { id: 'PAY-004', investor: 'صندوق الاستثمارات', amount: 2500000, method: 'تحويل بنكي', date: '2026-04-01', invoice: 'INV-2026-003', status: 'pending' },
  { id: 'PAY-005', investor: 'مجموعة بن لادن', amount: 3200000, method: 'مدى', date: '2026-04-15', invoice: 'INV-2026-004', status: 'overdue' },
];

interface TeamMember { id: number; name: string; role: string; email: string; phone: string; status: string; joinDate: string; }
const teamMembers: TeamMember[] = [
  { id: 1, name: 'فهد المطيري', role: 'مدير استثمارات', email: 'fahad@rajhi.sa', phone: '0501234567', status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'سارة العمري', role: 'محلل مالي', email: 'sara@sabic.sa', phone: '0559876543', status: 'active', joinDate: '2024-03-20' },
  { id: 3, name: 'خالد الدوسري', role: 'مدير عمليات', email: 'khalid@pif.sa', phone: '0541112233', status: 'active', joinDate: '2023-11-01' },
  { id: 4, name: 'نورة الحربي', role: 'مسؤول علاقات', email: 'noura@binladen.sa', phone: '0567778899', status: 'inactive', joinDate: '2024-06-10' },
];

interface VisitRequest { id: string; visitor: string; company: string; purpose: string; date: string; time: string; status: string; }
const visitRequests: VisitRequest[] = [
  { id: 'VR-001', visitor: 'عبدالرحمن الشمري', company: 'شركة نماء', purpose: 'اجتماع استثماري', date: '2026-04-05', time: '10:00', status: 'approved' },
  { id: 'VR-002', visitor: 'هند السبيعي', company: 'مجموعة الوطنية', purpose: 'جولة تعريفية', date: '2026-04-06', time: '14:00', status: 'pending' },
  { id: 'VR-003', visitor: 'ماجد الغامدي', company: 'صندوق رؤية', purpose: 'توقيع عقد', date: '2026-04-07', time: '11:30', status: 'approved' },
  { id: 'VR-004', visitor: 'ريم القحطاني', company: 'شركة الاتصالات', purpose: 'عرض فرصة', date: '2026-04-08', time: '09:00', status: 'rejected' },
  { id: 'VR-005', visitor: 'تركي العنزي', company: 'بنك البلاد', purpose: 'مراجعة محفظة', date: '2026-04-10', time: '13:00', status: 'pending' },
];

const tierColors: Record<string, string> = {
  'بلاتيني': 'bg-gradient-to-l from-purple-500/15 to-purple-500/5 text-purple-400 border border-purple-500/20',
  'ذهبي': 'bg-gradient-to-l from-gold/15 to-gold/5 text-gold border border-gold/20',
  'فضي': 'bg-gradient-to-l from-gray-400/15 to-gray-400/5 text-gray-300 border border-gray-400/20',
};

export default function InvestorPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة');
  const [searchQuery, setSearchQuery] = useState('');

  const totalInvested = topInvestors.reduce((s, i) => s + i.totalInvested, 0);
  const avgROI = (topInvestors.reduce((s, i) => s + i.roi, 0) / topInvestors.length).toFixed(1);
  const totalDeals = topInvestors.reduce((s, i) => s + i.activeDeals, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="بوابة المستثمر" subtitle="مركز التحكم الشامل لإدارة الاستثمارات والمستثمرين والفرص الاستثمارية" actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('تصدير — قريباً')}><Download className="w-3.5 h-3.5" /> تصدير</Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5" onClick={() => toast.info('فرصة جديدة — قريباً')}><Target className="w-3.5 h-3.5" /> فرصة جديدة</Button>
          </div>
        } />

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-thin" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
              'px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-300',
              activeTab === tab ? 'bg-gradient-to-l from-gold/15 to-gold/8 text-gold border border-gold/20 shadow-[0_0_12px_rgba(201,168,76,0.08)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}>{tab}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

            {/* ═══ نظرة عامة ═══ */}
            {activeTab === 'نظرة عامة' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي الاستثمارات" value={formatCurrency(totalInvested)} icon={DollarSign} trend={23.5} trendLabel="نمو سنوي" />
                  <StatsCard title="المستثمرون النشطون" value={topInvestors.filter(i => i.status === 'active').length.toString()} icon={Users} trend={12} delay={0.1} />
                  <StatsCard title="متوسط العائد ROI" value={`${avgROI}%`} icon={TrendingUp} trend={3.2} delay={0.2} />
                  <StatsCard title="الصفقات النشطة" value={totalDeals.toString()} icon={Briefcase} trend={8} delay={0.3} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold">اتجاه الاستثمارات والعوائد</h3>
                      <div className="flex items-center gap-3 text-[10px]"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> استثمارات</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> عوائد</span></div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={investmentTrend}>
                        <defs><linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient><linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" /><XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} /><YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} /><Area type="monotone" dataKey="استثمارات" stroke="#C9A84C" fill="url(#investGrad)" strokeWidth={2} /><Area type="monotone" dataKey="عوائد" stroke="#22c55e" fill="url(#returnGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">توزيع القطاعات</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie><Pie data={sectorDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">{sectorDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 11 }} /></RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">{sectorDistribution.map(s => <div key={s.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div><span className="font-bold">{s.value}%</span></div>)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> مصفوفة المخاطر</h3>
                    <div className="space-y-3">{riskMatrix.map(r => <div key={r.category} className="flex items-center gap-3"><span className="text-xs w-14 text-muted-foreground">{r.category}</span><div className="flex-1 h-8 rounded-lg overflow-hidden bg-card/50"><motion.div initial={{ width: 0 }} animate={{ width: `${r.percentage}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-lg flex items-center justify-end px-2" style={{ background: `${r.color}20`, borderRight: `3px solid ${r.color}` }}><span className="text-[10px] font-bold" style={{ color: r.color }}>{r.count} صفقة</span></motion.div></div><span className="text-xs font-bold w-10 text-left" style={{ color: r.color }}>{r.percentage}%</span></div>)}</div>
                  </div>
                  <div className="glass-card p-6 border-accent/15">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> رؤى الذكاء الاصطناعي</h3>
                    <div className="space-y-3">{[
                      { icon: TrendingUp, text: 'نمو الاستثمارات بنسبة 23.5% مقارنة بالربع السابق', type: 'success' as const },
                      { icon: AlertTriangle, text: '3 صفقات في منطقة الخطر الحرج تحتاج مراجعة فورية', type: 'warning' as const },
                      { icon: Target, text: 'فرصة في قطاع المؤتمرات التقنية — عائد متوقع 22%', type: 'info' as const },
                      { icon: Star, text: 'صندوق الاستثمارات حقق أعلى ROI بنسبة 22.1%', type: 'success' as const },
                    ].map((ins, i) => <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn('p-3 rounded-lg flex items-start gap-3 text-xs', ins.type === 'success' && 'bg-success/5 border border-success/10', ins.type === 'warning' && 'bg-warning/5 border border-warning/10', ins.type === 'info' && 'bg-accent/5 border border-accent/10')}><ins.icon className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', ins.type === 'success' && 'text-success', ins.type === 'warning' && 'text-warning', ins.type === 'info' && 'text-accent')} /><span className="text-muted-foreground leading-relaxed">{ins.text}</span></motion.div>)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ المحفظة ═══ */}
            {activeTab === 'المحفظة' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(68200000)} icon={Wallet} trend={15.3} />
                  <StatsCard title="العوائد المحققة" value={formatCurrency(8900000)} icon={TrendingUp} trend={22.1} delay={0.1} />
                  <StatsCard title="الصفقات المفتوحة" value="24" icon={Briefcase} delay={0.2} />
                  <StatsCard title="معدل النجاح" value="94.2%" icon={CheckCircle2} trend={2.1} delay={0.3} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">أداء المحفظة الشهري</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={investmentTrend}><CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" /><XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} /><YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} /><Bar dataKey="استثمارات" fill="#C9A84C" radius={[6, 6, 0, 0]} /><Bar dataKey="عوائد" fill="#22c55e" radius={[6, 6, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">تصنيف الاستثمارات</h3>
                    <div className="space-y-4">{[
                      { label: 'نشطة ومربحة', count: 18, value: 42000000, color: '#22c55e', pct: 62 },
                      { label: 'قيد التنفيذ', count: 8, value: 18500000, color: '#C9A84C', pct: 27 },
                      { label: 'قيد المراجعة', count: 4, value: 5200000, color: '#f59e0b', pct: 8 },
                      { label: 'مكتملة', count: 12, value: 2500000, color: '#6B6560', pct: 3 },
                    ].map(item => <div key={item.label} className="space-y-1.5"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{item.label} ({item.count})</span><span className="font-bold" style={{ color: item.color }}>{formatCurrency(item.value)}</span></div><div className="h-2 rounded-full overflow-hidden bg-card/50"><motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: item.color }} /></div></div>)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ المستثمرون ═══ */}
            {activeTab === 'المستثمرون' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث عن مستثمر..." className="w-full h-10 pr-9 pl-4 rounded-xl text-sm bg-card border border-border focus:border-accent/30 outline-none transition-all" /></div>
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['المستثمر', 'التصنيف', 'إجمالي الاستثمار', 'الصفقات', 'ROI', 'القطاع', 'الحالة', ''].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{topInvestors.filter(i => !searchQuery || i.name.includes(searchQuery)).map(inv => <tr key={inv.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs">{inv.name.charAt(0)}</div><div><p className="font-medium text-xs">{inv.name}</p><p className="text-[10px] text-muted-foreground">انضم {formatDate(inv.joinDate)}</p></div></div></td><td className="p-4"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', tierColors[inv.tier])}>{inv.tier}</span></td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(inv.totalInvested)}</td><td className="p-4 text-xs text-center">{inv.activeDeals}</td><td className="p-4"><span className="text-xs font-bold text-success flex items-center gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" />{inv.roi}%</span></td><td className="p-4 text-xs text-muted-foreground">{inv.sector}</td><td className="p-4"><StatusBadge status={inv.status} /></td><td className="p-4"><button className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all"><Eye className="w-3.5 h-3.5" /></button></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ الفرص ═══ */}
            {activeTab === 'الفرص' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{opportunities.map((opp, i) => <motion.div key={opp.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 hover:border-accent/20 transition-all"><div className="flex items-start justify-between mb-3"><div><h4 className="text-sm font-bold mb-1">{opp.title}</h4><span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/8 text-accent/70 border border-accent/15">{opp.type}</span></div><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', opp.risk === 'منخفض' && 'bg-success/10 text-success border border-success/15', opp.risk === 'متوسط' && 'bg-warning/10 text-warning border border-warning/15', opp.risk === 'مرتفع' && 'bg-danger/10 text-danger border border-danger/15')}>مخاطر {opp.risk}ة</span></div><div className="mb-3"><div className="h-2 rounded-full overflow-hidden bg-card/50"><motion.div initial={{ width: 0 }} animate={{ width: `${(opp.raised / opp.targetRaise) * 100}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-accent" /></div><div className="flex items-center justify-between text-[10px] mt-1"><span className="text-muted-foreground">{formatCurrency(opp.raised)}</span><span className="text-muted-foreground">{formatCurrency(opp.targetRaise)}</span></div></div><div className="grid grid-cols-3 gap-2 text-[10px] mb-3"><div className="p-2 rounded-lg text-center bg-accent/5"><span className="text-muted-foreground block">الحد الأدنى</span><span className="font-bold">{formatCurrency(opp.minInvestment)}</span></div><div className="p-2 rounded-lg text-center bg-success/5"><span className="text-muted-foreground block">العائد المتوقع</span><span className="font-bold text-success">{opp.expectedROI}%</span></div><div className="p-2 rounded-lg text-center bg-card/50"><span className="text-muted-foreground block">الموعد النهائي</span><span className="font-bold">{formatDate(opp.deadline)}</span></div></div><Button variant="outline" size="sm" className="w-full text-xs">عرض التفاصيل</Button></motion.div>)}</div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatsCard title="العقود النشطة" value="3" icon={FileText} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(12500000)} icon={DollarSign} delay={0.1} />
                  <StatsCard title="نسبة التحصيل" value="78%" icon={CheckCircle2} trend={5} delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['رقم العقد', 'المستثمر', 'الفعالية', 'القيمة', 'الفترة', 'حالة العقد', 'الدفع'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{contracts.map(c => <tr key={c.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4 text-xs font-mono text-accent">{c.id}</td><td className="p-4 text-xs font-medium">{c.investor}</td><td className="p-4 text-xs text-muted-foreground">{c.event}</td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(c.value)}</td><td className="p-4 text-[10px] text-muted-foreground">{formatDate(c.startDate)} — {formatDate(c.endDate)}</td><td className="p-4"><StatusBadge status={c.status} /></td><td className="p-4"><StatusBadge status={c.paymentStatus} /></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ المساحات ═══ */}
            {activeTab === 'المساحات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي المساحات" value={spaces.length} icon={MapPin} />
                  <StatsCard title="متاحة" value={spaces.filter(s => s.status === 'available').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="مشغولة" value={spaces.filter(s => s.status === 'occupied').length} icon={Building2} delay={0.2} />
                  <StatsCard title="محجوزة" value={spaces.filter(s => s.status === 'reserved').length} icon={Clock} delay={0.3} />
                </div>
                {(() => { const cols: Column<Space>[] = [
                  { key: 'name', label: 'المساحة', render: (_, r) => <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.type} — {r.area}</p></div> },
                  { key: 'event', label: 'الفعالية' },
                  { key: 'price', label: 'السعر', render: v => <span className="font-mono font-bold text-accent">{formatCurrency(v)}</span> },
                  { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
                ]; return <DataTable columns={cols} data={spaces} searchValue={searchQuery} onSearch={setSearchQuery} searchPlaceholder="بحث في المساحات..." emptyMessage="لا توجد مساحات" />; })()}
              </div>
            )}

            {/* ═══ طلبات الإيجار ═══ */}
            {activeTab === 'طلبات الإيجار' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="إجمالي الطلبات" value={rentalRequests.length} icon={SquareStack} />
                  <StatsCard title="بانتظار الموافقة" value={rentalRequests.filter(r => r.status === 'pending').length} icon={Clock} delay={0.1} />
                  <StatsCard title="معتمدة" value={rentalRequests.filter(r => r.status === 'approved').length} icon={CheckCircle2} delay={0.2} />
                </div>
                {(() => { const cols: Column<RentalRequest>[] = [
                  { key: 'id', label: 'رقم الطلب', render: v => <span className="font-mono text-xs text-accent">{v}</span> },
                  { key: 'investor', label: 'المستثمر' },
                  { key: 'space', label: 'المساحة' },
                  { key: 'event', label: 'الفعالية' },
                  { key: 'amount', label: 'المبلغ', render: v => <span className="font-mono font-bold text-accent">{formatCurrency(v)}</span> },
                  { key: 'requestDate', label: 'التاريخ', render: v => <span className="text-xs text-muted-foreground">{formatDate(v)}</span> },
                  { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
                ]; return <DataTable columns={cols} data={rentalRequests} searchValue={searchQuery} onSearch={setSearchQuery} searchPlaceholder="بحث في الطلبات..." emptyMessage="لا توجد طلبات" />; })()}
              </div>
            )}

            {/* ═══ المدفوعات ═══ */}
            {activeTab === 'المدفوعات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي المدفوعات" value={formatCurrency(payments.reduce((s, p) => s + p.amount, 0))} icon={CreditCard} />
                  <StatsCard title="مكتملة" value={payments.filter(p => p.status === 'completed').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="معلقة" value={payments.filter(p => p.status === 'pending').length} icon={Clock} delay={0.2} />
                  <StatsCard title="متأخرة" value={payments.filter(p => p.status === 'overdue').length} icon={AlertTriangle} delay={0.3} />
                </div>
                {(() => { const cols: Column<Payment>[] = [
                  { key: 'id', label: 'رقم الدفعة', render: v => <span className="font-mono text-xs text-accent">{v}</span> },
                  { key: 'investor', label: 'المستثمر' },
                  { key: 'amount', label: 'المبلغ', render: v => <span className="font-mono font-bold text-accent">{formatCurrency(v)}</span> },
                  { key: 'method', label: 'طريقة الدفع' },
                  { key: 'date', label: 'التاريخ', render: v => <span className="text-xs text-muted-foreground">{formatDate(v)}</span> },
                  { key: 'invoice', label: 'الفاتورة', render: v => <span className="font-mono text-xs">{v}</span> },
                  { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
                ]; return <DataTable columns={cols} data={payments} searchValue={searchQuery} onSearch={setSearchQuery} searchPlaceholder="بحث في المدفوعات..." emptyMessage="لا توجد مدفوعات" />; })()}
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
                  <StatsCard title="بانتظار الموافقة" value={visitRequests.filter(v => v.status === 'pending').length} icon={Clock} delay={0.2} />
                </div>
                {(() => { const cols: Column<VisitRequest>[] = [
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
                { title: 'تقرير الأداء الاستثماري', desc: 'تحليل شامل لأداء المحفظة', icon: LineChart, date: '2026-03-28' },
                { title: 'تقرير المخاطر', desc: 'تقييم المخاطر للصفقات النشطة', icon: Shield, date: '2026-03-25' },
                { title: 'تقرير المستثمرين', desc: 'ملخص نشاط المستثمرين', icon: Users, date: '2026-03-20' },
                { title: 'تقرير الفرص', desc: 'تحليل الفرص المتاحة', icon: Target, date: '2026-03-15' },
                { title: 'تقرير العقود', desc: 'حالة العقود والتحصيل', icon: FileText, date: '2026-03-10' },
                { title: 'تقرير AI التنبؤي', desc: 'توقعات الربع القادم', icon: Zap, date: '2026-03-05' },
              ].map((r, i) => <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5 hover:border-accent/20 transition-all cursor-pointer group"><div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center group-hover:bg-accent/15 transition-all"><r.icon className="w-4 h-4 text-accent" /></div><div className="flex-1"><h4 className="text-sm font-bold">{r.title}</h4><p className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</p></div></div><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {formatDate(r.date)}</span><button onClick={() => toast.info('تحميل — قريباً')} className="text-[10px] text-accent flex items-center gap-1 hover:text-accent/80"><Download className="w-2.5 h-2.5" /> تحميل</button></div></motion.div>)}</div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
