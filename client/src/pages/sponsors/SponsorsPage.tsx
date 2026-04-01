/*
 * SponsorsPage — إدارة الرعاة والشركاء
 * تابات: نظرة عامة | الرعاة | الحزم | التسليمات | تقارير ROI
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, DollarSign, TrendingUp, Users, Plus, Star,
  Crown, Medal, Shield, BarChart3, Package, CheckCircle,
  Clock, Target, AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import DataTable, { Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const sponsorTiers = [
  { tier: 'بلاتيني', icon: Crown, color: 'text-accent', bg: 'bg-accent/10 border-accent/20', count: 3, value: 2400000 },
  { tier: 'ذهبي', icon: Medal, color: 'text-accent', bg: 'bg-accent/8 border-accent/15', count: 8, value: 1600000 },
  { tier: 'فضي', icon: Shield, color: 'text-muted-foreground', bg: 'bg-card/80 border-border/30', count: 15, value: 900000 },
  { tier: 'برونزي', icon: Star, color: 'text-muted-foreground', bg: 'bg-card/50 border-border/20', count: 22, value: 440000 },
];

interface Sponsor {
  id: number; name: string; tier: string; value: number; status: string;
  roi: string; events: number; contact: string; phone: string;
}

const sponsors: Sponsor[] = [
  { id: 1, name: 'بنك الأهلي السعودي', tier: 'بلاتيني', value: 800000, status: 'active', roi: '+320%', events: 5, contact: 'فهد المطيري', phone: '0501234567' },
  { id: 2, name: 'STC', tier: 'بلاتيني', value: 750000, status: 'active', roi: '+280%', events: 4, contact: 'سارة العمري', phone: '0559876543' },
  { id: 3, name: 'أرامكو', tier: 'بلاتيني', value: 850000, status: 'active', roi: '+350%', events: 6, contact: 'خالد الدوسري', phone: '0541112233' },
  { id: 4, name: 'شركة المراعي', tier: 'ذهبي', value: 300000, status: 'active', roi: '+180%', events: 3, contact: 'نورة الحربي', phone: '0567778899' },
  { id: 5, name: 'شركة سابك', tier: 'ذهبي', value: 250000, status: 'pending', roi: '—', events: 0, contact: 'عبدالله الشهري', phone: '0533445566' },
  { id: 6, name: 'مجموعة الفيصلية', tier: 'فضي', value: 100000, status: 'active', roi: '+120%', events: 2, contact: 'ريم القحطاني', phone: '0522334455' },
  { id: 7, name: 'موبايلي', tier: 'ذهبي', value: 280000, status: 'active', roi: '+200%', events: 3, contact: 'أحمد الزهراني', phone: '0511223344' },
  { id: 8, name: 'بنك الراجحي', tier: 'بلاتيني', value: 900000, status: 'pending', roi: '—', events: 0, contact: 'محمد العتيبي', phone: '0544556677' },
];

const packages = [
  { id: 1, name: 'الحزمة البلاتينية', price: 800000, features: ['شعار على جميع المطبوعات', 'جناح VIP 100م²', 'كلمة في الافتتاح', '10 تذاكر VIP', 'تغطية إعلامية كاملة'], sponsors: 3, maxSponsors: 5 },
  { id: 2, name: 'الحزمة الذهبية', price: 300000, features: ['شعار على المطبوعات الرئيسية', 'جناح 50م²', '5 تذاكر VIP', 'ذكر في البيان الصحفي'], sponsors: 8, maxSponsors: 15 },
  { id: 3, name: 'الحزمة الفضية', price: 100000, features: ['شعار على الموقع', 'جناح 25م²', '3 تذاكر', 'ذكر في وسائل التواصل'], sponsors: 15, maxSponsors: 30 },
  { id: 4, name: 'الحزمة البرونزية', price: 40000, features: ['شعار على الموقع', 'تذكرتان', 'ذكر في القائمة'], sponsors: 22, maxSponsors: 50 },
];

const deliverables = [
  { sponsor: 'بنك الأهلي', item: 'شعار على جميع المطبوعات', status: 'completed' as const, dueDate: '2026-03-01' },
  { sponsor: 'بنك الأهلي', item: 'جناح VIP — تجهيز', status: 'in_progress' as const, dueDate: '2026-04-10' },
  { sponsor: 'STC', item: 'تغطية إعلامية — حملة ديجيتال', status: 'completed' as const, dueDate: '2026-03-15' },
  { sponsor: 'STC', item: 'كلمة في الافتتاح — تنسيق', status: 'pending' as const, dueDate: '2026-04-14' },
  { sponsor: 'أرامكو', item: 'شعار على المطبوعات', status: 'completed' as const, dueDate: '2026-02-28' },
  { sponsor: 'أرامكو', item: 'جناح VIP — تصميم', status: 'completed' as const, dueDate: '2026-03-10' },
  { sponsor: 'المراعي', item: 'جناح 50م² — تجهيز', status: 'in_progress' as const, dueDate: '2026-04-08' },
  { sponsor: 'موبايلي', item: 'شعار على الموقع', status: 'completed' as const, dueDate: '2026-02-15' },
];

const roiData = [
  { sponsor: 'الأهلي', investment: 800000, returns: 3360000 },
  { sponsor: 'STC', investment: 750000, returns: 2850000 },
  { sponsor: 'أرامكو', investment: 850000, returns: 3825000 },
  { sponsor: 'المراعي', investment: 300000, returns: 840000 },
  { sponsor: 'الفيصلية', investment: 100000, returns: 220000 },
  { sponsor: 'موبايلي', investment: 280000, returns: 840000 },
];

const roiTrend = [
  { month: 'يناير', roi: 150 }, { month: 'فبراير', roi: 180 },
  { month: 'مارس', roi: 215 }, { month: 'أبريل', roi: 240 },
];

const tierDist = [
  { name: 'بلاتيني', value: 3, color: '#C9A84C' }, { name: 'ذهبي', value: 8, color: '#F59E0B' },
  { name: 'فضي', value: 15, color: '#94A3B8' }, { name: 'برونزي', value: 22, color: '#78716C' },
];

type TabKey = 'overview' | 'sponsors' | 'packages' | 'deliverables' | 'roi';
const tabsList: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { key: 'sponsors', label: 'الرعاة', icon: Award },
  { key: 'packages', label: 'الحزم', icon: Package },
  { key: 'deliverables', label: 'التسليمات', icon: CheckCircle },
  { key: 'roi', label: 'تقارير ROI', icon: TrendingUp },
];

function OverviewTab() {
  const totalValue = sponsors.reduce((s, sp) => s + sp.value, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الرعاة" value={sponsors.length} icon={Award} trend={12} />
        <StatsCard title="قيمة الرعايات" value={formatCurrency(totalValue)} icon={DollarSign} trend={25} delay={0.1} />
        <StatsCard title="متوسط ROI" value="+215%" icon={TrendingUp} trend={18} delay={0.2} />
        <StatsCard title="معدل التجديد" value="82%" icon={Users} trend={5} delay={0.3} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sponsorTiers.map((tier, i) => (
          <motion.div key={tier.tier} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} className={cn('glass-card p-4 border', tier.bg)}>
            <div className="flex items-center gap-2 mb-2"><tier.icon className={cn('w-4 h-4', tier.color)} /><h4 className="text-sm font-bold">{tier.tier}</h4></div>
            <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{tier.count} راعٍ</span><span className="text-sm font-mono font-bold text-accent">{formatCurrency(tier.value)}</span></div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">الاستثمار مقابل العائد</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={roiData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="sponsor" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000000}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} /><Bar dataKey="investment" fill="rgba(201,168,76,0.3)" name="الاستثمار" radius={[4, 4, 0, 0]} /><Bar dataKey="returns" fill="#C9A84C" name="العائد" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">توزيع المستويات</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RPieChart><Pie data={tierDist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">{tierDist.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{tierDist.map(t => <div key={t.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: t.color }} />{t.name}</span><span className="font-mono">{t.value}</span></div>)}</div>
        </motion.div>
      </div>
    </div>
  );
}

function SponsorsTab() {
  const [search, setSearch] = useState('');
  const filtered = sponsors.filter(s => s.name.includes(search) || s.tier.includes(search) || s.contact.includes(search));
  const columns: Column<Sponsor>[] = [
    { key: 'name', label: 'الراعي', render: (_, r) => (
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent">{r.name.charAt(0)}</div>
        <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.contact}</p></div>
      </div>
    )},
    { key: 'tier', label: 'المستوى', render: v => <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'بلاتيني' ? 'bg-accent/15 text-accent' : v === 'ذهبي' ? 'bg-warning/15 text-warning' : 'bg-muted/30 text-muted-foreground'}`}>{v}</span> },
    { key: 'value', label: 'القيمة', render: v => <span className="font-mono text-sm font-bold text-accent">{formatCurrency(v)}</span> },
    { key: 'events', label: 'الفعاليات' },
    { key: 'roi', label: 'ROI', render: v => <span className={cn('font-mono font-bold', typeof v === 'string' && v.startsWith('+') ? 'text-success' : 'text-muted-foreground')}>{v}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
  ];
  return <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في الرعاة..." emptyMessage="لا يوجد رعاة" />;
}

function PackagesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {packages.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">{p.name}</h3>
            <span className="text-lg font-mono font-bold text-accent">{formatCurrency(p.price)}</span>
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">الإشغال</span><span className="font-mono">{p.sponsors}/{p.maxSponsors}</span></div>
            <div className="h-2 rounded-full bg-card/80 overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${(p.sponsors / p.maxSponsors) * 100}%` }} /></div>
          </div>
          <ul className="space-y-1.5 mb-3">
            {p.features.map((f, fi) => <li key={fi} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle className="w-3 h-3 text-success shrink-0" />{f}</li>)}
          </ul>
          <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => toast.info('تعديل الحزمة — قريباً')}>تعديل الحزمة</Button>
        </motion.div>
      ))}
    </div>
  );
}

function DeliverablesTab() {
  const completed = deliverables.filter(d => d.status === 'completed').length;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="إجمالي التسليمات" value={deliverables.length} icon={Package} />
        <StatsCard title="مكتملة" value={completed} icon={CheckCircle} trend={Math.round((completed / deliverables.length) * 100)} delay={0.1} />
        <StatsCard title="قيد التنفيذ" value={deliverables.filter(d => d.status === 'in_progress').length} icon={Clock} delay={0.2} />
      </div>
      <div className="space-y-3">
        {deliverables.map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`glass-card p-4 flex items-center justify-between ${d.status === 'in_progress' ? 'border-accent/30' : d.status === 'pending' ? 'border-warning/30' : ''}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.status === 'completed' ? 'bg-success/10 text-success' : d.status === 'in_progress' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'}`}>
                {d.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : d.status === 'in_progress' ? <Clock className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              </div>
              <div><p className="text-sm font-medium">{d.item}</p><p className="text-xs text-muted-foreground">{d.sponsor} — {d.dueDate}</p></div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.status === 'completed' ? 'bg-success/15 text-success' : d.status === 'in_progress' ? 'bg-accent/15 text-accent' : 'bg-warning/15 text-warning'}`}>{d.status === 'completed' ? 'مكتمل' : d.status === 'in_progress' ? 'جاري' : 'قادم'}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RoiTab() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">اتجاه ROI الشهري</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={roiTrend}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v}%`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [`${v}%`, 'ROI']} /><Line type="monotone" dataKey="roi" stroke="#C9A84C" strokeWidth={2} dot={{ r: 4, fill: '#C9A84C' }} /></LineChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">ROI حسب الراعي</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={roiData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="sponsor" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000000}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} /><Bar dataKey="investment" fill="rgba(201,168,76,0.3)" name="الاستثمار" radius={[4, 4, 0, 0]} /><Bar dataKey="returns" fill="#10B981" name="العائد" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default function SponsorsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="الرعاة والشركاء" subtitle="إدارة الرعايات والحزم والتسليمات وتقارير ROI" actions={<Button onClick={() => toast.info('إضافة راعٍ — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> إضافة راعٍ</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabsList.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'sponsors' && <SponsorsTab />}
            {activeTab === 'packages' && <PackagesTab />}
            {activeTab === 'deliverables' && <DeliverablesTab />}
            {activeTab === 'roi' && <RoiTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
