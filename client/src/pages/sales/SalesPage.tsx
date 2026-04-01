/*
 * SalesPage — إدارة المبيعات
 * تابات: نظرة عامة | الصفقات | الحجوزات | فريق المبيعات | الأهداف
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, TrendingUp, DollarSign, Target, Users, Plus,
  ArrowUpRight, BarChart3, Briefcase, Award, Clock, CheckCircle,
  XCircle, Calendar, MapPin, Phone, Star, Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RPieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const salesData = [
  { month: 'يناير', booths: 120000, sponsorships: 80000, services: 40000 },
  { month: 'فبراير', booths: 150000, sponsorships: 95000, services: 55000 },
  { month: 'مارس', booths: 200000, sponsorships: 120000, services: 70000 },
  { month: 'أبريل', booths: 180000, sponsorships: 110000, services: 65000 },
  { month: 'مايو', booths: 250000, sponsorships: 150000, services: 85000 },
  { month: 'يونيو', booths: 320000, sponsorships: 180000, services: 95000 },
];

interface SalesDeal {
  id: number; name: string; client: string; value: number;
  stage: 'lead' | 'contact' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  probability: number; rep: string; daysOpen: number; type: 'booth' | 'sponsorship' | 'service';
  event: string; nextAction: string;
}

const mockDeals: SalesDeal[] = [
  { id: 1, name: 'حجز 6 أجنحة — معرض التقنية', client: 'شركة الفيصل للتقنية', value: 450000, stage: 'negotiation', probability: 75, rep: 'أحمد محمد', daysOpen: 12, type: 'booth', event: 'معرض التقنية 2026', nextAction: 'اجتماع متابعة الأربعاء' },
  { id: 2, name: 'رعاية بلاتينية — موسم الرياض', client: 'بنك الأهلي', value: 800000, stage: 'proposal', probability: 60, rep: 'سارة العلي', daysOpen: 5, type: 'sponsorship', event: 'موسم الرياض', nextAction: 'إرسال العرض المعدل' },
  { id: 3, name: 'حجز أجنحة مميزة', client: 'مجموعة المراعي', value: 320000, stage: 'closing', probability: 90, rep: 'خالد الحربي', daysOpen: 2, type: 'booth', event: 'معرض الأغذية', nextAction: 'توقيع العقد' },
  { id: 4, name: 'خدمات لوجستية كاملة', client: 'DHL السعودية', value: 180000, stage: 'contact', probability: 40, rep: 'فاطمة أحمد', daysOpen: 20, type: 'service', event: 'معرض التقنية 2026', nextAction: 'مكالمة تعريفية' },
  { id: 5, name: 'رعاية ذهبية', client: 'STC', value: 500000, stage: 'won', probability: 100, rep: 'أحمد محمد', daysOpen: 30, type: 'sponsorship', event: 'معرض التقنية 2026', nextAction: 'تم التوقيع' },
  { id: 6, name: 'حجز مساحة F&B', client: 'مطاعم الرومانسية', value: 85000, stage: 'won', probability: 100, rep: 'سارة العلي', daysOpen: 15, type: 'booth', event: 'معرض الأغذية', nextAction: 'تم التسليم' },
  { id: 7, name: 'رعاية فضية', client: 'موبايلي', value: 200000, stage: 'lost', probability: 0, rep: 'خالد الحربي', daysOpen: 45, type: 'sponsorship', event: 'موسم الرياض', nextAction: 'مغلق — ميزانية غير كافية' },
  { id: 8, name: 'حجز 3 أجنحة', client: 'شركة جرير', value: 150000, stage: 'lead', probability: 20, rep: 'فاطمة أحمد', daysOpen: 3, type: 'booth', event: 'معرض التقنية 2026', nextAction: 'إرسال كتالوج' },
];

interface Booking {
  id: number; client: string; event: string; spaces: string; value: number;
  status: 'confirmed' | 'pending' | 'cancelled'; date: string; paymentStatus: 'paid' | 'partial' | 'unpaid';
}

const mockBookings: Booking[] = [
  { id: 1, client: 'شركة الفيصل', event: 'معرض التقنية', spaces: 'A1, A2, A3, A4, A5, A6', value: 450000, status: 'confirmed', date: '2026-03-28', paymentStatus: 'paid' },
  { id: 2, client: 'مجموعة المراعي', event: 'معرض الأغذية', spaces: 'B1, B2, B3', value: 320000, status: 'confirmed', date: '2026-03-25', paymentStatus: 'partial' },
  { id: 3, client: 'DHL السعودية', event: 'معرض التقنية', spaces: 'C5', value: 180000, status: 'pending', date: '2026-03-20', paymentStatus: 'unpaid' },
  { id: 4, client: 'مطاعم الرومانسية', event: 'معرض الأغذية', spaces: 'F1, F2', value: 85000, status: 'confirmed', date: '2026-03-15', paymentStatus: 'paid' },
  { id: 5, client: 'شركة جرير', event: 'معرض التقنية', spaces: 'D1, D2, D3', value: 150000, status: 'pending', date: '2026-03-30', paymentStatus: 'unpaid' },
];

const reps = [
  { name: 'أحمد محمد', deals: 8, won: 5, revenue: 1250000, target: 1500000, avatar: 'أ' },
  { name: 'سارة العلي', deals: 6, won: 4, revenue: 980000, target: 1200000, avatar: 'س' },
  { name: 'خالد الحربي', deals: 7, won: 3, revenue: 720000, target: 1000000, avatar: 'خ' },
  { name: 'فاطمة أحمد', deals: 5, won: 2, revenue: 450000, target: 800000, avatar: 'ف' },
];

const stageLabels: Record<string, string> = { lead: 'عميل محتمل', contact: 'تواصل', proposal: 'عرض سعر', negotiation: 'تفاوض', closing: 'إغلاق', won: 'مكتسب', lost: 'خاسر' };
const typeLabels: Record<string, string> = { booth: 'حجز أجنحة', sponsorship: 'رعاية', service: 'خدمات' };
const typeData = [{ name: 'أجنحة', value: 45, color: '#C9A84C' }, { name: 'رعاية', value: 35, color: '#3B82F6' }, { name: 'خدمات', value: 20, color: '#10B981' }];

type TabKey = 'overview' | 'deals' | 'bookings' | 'team' | 'targets';
const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { key: 'deals', label: 'الصفقات', icon: Briefcase },
  { key: 'bookings', label: 'الحجوزات', icon: Calendar },
  { key: 'team', label: 'فريق المبيعات', icon: Users },
  { key: 'targets', label: 'الأهداف', icon: Target },
];

function OverviewTab() {
  const totalRevenue = salesData.reduce((s, d) => s + d.booths + d.sponsorships + d.services, 0);
  const activeDeals = mockDeals.filter(d => !['won', 'lost'].includes(d.stage));
  const pipelineValue = activeDeals.reduce((s, d) => s + d.value, 0);
  const wonValue = mockDeals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الإيرادات" value={formatCurrency(totalRevenue)} icon={DollarSign} trend={28} />
        <StatsCard title="قيمة Pipeline" value={formatCurrency(pipelineValue)} icon={Target} delay={0.1} />
        <StatsCard title="صفقات مكتسبة" value={formatCurrency(wonValue)} icon={CheckCircle} trend={15} delay={0.2} />
        <StatsCard title="معدل الإغلاق" value="62%" icon={TrendingUp} trend={8} delay={0.3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold mb-4">الإيرادات الشهرية حسب النوع</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000}k`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} /><Bar dataKey="booths" fill="#C9A84C" name="أجنحة" radius={[4, 4, 0, 0]} /><Bar dataKey="sponsorships" fill="#3B82F6" name="رعاية" radius={[4, 4, 0, 0]} /><Bar dataKey="services" fill="#10B981" name="خدمات" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">توزيع المبيعات</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RPieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">{typeData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /></RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{typeData.map(c => <div key={c.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name}</span><span className="font-mono">{c.value}%</span></div>)}</div>
        </motion.div>
      </div>
    </div>
  );
}

function DealsTab() {
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const filtered = mockDeals.filter(d => {
    const ms = d.name.includes(search) || d.client.includes(search);
    const mf = filterStage === 'all' || d.stage === filterStage;
    return ms && mf;
  });
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all', 'lead', 'contact', 'proposal', 'negotiation', 'closing', 'won', 'lost'].map(s => (
          <button key={s} onClick={() => setFilterStage(s)} className={cn('px-3 py-1.5 rounded-lg text-xs transition-colors', filterStage === s ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card')}>
            {s === 'all' ? 'الكل' : stageLabels[s]} ({s === 'all' ? mockDeals.length : mockDeals.filter(d => d.stage === s).length})
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.type === 'booth' ? 'bg-accent/10 border border-accent/20' : d.type === 'sponsorship' ? 'bg-info/10 border border-info/20' : 'bg-success/10 border border-success/20'}`}>
                  {d.type === 'booth' ? <MapPin className="w-4 h-4 text-accent" /> : d.type === 'sponsorship' ? <Award className="w-4 h-4 text-info" /> : <Briefcase className="w-4 h-4 text-success" />}
                </div>
                <div><p className="font-medium text-sm">{d.name}</p><p className="text-xs text-muted-foreground">{d.client} — {d.event}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-accent">{formatCurrency(d.value)}</span>
                <StatusBadge status={d.stage === 'won' ? 'active' : d.stage === 'lost' ? 'rejected' : d.stage === 'closing' ? 'approved' : 'pending'} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <span>{stageLabels[d.stage]} — احتمالية {d.probability}%</span>
              <span>{d.rep} — {d.daysOpen} يوم</span>
              <span className="text-accent">{d.nextAction}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BookingsTab() {
  const [search, setSearch] = useState('');
  const columns: Column<Booking>[] = [
    { key: 'client', label: 'العميل', render: (_, r) => <div><p className="font-medium text-sm">{r.client}</p><p className="text-xs text-muted-foreground">{r.event}</p></div> },
    { key: 'spaces', label: 'المساحات', render: v => <span className="text-xs font-mono bg-card/80 px-2 py-0.5 rounded">{v}</span> },
    { key: 'value', label: 'القيمة', sortable: true, render: v => <span className="font-mono font-bold text-sm">{formatCurrency(v)}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status === 'confirmed' ? 'active' : r.status === 'pending' ? 'pending' : 'rejected'} /> },
    { key: 'paymentStatus', label: 'الدفع', render: v => <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'paid' ? 'bg-success/15 text-success' : v === 'partial' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'}`}>{v === 'paid' ? 'مدفوع' : v === 'partial' ? 'جزئي' : 'غير مدفوع'}</span> },
    { key: 'date', label: 'التاريخ', render: v => <span className="text-xs">{formatDate(v)}</span> },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الحجوزات" value={mockBookings.length} icon={Calendar} />
        <StatsCard title="مؤكدة" value={mockBookings.filter(b => b.status === 'confirmed').length} icon={CheckCircle} delay={0.1} />
        <StatsCard title="قيد الانتظار" value={mockBookings.filter(b => b.status === 'pending').length} icon={Clock} delay={0.2} />
        <StatsCard title="إجمالي القيمة" value={formatCurrency(mockBookings.reduce((s, b) => s + b.value, 0))} icon={DollarSign} delay={0.3} />
      </div>
      <DataTable columns={columns} data={mockBookings.filter(b => b.client.includes(search))} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في الحجوزات..." emptyMessage="لا توجد حجوزات" />
    </div>
  );
}

function TeamTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reps.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-lg font-bold text-accent">{r.avatar}</div>
              <div><p className="font-bold text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.deals} صفقات — {r.won} مكتسبة</p></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">الإيرادات</span><span className="font-mono font-bold text-accent">{formatCurrency(r.revenue)}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">الهدف</span><span className="font-mono">{formatCurrency(r.target)}</span></div>
              <div className="h-2 rounded-full bg-card/80 overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.min((r.revenue / r.target) * 100, 100)}%` }} /></div>
              <p className="text-[10px] text-center text-muted-foreground">{Math.round((r.revenue / r.target) * 100)}% من الهدف</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TargetsTab() {
  const totalTarget = reps.reduce((s, r) => s + r.target, 0);
  const totalRevenue = reps.reduce((s, r) => s + r.revenue, 0);
  const quarterlyTargets = [
    { quarter: 'Q1', target: 3000000, achieved: 2800000 },
    { quarter: 'Q2', target: 4500000, achieved: 3400000 },
    { quarter: 'Q3', target: 5000000, achieved: 0 },
    { quarter: 'Q4', target: 6000000, achieved: 0 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="الهدف السنوي" value={formatCurrency(totalTarget * 4)} icon={Target} />
        <StatsCard title="المحقق" value={formatCurrency(totalRevenue)} icon={DollarSign} trend={22} delay={0.1} />
        <StatsCard title="نسبة الإنجاز" value={`${Math.round((totalRevenue / (totalTarget * 4)) * 100)}%`} icon={TrendingUp} delay={0.2} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">الأهداف الربعية</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={quarterlyTargets}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000000}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} /><Bar dataKey="target" fill="rgba(201,168,76,0.3)" name="الهدف" radius={[4, 4, 0, 0]} /><Bar dataKey="achieved" fill="#C9A84C" name="المحقق" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة المبيعات" subtitle="الصفقات والحجوزات وأداء فريق المبيعات" actions={<Button onClick={() => toast.info('إنشاء صفقة — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> صفقة جديدة</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'deals' && <DealsTab />}
            {activeTab === 'bookings' && <BookingsTab />}
            {activeTab === 'team' && <TeamTab />}
            {activeTab === 'targets' && <TargetsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
