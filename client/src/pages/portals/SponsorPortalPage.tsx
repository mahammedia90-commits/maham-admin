/* ═══════════════════════════════════════════════════════════════
   بوابة الراعي — مركز تحكم شامل
   Nour Theme · Liquid Gold Executive
   11 تاب: نظرة عامة | الرعاة | حزم الرعاية | العقود | الأصول | التسليمات | التعرض | العملاء المحتملون | المدفوعات | ROI والأداء | التقارير
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
  Award, Crown, Target, Eye, Download, Filter, Search, Calendar,
  CheckCircle2, Clock, AlertTriangle, BarChart3, Zap, TrendingUp,
  DollarSign, ChevronLeft, Plus, Star, Users, Globe, Megaphone,
  Gift, Handshake, FileCheck, Percent, Image, Package, CreditCard,
  UserPlus, BarChart2, Layers
} from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const tabs = ['نظرة عامة', 'الرعاة', 'حزم الرعاية', 'العقود', 'الأصول', 'التسليمات', 'التعرض', 'العملاء المحتملون', 'المدفوعات', 'ROI والأداء', 'التقارير'] as const;
type TabType = typeof tabs[number];

const sponsorshipTrend = [
  { month: 'يناير', عقود: 8, قيمة: 3200000 },
  { month: 'فبراير', عقود: 12, قيمة: 5100000 },
  { month: 'مارس', عقود: 15, قيمة: 6800000 },
  { month: 'أبريل', عقود: 18, قيمة: 8500000 },
  { month: 'مايو', عقود: 22, قيمة: 10200000 },
  { month: 'يونيو', عقود: 25, قيمة: 12800000 },
];

const tierDistribution = [
  { name: 'بلاتيني', value: 15, color: '#9333ea' },
  { name: 'ذهبي', value: 30, color: '#C9A84C' },
  { name: 'فضي', value: 35, color: '#94a3b8' },
  { name: 'برونزي', value: 20, color: '#B8860B' },
];

const roiMetrics = [
  { subject: 'الوعي', A: 92, fullMark: 100 },
  { subject: 'التحويل', A: 78, fullMark: 100 },
  { subject: 'الوصول', A: 88, fullMark: 100 },
  { subject: 'التفاعل', A: 85, fullMark: 100 },
  { subject: 'الولاء', A: 72, fullMark: 100 },
];

const sponsors = [
  { id: 1, name: 'شركة الاتصالات السعودية STC', tier: 'بلاتيني', totalValue: 8500000, events: 5, roi: 24.5, status: 'active', joinDate: '2023-06-15' },
  { id: 2, name: 'بنك الراجحي', tier: 'ذهبي', totalValue: 4200000, events: 3, roi: 18.2, status: 'active', joinDate: '2024-01-20' },
  { id: 3, name: 'شركة أرامكو', tier: 'بلاتيني', totalValue: 12000000, events: 7, roi: 28.1, status: 'active', joinDate: '2023-03-10' },
  { id: 4, name: 'شركة سابك', tier: 'ذهبي', totalValue: 3800000, events: 2, roi: 15.6, status: 'active', joinDate: '2024-04-05' },
  { id: 5, name: 'شركة المراعي', tier: 'فضي', totalValue: 1500000, events: 2, roi: 12.3, status: 'pending', joinDate: '2024-08-01' },
];

const packages = [
  { id: 1, name: 'الحزمة البلاتينية', tier: 'بلاتيني', price: 5000000, benefits: 12, subscribers: 3, status: 'active' },
  { id: 2, name: 'الحزمة الذهبية', tier: 'ذهبي', price: 2500000, benefits: 8, subscribers: 6, status: 'active' },
  { id: 3, name: 'الحزمة الفضية', tier: 'فضي', price: 1000000, benefits: 5, subscribers: 8, status: 'active' },
  { id: 4, name: 'الحزمة البرونزية', tier: 'برونزي', price: 500000, benefits: 3, subscribers: 5, status: 'active' },
];

const sponsorContracts = [
  { id: 'SC-2026-001', sponsor: 'STC', event: 'معرض الرياض الدولي', value: 5000000, start: '2026-01-15', end: '2026-12-31', status: 'active', payment: 'paid' },
  { id: 'SC-2026-002', sponsor: 'بنك الراجحي', event: 'مؤتمر AI', value: 2500000, start: '2026-02-01', end: '2026-09-30', status: 'active', payment: 'paid' },
  { id: 'SC-2026-003', sponsor: 'أرامكو', event: 'موسم الرياض', value: 8000000, start: '2026-03-01', end: '2027-02-28', status: 'active', payment: 'partial' },
  { id: 'SC-2026-004', sponsor: 'المراعي', event: 'معرض جدة', value: 1000000, start: '2026-04-15', end: '2026-11-30', status: 'pending', payment: 'unpaid' },
];

const tierColors: Record<string, string> = {
  'بلاتيني': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'ذهبي': 'bg-accent/10 text-accent border border-accent/20',
  'فضي': 'bg-slate-400/10 text-slate-300 border border-slate-400/20',
  'برونزي': 'bg-amber-700/10 text-amber-600 border border-amber-700/20',
};

// ═══ بيانات جديدة ═══
interface SAsset { id: number; name: string; sponsor: string; type: string; event: string; location: string; status: string; uploadDate: string; }
const assets: SAsset[] = [
  { id: 1, name: 'شعار STC — لافتة رئيسية', sponsor: 'STC', type: 'لافتة', event: 'معرض الرياض', location: 'المدخل الرئيسي', status: 'approved', uploadDate: '2026-03-01' },
  { id: 2, name: 'فيديو أرامكو — شاشة LED', sponsor: 'أرامكو', type: 'فيديو', event: 'موسم الرياض', location: 'المسرح الرئيسي', status: 'approved', uploadDate: '2026-03-05' },
  { id: 3, name: 'بانر الراجحي — منطقة VIP', sponsor: 'بنك الراجحي', type: 'بانر', event: 'مؤتمر AI', location: 'منطقة VIP', status: 'pending', uploadDate: '2026-03-10' },
  { id: 4, name: 'ملصقات سابك — أكشاك', sponsor: 'سابك', type: 'ملصق', event: 'معرض الرياض', location: 'المنطقة B', status: 'approved', uploadDate: '2026-03-12' },
  { id: 5, name: 'شعار المراعي — كشك طعام', sponsor: 'المراعي', type: 'لافتة', event: 'معرض جدة', location: 'منطقة الطعام', status: 'rejected', uploadDate: '2026-03-15' },
];

interface SDeliverable { id: string; sponsor: string; title: string; type: string; dueDate: string; status: string; progress: number; }
const deliverables: SDeliverable[] = [
  { id: 'DEL-001', sponsor: 'STC', title: 'تغطية إعلامية — 5 منشورات', type: 'تسويق رقمي', dueDate: '2026-04-15', status: 'completed', progress: 100 },
  { id: 'DEL-002', sponsor: 'STC', title: 'جناح حصري في المعرض', type: 'مساحة عرض', dueDate: '2026-06-15', status: 'in_progress', progress: 65 },
  { id: 'DEL-003', sponsor: 'أرامكو', title: 'كلمة افتتاحية في المؤتمر', type: 'فعالية', dueDate: '2026-08-20', status: 'pending', progress: 0 },
  { id: 'DEL-004', sponsor: 'بنك الراجحي', title: 'شعار على جميع المطبوعات', type: 'علامة تجارية', dueDate: '2026-05-01', status: 'completed', progress: 100 },
  { id: 'DEL-005', sponsor: 'سابك', title: 'عرض تقديمي في ورشة العمل', type: 'فعالية', dueDate: '2026-07-10', status: 'in_progress', progress: 40 },
];

interface SExposure { id: number; sponsor: string; channel: string; impressions: number; clicks: number; ctr: number; period: string; }
const exposures: SExposure[] = [
  { id: 1, sponsor: 'STC', channel: 'لافتات المعرض', impressions: 250000, clicks: 0, ctr: 0, period: 'مارس 2026' },
  { id: 2, sponsor: 'STC', channel: 'وسائل التواصل', impressions: 1200000, clicks: 45000, ctr: 3.75, period: 'مارس 2026' },
  { id: 3, sponsor: 'أرامكو', channel: 'شاشات LED', impressions: 180000, clicks: 0, ctr: 0, period: 'مارس 2026' },
  { id: 4, sponsor: 'بنك الراجحي', channel: 'البريد الإلكتروني', impressions: 50000, clicks: 8500, ctr: 17, period: 'مارس 2026' },
  { id: 5, sponsor: 'سابك', channel: 'الموقع الإلكتروني', impressions: 320000, clicks: 28000, ctr: 8.75, period: 'مارس 2026' },
];

interface SLead { id: string; name: string; company: string; interest: string; source: string; date: string; status: string; value: number; }
const leads: SLead[] = [
  { id: 'SL-001', name: 'فهد الشمري', company: 'شركة زين', interest: 'رعاية ذهبية', source: 'موقع إلكتروني', date: '2026-03-20', status: 'hot', value: 2500000 },
  { id: 'SL-002', name: 'نورة الحمد', company: 'شركة موبايلي', interest: 'رعاية بلاتينية', source: 'إحالة', date: '2026-03-22', status: 'warm', value: 5000000 },
  { id: 'SL-003', name: 'عبدالعزيز المالكي', company: 'بنك البلاد', interest: 'رعاية فضية', source: 'معرض سابق', date: '2026-03-25', status: 'cold', value: 1000000 },
  { id: 'SL-004', name: 'ريم العتيبي', company: 'شركة الكهرباء', interest: 'رعاية ذهبية', source: 'LinkedIn', date: '2026-03-28', status: 'hot', value: 3000000 },
  { id: 'SL-005', name: 'ماجد الدوسري', company: 'شركة نادك', interest: 'رعاية برونزية', source: 'اتصال مباشر', date: '2026-03-30', status: 'warm', value: 500000 },
];

interface SPayment { id: string; sponsor: string; amount: number; method: string; date: string; contract: string; status: string; }
const sPayments: SPayment[] = [
  { id: 'SP-001', sponsor: 'STC', amount: 5000000, method: 'تحويل بنكي', date: '2026-01-20', contract: 'SC-2026-001', status: 'completed' },
  { id: 'SP-002', sponsor: 'بنك الراجحي', amount: 2500000, method: 'سداد', date: '2026-02-05', contract: 'SC-2026-002', status: 'completed' },
  { id: 'SP-003', sponsor: 'أرامكو', amount: 4000000, method: 'تحويل بنكي', date: '2026-03-10', contract: 'SC-2026-003', status: 'completed' },
  { id: 'SP-004', sponsor: 'أرامكو', amount: 4000000, method: 'تحويل بنكي', date: '2026-06-01', contract: 'SC-2026-003', status: 'pending' },
  { id: 'SP-005', sponsor: 'المراعي', amount: 1000000, method: 'مدى', date: '2026-04-15', contract: 'SC-2026-004', status: 'overdue' },
];

const leadStatusColors: Record<string, string> = {
  'hot': 'bg-red-500/10 text-red-400 border border-red-500/20',
  'warm': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'cold': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

export default function SponsorPortalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('نظرة عامة');
  const [searchQuery, setSearchQuery] = useState('');

  const totalValue = sponsors.reduce((s, sp) => s + sp.totalValue, 0);
  const avgROI = (sponsors.reduce((s, sp) => s + sp.roi, 0) / sponsors.length).toFixed(1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="بوابة الراعي" subtitle="مركز إدارة الرعاة والحزم والعقود والأصول والتسليمات" actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('تصدير — قريباً')}><Download className="w-3.5 h-3.5" /> تصدير</Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5" onClick={() => toast.info('راعي جديد — قريباً')}><Plus className="w-3.5 h-3.5" /> راعي جديد</Button>
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
                  <StatsCard title="إجمالي قيمة الرعايات" value={formatCurrency(totalValue)} icon={DollarSign} trend={28.3} />
                  <StatsCard title="الرعاة النشطون" value={sponsors.filter(s => s.status === 'active').length} icon={Crown} trend={15} delay={0.1} />
                  <StatsCard title="متوسط ROI" value={`${avgROI}%`} icon={TrendingUp} trend={4.2} delay={0.2} />
                  <StatsCard title="العملاء المحتملون" value={leads.length} icon={UserPlus} trend={20} delay={0.3} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">اتجاه عقود الرعاية</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={sponsorshipTrend}><defs><linearGradient id="sponsorGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} /><stop offset="95%" stopColor="#C9A84C" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" /><XAxis dataKey="month" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} /><YAxis tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} /><Area type="monotone" dataKey="قيمة" stroke="#C9A84C" fill="url(#sponsorGrad)" strokeWidth={2} /></AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">توزيع المستويات</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie><Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">{tierDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 11 }} /></RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">{tierDistribution.map(t => <div key={t.name} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} /><span className="text-muted-foreground">{t.name}</span></div><span className="font-bold">{t.value}%</span></div>)}</div>
                  </div>
                </div>
                <div className="glass-card p-6 border-accent/15">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> رؤى الذكاء الاصطناعي</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[
                    { icon: TrendingUp, text: 'نمو قيمة الرعايات 28.3% — أعلى معدل في تاريخ المنصة', type: 'success' as const },
                    { icon: Target, text: '2 عملاء محتملون ساخنون بقيمة 7.5M ر.س — يُنصح بالتواصل الفوري', type: 'info' as const },
                    { icon: AlertTriangle, text: 'دفعة أرامكو المعلقة 4M ر.س تستحق في يونيو', type: 'warning' as const },
                    { icon: Star, text: 'أرامكو حققت أعلى ROI بنسبة 28.1% — نموذج للشراكة المثالية', type: 'success' as const },
                  ].map((ins, i) => <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn('p-3 rounded-lg flex items-start gap-3 text-xs', ins.type === 'success' && 'bg-success/5 border border-success/10', ins.type === 'warning' && 'bg-warning/5 border border-warning/10', ins.type === 'info' && 'bg-accent/5 border border-accent/10')}><ins.icon className={cn('w-3.5 h-3.5 shrink-0 mt-0.5', ins.type === 'success' && 'text-success', ins.type === 'warning' && 'text-warning', ins.type === 'info' && 'text-accent')} /><span className="text-muted-foreground leading-relaxed">{ins.text}</span></motion.div>)}</div>
                </div>
              </div>
            )}

            {/* ═══ الرعاة ═══ */}
            {activeTab === 'الرعاة' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3"><div className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث عن راعي..." className="w-full h-10 pr-9 pl-4 rounded-xl text-sm bg-card border border-border focus:border-accent/30 outline-none transition-all" /></div></div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['الراعي', 'المستوى', 'إجمالي القيمة', 'الفعاليات', 'ROI', 'الحالة', ''].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{sponsors.filter(s => !searchQuery || s.name.includes(searchQuery)).map(sp => <tr key={sp.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-xs">{sp.name.charAt(0)}</div><div><p className="font-medium text-xs">{sp.name}</p><p className="text-[10px] text-muted-foreground">انضم {formatDate(sp.joinDate)}</p></div></div></td><td className="p-4"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', tierColors[sp.tier])}>{sp.tier}</span></td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(sp.totalValue)}</td><td className="p-4 text-xs text-center">{sp.events}</td><td className="p-4"><span className="text-xs font-bold text-success flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />{sp.roi}%</span></td><td className="p-4"><StatusBadge status={sp.status} /></td><td className="p-4"><button className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all"><Eye className="w-3.5 h-3.5" /></button></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ حزم الرعاية ═══ */}
            {activeTab === 'حزم الرعاية' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{packages.map((pkg, i) => <motion.div key={pkg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 hover:border-accent/20 transition-all">
                <div className="flex items-start justify-between mb-3"><div><h4 className="text-sm font-bold mb-1">{pkg.name}</h4><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', tierColors[pkg.tier])}>{pkg.tier}</span></div><StatusBadge status={pkg.status} /></div>
                <div className="grid grid-cols-3 gap-2 text-[10px] mb-3"><div className="p-2 rounded-lg bg-accent/5 text-center"><span className="text-muted-foreground block">السعر</span><span className="font-bold text-accent">{formatCurrency(pkg.price)}</span></div><div className="p-2 rounded-lg bg-card/50 text-center"><span className="text-muted-foreground block">المزايا</span><span className="font-bold">{pkg.benefits}</span></div><div className="p-2 rounded-lg bg-success/5 text-center"><span className="text-muted-foreground block">المشتركون</span><span className="font-bold text-success">{pkg.subscribers}</span></div></div>
                <Button variant="outline" size="sm" className="w-full text-xs">عرض التفاصيل</Button>
              </motion.div>)}</div>
            )}

            {/* ═══ العقود ═══ */}
            {activeTab === 'العقود' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="العقود النشطة" value={sponsorContracts.filter(c => c.status === 'active').length} icon={FileCheck} />
                  <StatsCard title="القيمة الإجمالية" value={formatCurrency(sponsorContracts.reduce((s, c) => s + c.value, 0))} icon={DollarSign} delay={0.1} />
                  <StatsCard title="نسبة التحصيل" value={`${((sponsorContracts.filter(c => c.payment === 'paid').length / sponsorContracts.length) * 100).toFixed(0)}%`} icon={Percent} delay={0.2} />
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['رقم العقد', 'الراعي', 'الفعالية', 'القيمة', 'الفترة', 'الحالة', 'الدفع'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{sponsorContracts.map(c => <tr key={c.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4 text-xs font-mono text-accent">{c.id}</td><td className="p-4 text-xs font-medium">{c.sponsor}</td><td className="p-4 text-xs text-muted-foreground">{c.event}</td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(c.value)}</td><td className="p-4 text-[10px] text-muted-foreground">{formatDate(c.start)} — {formatDate(c.end)}</td><td className="p-4"><StatusBadge status={c.status} /></td><td className="p-4"><StatusBadge status={c.payment} /></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ الأصول ═══ */}
            {activeTab === 'الأصول' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatsCard title="إجمالي الأصول" value={assets.length} icon={Image} />
                  <StatsCard title="معتمدة" value={assets.filter(a => a.status === 'approved').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="بانتظار المراجعة" value={assets.filter(a => a.status === 'pending').length} icon={Clock} delay={0.2} />
                </div>
                {(() => { const cols: Column<SAsset>[] = [
                  { key: 'name', label: 'الأصل', render: (_, r) => <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.type}</p></div> },
                  { key: 'sponsor', label: 'الراعي' },
                  { key: 'event', label: 'الفعالية' },
                  { key: 'location', label: 'الموقع' },
                  { key: 'uploadDate', label: 'تاريخ الرفع', render: v => <span className="text-xs text-muted-foreground">{formatDate(v)}</span> },
                  { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
                ]; return <DataTable columns={cols} data={assets} searchValue={searchQuery} onSearch={setSearchQuery} searchPlaceholder="بحث في الأصول..." emptyMessage="لا توجد أصول" />; })()}
              </div>
            )}

            {/* ═══ التسليمات ═══ */}
            {activeTab === 'التسليمات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي التسليمات" value={deliverables.length} icon={Package} />
                  <StatsCard title="مكتملة" value={deliverables.filter(d => d.status === 'completed').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="قيد التنفيذ" value={deliverables.filter(d => d.status === 'in_progress').length} icon={Clock} delay={0.2} />
                  <StatsCard title="معلقة" value={deliverables.filter(d => d.status === 'pending').length} icon={AlertTriangle} delay={0.3} />
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['الرقم', 'الراعي', 'التسليم', 'النوع', 'الموعد', 'التقدم', 'الحالة'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{deliverables.map(d => <tr key={d.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4 text-xs font-mono text-accent">{d.id}</td><td className="p-4 text-xs font-medium">{d.sponsor}</td><td className="p-4 text-xs">{d.title}</td><td className="p-4 text-xs text-muted-foreground">{d.type}</td><td className="p-4 text-xs text-muted-foreground">{formatDate(d.dueDate)}</td><td className="p-4"><div className="flex items-center gap-2"><div className="flex-1 h-2 rounded-full overflow-hidden bg-card/50"><div className="h-full rounded-full bg-accent" style={{ width: `${d.progress}%` }} /></div><span className="text-[10px] font-bold w-8 text-left">{d.progress}%</span></div></td><td className="p-4"><StatusBadge status={d.status} /></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ التعرض ═══ */}
            {activeTab === 'التعرض' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي الانطباعات" value={`${(exposures.reduce((s, e) => s + e.impressions, 0) / 1000000).toFixed(1)}M`} icon={Eye} />
                  <StatsCard title="إجمالي النقرات" value={`${(exposures.reduce((s, e) => s + e.clicks, 0) / 1000).toFixed(1)}K`} icon={Target} delay={0.1} />
                  <StatsCard title="متوسط CTR" value={`${(exposures.filter(e => e.ctr > 0).reduce((s, e) => s + e.ctr, 0) / exposures.filter(e => e.ctr > 0).length).toFixed(1)}%`} icon={Percent} delay={0.2} />
                  <StatsCard title="القنوات النشطة" value={new Set(exposures.map(e => e.channel)).size} icon={Layers} delay={0.3} />
                </div>
                {(() => { const cols: Column<SExposure>[] = [
                  { key: 'sponsor', label: 'الراعي' },
                  { key: 'channel', label: 'القناة' },
                  { key: 'impressions', label: 'الانطباعات', render: v => <span className="font-mono font-bold">{(v as number).toLocaleString()}</span> },
                  { key: 'clicks', label: 'النقرات', render: v => <span className="font-mono">{(v as number).toLocaleString()}</span> },
                  { key: 'ctr', label: 'CTR', render: v => <span className={cn('font-bold', (v as number) > 5 ? 'text-success' : 'text-muted-foreground')}>{v}%</span> },
                  { key: 'period', label: 'الفترة' },
                ]; return <DataTable columns={cols} data={exposures} searchValue={searchQuery} onSearch={setSearchQuery} searchPlaceholder="بحث في التعرض..." emptyMessage="لا توجد بيانات" />; })()}
              </div>
            )}

            {/* ═══ العملاء المحتملون ═══ */}
            {activeTab === 'العملاء المحتملون' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي العملاء" value={leads.length} icon={UserPlus} />
                  <StatsCard title="ساخنون" value={leads.filter(l => l.status === 'hot').length} icon={Zap} delay={0.1} />
                  <StatsCard title="القيمة المتوقعة" value={formatCurrency(leads.reduce((s, l) => s + l.value, 0))} icon={DollarSign} delay={0.2} />
                  <StatsCard title="معدل التحويل" value="32%" icon={Target} trend={5} delay={0.3} />
                </div>
                <div className="glass-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border/50">{['الرقم', 'الاسم', 'الشركة', 'الاهتمام', 'المصدر', 'القيمة', 'التاريخ', 'الحرارة'].map(h => <th key={h} className="text-right p-4 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead><tbody>{leads.map(l => <tr key={l.id} className="border-b border-border/30 hover:bg-accent/[0.03] transition-colors"><td className="p-4 text-xs font-mono text-accent">{l.id}</td><td className="p-4 text-xs font-medium">{l.name}</td><td className="p-4 text-xs">{l.company}</td><td className="p-4 text-xs text-muted-foreground">{l.interest}</td><td className="p-4 text-xs text-muted-foreground">{l.source}</td><td className="p-4 text-xs font-bold text-accent">{formatCurrency(l.value)}</td><td className="p-4 text-xs text-muted-foreground">{formatDate(l.date)}</td><td className="p-4"><span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', leadStatusColors[l.status])}>{l.status === 'hot' ? 'ساخن' : l.status === 'warm' ? 'دافئ' : 'بارد'}</span></td></tr>)}</tbody></table></div></div>
              </div>
            )}

            {/* ═══ المدفوعات ═══ */}
            {activeTab === 'المدفوعات' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="إجمالي المدفوعات" value={formatCurrency(sPayments.reduce((s, p) => s + p.amount, 0))} icon={CreditCard} />
                  <StatsCard title="مكتملة" value={sPayments.filter(p => p.status === 'completed').length} icon={CheckCircle2} delay={0.1} />
                  <StatsCard title="معلقة" value={sPayments.filter(p => p.status === 'pending').length} icon={Clock} delay={0.2} />
                  <StatsCard title="متأخرة" value={sPayments.filter(p => p.status === 'overdue').length} icon={AlertTriangle} delay={0.3} />
                </div>
                {(() => { const cols: Column<SPayment>[] = [
                  { key: 'id', label: 'رقم الدفعة', render: v => <span className="font-mono text-xs text-accent">{v}</span> },
                  { key: 'sponsor', label: 'الراعي' },
                  { key: 'amount', label: 'المبلغ', render: v => <span className="font-mono font-bold text-accent">{formatCurrency(v)}</span> },
                  { key: 'method', label: 'طريقة الدفع' },
                  { key: 'date', label: 'التاريخ', render: v => <span className="text-xs text-muted-foreground">{formatDate(v)}</span> },
                  { key: 'contract', label: 'العقد', render: v => <span className="font-mono text-xs">{v}</span> },
                  { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
                ]; return <DataTable columns={cols} data={sPayments} searchValue={searchQuery} onSearch={setSearchQuery} searchPlaceholder="بحث في المدفوعات..." emptyMessage="لا توجد مدفوعات" />; })()}
              </div>
            )}

            {/* ═══ ROI والأداء ═══ */}
            {activeTab === 'ROI والأداء' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="متوسط ROI" value={`${avgROI}%`} icon={TrendingUp} trend={4.2} />
                  <StatsCard title="أعلى ROI" value={`${Math.max(...sponsors.map(s => s.roi))}%`} icon={Award} delay={0.1} />
                  <StatsCard title="إجمالي التعرض" value={`${(exposures.reduce((s, e) => s + e.impressions, 0) / 1000000).toFixed(1)}M`} icon={Eye} delay={0.2} />
                  <StatsCard title="التسليمات المكتملة" value={`${deliverables.filter(d => d.status === 'completed').length}/${deliverables.length}`} icon={CheckCircle2} delay={0.3} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">مقاييس الأداء</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={roiMetrics}><PolarGrid stroke="rgba(201,168,76,0.1)" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#6B6560', fontSize: 11 }} /><Radar name="الأداء" dataKey="A" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} /></RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold mb-4">ROI حسب الراعي</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={sponsors.map(s => ({ name: s.name.split(' ')[0], roi: s.roi }))} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" /><XAxis type="number" tick={{ fill: '#6B6560', fontSize: 10 }} axisLine={false} /><YAxis type="category" dataKey="name" tick={{ fill: '#6B6560', fontSize: 11 }} axisLine={false} width={80} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, color: '#F5F0E8', fontSize: 12 }} /><Bar dataKey="roi" fill="#C9A84C" radius={[0, 6, 6, 0]} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ التقارير ═══ */}
            {activeTab === 'التقارير' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[
                { title: 'تقرير ROI الشامل', desc: 'تحليل العائد على الاستثمار', icon: BarChart3, date: '2026-03-28' },
                { title: 'تقرير الرعاة', desc: 'أداء وتصنيف الرعاة', icon: Crown, date: '2026-03-25' },
                { title: 'تقرير التسليمات', desc: 'حالة التسليمات والالتزامات', icon: Package, date: '2026-03-20' },
                { title: 'تقرير التعرض', desc: 'إحصائيات الظهور والتفاعل', icon: Eye, date: '2026-03-15' },
                { title: 'تقرير العملاء المحتملون', desc: 'تحليل خط الأنابيب', icon: UserPlus, date: '2026-03-10' },
                { title: 'تقرير AI التنبؤي', desc: 'توقعات الربع القادم', icon: Zap, date: '2026-03-05' },
              ].map((r, i) => <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5 hover:border-accent/20 transition-all cursor-pointer group"><div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center group-hover:bg-accent/15 transition-all"><r.icon className="w-4 h-4 text-accent" /></div><div className="flex-1"><h4 className="text-sm font-bold">{r.title}</h4><p className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</p></div></div><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {formatDate(r.date)}</span><button onClick={() => toast.info('تحميل — قريباً')} className="text-[10px] text-accent flex items-center gap-1 hover:text-accent/80"><Download className="w-2.5 h-2.5" /> تحميل</button></div></motion.div>)}</div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
