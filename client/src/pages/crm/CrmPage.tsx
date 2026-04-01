/*
 * CrmPage — إدارة علاقات العملاء
 * تابات: نظرة عامة | جهات الاتصال | الصفقات | Pipeline | الأنشطة | التقارير
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Phone, Mail, Building2, DollarSign, TrendingUp,
  Clock, CheckCircle, XCircle, Eye, Plus, Search,
  ArrowUpRight, Target, Calendar, Star, MapPin, Briefcase, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// ========== TYPES & DATA ==========
interface Contact {
  id: number; name: string; company: string; email: string; phone: string;
  type: 'investor' | 'merchant' | 'sponsor' | 'lead';
  status: 'active' | 'inactive' | 'prospect';
  score: number; city: string; lastContact: string; deals: number; revenue: number;
}

const mockContacts: Contact[] = [
  { id: 1, name: 'عبدالله الشمري', company: 'شركة الشمري للتجارة', email: 'a.shamri@co.sa', phone: '+966 55 123 4567', type: 'merchant', status: 'active', score: 92, city: 'الرياض', lastContact: '2026-03-28', deals: 3, revenue: 145000 },
  { id: 2, name: 'فهد العتيبي', company: 'مجموعة العتيبي', email: 'f.otaibi@group.sa', phone: '+966 50 234 5678', type: 'sponsor', status: 'active', score: 88, city: 'جدة', lastContact: '2026-03-25', deals: 2, revenue: 320000 },
  { id: 3, name: 'خالد الدوسري', company: 'استثمارات الدوسري', email: 'k.dosari@inv.sa', phone: '+966 54 345 6789', type: 'investor', status: 'active', score: 95, city: 'الرياض', lastContact: '2026-03-30', deals: 4, revenue: 580000 },
  { id: 4, name: 'سعد المطيري', company: 'تجارة المطيري', email: 's.mutairi@trade.sa', phone: '+966 56 456 7890', type: 'merchant', status: 'prospect', score: 65, city: 'الدمام', lastContact: '2026-03-15', deals: 1, revenue: 28000 },
  { id: 5, name: 'محمد الحربي', company: 'شركة الحربي', email: 'm.harbi@co.sa', phone: '+966 55 567 8901', type: 'merchant', status: 'active', score: 78, city: 'الرياض', lastContact: '2026-03-22', deals: 2, revenue: 95000 },
  { id: 6, name: 'عمر الزهراني', company: 'زهراني كابيتال', email: 'o.zahrani@cap.sa', phone: '+966 50 678 9012', type: 'investor', status: 'active', score: 85, city: 'جدة', lastContact: '2026-03-20', deals: 1, revenue: 200000 },
  { id: 7, name: 'يوسف النجم', company: 'مؤسسة النجم', email: 'y.najm@est.sa', phone: '+966 54 789 0123', type: 'merchant', status: 'inactive', score: 42, city: 'المدينة', lastContact: '2026-02-10', deals: 0, revenue: 0 },
  { id: 8, name: 'أحمد التقنية', company: 'رؤية التقنية', email: 'a.tech@vision.sa', phone: '+966 56 890 1234', type: 'sponsor', status: 'active', score: 90, city: 'الرياض', lastContact: '2026-03-29', deals: 3, revenue: 450000 },
];

interface Deal {
  id: number; title: string; contact: string; value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  probability: number; expectedClose: string; assignee: string;
}

const mockDeals: Deal[] = [
  { id: 1, title: 'رعاية ذهبية — معرض التقنية', contact: 'فهد العتيبي', value: 250000, stage: 'negotiation', probability: 75, expectedClose: '2026-04-15', assignee: 'سارة' },
  { id: 2, title: 'حجز 4 أجنحة — معرض الأغذية', contact: 'عبدالله الشمري', value: 180000, stage: 'proposal', probability: 60, expectedClose: '2026-04-20', assignee: 'أحمد' },
  { id: 3, title: 'استثمار في معرض السيارات', contact: 'خالد الدوسري', value: 500000, stage: 'qualified', probability: 40, expectedClose: '2026-05-01', assignee: 'نور' },
  { id: 4, title: 'رعاية بلاتينية — موسم الرياض', contact: 'أحمد التقنية', value: 400000, stage: 'won', probability: 100, expectedClose: '2026-03-20', assignee: 'سارة' },
  { id: 5, title: 'حجز جناح مميز', contact: 'سعد المطيري', value: 45000, stage: 'lead', probability: 20, expectedClose: '2026-05-15', assignee: 'أحمد' },
  { id: 6, title: 'رعاية فضية — معرض العقار', contact: 'عمر الزهراني', value: 120000, stage: 'proposal', probability: 55, expectedClose: '2026-04-25', assignee: 'نور' },
  { id: 7, title: 'حجز مساحة F&B', contact: 'محمد الحربي', value: 35000, stage: 'won', probability: 100, expectedClose: '2026-03-15', assignee: 'أحمد' },
  { id: 8, title: 'رعاية — لم يتم الاتفاق', contact: 'يوسف النجم', value: 80000, stage: 'lost', probability: 0, expectedClose: '2026-03-01', assignee: 'سارة' },
];

const stageLabels: Record<string, string> = { lead: 'عميل محتمل', qualified: 'مؤهل', proposal: 'عرض مقدم', negotiation: 'تفاوض', won: 'مكتسب', lost: 'خاسر' };
const stageColors: Record<string, string> = { lead: '#6B7280', qualified: '#3B82F6', proposal: '#F59E0B', negotiation: '#8B5CF6', won: '#10B981', lost: '#EF4444' };
const typeLabels: Record<string, string> = { investor: 'مستثمر', merchant: 'تاجر', sponsor: 'راعي', lead: 'عميل محتمل' };

const pipelineData = [
  { stage: 'عميل محتمل', count: 12, value: 340000 },
  { stage: 'مؤهل', count: 8, value: 580000 },
  { stage: 'عرض مقدم', count: 6, value: 420000 },
  { stage: 'تفاوض', count: 4, value: 650000 },
  { stage: 'مكتسب', count: 15, value: 1200000 },
];

const activityData = [
  { date: '2026-03-30', type: 'call', contact: 'خالد الدوسري', note: 'مكالمة متابعة — مهتم بمعرض السيارات', user: 'نور' },
  { date: '2026-03-29', type: 'email', contact: 'أحمد التقنية', note: 'إرسال عقد الرعاية البلاتينية', user: 'سارة' },
  { date: '2026-03-28', type: 'meeting', contact: 'عبدالله الشمري', note: 'اجتماع لمناقشة حجز الأجنحة', user: 'أحمد' },
  { date: '2026-03-27', type: 'call', contact: 'فهد العتيبي', note: 'تفاوض على قيمة الرعاية الذهبية', user: 'سارة' },
  { date: '2026-03-25', type: 'email', contact: 'سعد المطيري', note: 'إرسال كتالوج المعرض', user: 'أحمد' },
  { date: '2026-03-22', type: 'meeting', contact: 'محمد الحربي', note: 'زيارة موقع المعرض', user: 'نور' },
];

type TabKey = 'overview' | 'contacts' | 'deals' | 'pipeline' | 'activities' | 'reports';
const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: Activity },
  { key: 'contacts', label: 'جهات الاتصال', icon: Users },
  { key: 'deals', label: 'الصفقات', icon: Briefcase },
  { key: 'pipeline', label: 'Pipeline', icon: Target },
  { key: 'activities', label: 'الأنشطة', icon: Calendar },
  { key: 'reports', label: 'التقارير', icon: TrendingUp },
];

// ========== OVERVIEW TAB ==========
function OverviewTab() {
  const totalRevenue = mockContacts.reduce((s, c) => s + c.revenue, 0);
  const activeDeals = mockDeals.filter(d => !['won', 'lost'].includes(d.stage));
  const pipelineValue = activeDeals.reduce((s, d) => s + d.value, 0);
  const wonValue = mockDeals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);
  const conversionRate = Math.round((mockDeals.filter(d => d.stage === 'won').length / mockDeals.length) * 100);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="جهات الاتصال" value={mockContacts.length} icon={Users} trend={12} />
        <StatsCard title="قيمة Pipeline" value={formatCurrency(pipelineValue)} icon={Target} delay={0.1} />
        <StatsCard title="صفقات مكتسبة" value={formatCurrency(wonValue)} icon={DollarSign} trend={18} delay={0.2} />
        <StatsCard title="معدل التحويل" value={`${conversionRate}%`} icon={TrendingUp} delay={0.3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">Pipeline حسب المرحلة</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} />
              <Bar dataKey="value" fill="#C9A84C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">آخر الأنشطة</h3>
          <div className="space-y-3">
            {activityData.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.type === 'call' ? 'bg-success/10' : a.type === 'email' ? 'bg-info/10' : 'bg-accent/10'}`}>
                  {a.type === 'call' ? <Phone className="w-3.5 h-3.5 text-success" /> : a.type === 'email' ? <Mail className="w-3.5 h-3.5 text-info" /> : <Calendar className="w-3.5 h-3.5 text-accent" />}
                </div>
                <div className="flex-1 min-w-0"><p className="text-sm truncate">{a.note}</p><p className="text-[10px] text-muted-foreground">{a.contact} — {a.user} — {formatDate(a.date)}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ========== CONTACTS TAB ==========
function ContactsTab() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const filtered = mockContacts.filter(c => {
    const ms = c.name.includes(search) || c.company.includes(search) || c.email.includes(search);
    const mf = filterType === 'all' || c.type === filterType;
    return ms && mf;
  });
  const columns: Column<Contact>[] = [
    { key: 'name', label: 'الاسم', render: (_, r) => <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.company}</p></div> },
    { key: 'type', label: 'النوع', render: v => <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'investor' ? 'bg-accent/15 text-accent' : v === 'sponsor' ? 'bg-info/15 text-info' : v === 'merchant' ? 'bg-success/15 text-success' : 'bg-muted/50 text-muted-foreground'}`}>{typeLabels[v]}</span> },
    { key: 'score', label: 'Score', sortable: true, render: v => <div className="flex items-center gap-2"><div className="w-10 h-1.5 rounded-full bg-card/80 overflow-hidden"><div className={`h-full rounded-full ${v >= 80 ? 'bg-success' : v >= 60 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${v}%` }} /></div><span className="text-xs font-mono">{v}</span></div> },
    { key: 'city', label: 'المدينة', render: v => <span className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{v}</span> },
    { key: 'deals', label: 'الصفقات', render: v => <span className="font-mono text-sm">{v}</span> },
    { key: 'revenue', label: 'الإيرادات', sortable: true, render: v => <span className="font-mono text-sm">{formatCurrency(v)}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: (_, r) => <button onClick={e => { e.stopPropagation(); setSelectedContact(r); }} className="p-1.5 rounded-lg hover:bg-accent/10"><Eye className="w-4 h-4 text-accent" /></button> },
  ];
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all', 'investor', 'merchant', 'sponsor', 'lead'].map(t => (
          <button key={t} onClick={() => setFilterType(t)} className={cn('px-3 py-1.5 rounded-lg text-sm transition-colors', filterType === t ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card')}>
            {t === 'all' ? 'الكل' : typeLabels[t]} ({t === 'all' ? mockContacts.length : mockContacts.filter(c => c.type === t).length})
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في جهات الاتصال..." emptyMessage="لا توجد جهات اتصال" onRowClick={setSelectedContact} />
      <Dialog open={!!selectedContact} onOpenChange={v => { if (!v) setSelectedContact(null); }}>
        <DialogContent className="glass-card border-border/50 max-w-lg" dir="rtl">
          <DialogHeader><DialogTitle>{selectedContact?.name}</DialogTitle></DialogHeader>
          {selectedContact && (
            <div className="space-y-4 mt-2">
              <div className="glass-card p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl font-bold text-accent">{selectedContact.name.charAt(0)}</div>
                <div><p className="font-bold">{selectedContact.name}</p><p className="text-sm text-muted-foreground">{selectedContact.company}</p><span className={`text-xs px-2 py-0.5 rounded-full ${selectedContact.type === 'investor' ? 'bg-accent/15 text-accent' : selectedContact.type === 'sponsor' ? 'bg-info/15 text-info' : 'bg-success/15 text-success'}`}>{typeLabels[selectedContact.type]}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">البريد</p><p className="text-sm">{selectedContact.email}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">الهاتف</p><p className="text-sm font-mono">{selectedContact.phone}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">المدينة</p><p className="text-sm">{selectedContact.city}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">Score</p><p className="text-sm font-bold text-accent">{selectedContact.score}/100</p></div>
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">الصفقات</p><p className="text-sm font-mono">{selectedContact.deals}</p></div>
                <div className="glass-card p-3"><p className="text-xs text-muted-foreground">الإيرادات</p><p className="text-sm font-mono text-accent">{formatCurrency(selectedContact.revenue)}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ========== DEALS TAB ==========
function DealsTab() {
  const [search, setSearch] = useState('');
  const columns: Column<Deal>[] = [
    { key: 'title', label: 'الصفقة', render: (_, r) => <div><p className="font-medium text-sm">{r.title}</p><p className="text-xs text-muted-foreground">{r.contact}</p></div> },
    { key: 'value', label: 'القيمة', sortable: true, render: v => <span className="font-mono font-bold text-sm">{formatCurrency(v)}</span> },
    { key: 'stage', label: 'المرحلة', render: v => <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${stageColors[v]}20`, color: stageColors[v] }}>{stageLabels[v]}</span> },
    { key: 'probability', label: 'الاحتمالية', render: v => <div className="flex items-center gap-2"><div className="w-12 h-1.5 rounded-full bg-card/80 overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${v}%` }} /></div><span className="text-xs font-mono">{v}%</span></div> },
    { key: 'expectedClose', label: 'الإغلاق المتوقع', render: v => <span className="text-xs">{formatDate(v)}</span> },
    { key: 'assignee', label: 'المسؤول', render: v => <span className="text-xs bg-card/80 px-2 py-0.5 rounded border border-border/50">{v}</span> },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الصفقات" value={mockDeals.length} icon={Briefcase} />
        <StatsCard title="نشطة" value={mockDeals.filter(d => !['won', 'lost'].includes(d.stage)).length} icon={Activity} delay={0.1} />
        <StatsCard title="مكتسبة" value={mockDeals.filter(d => d.stage === 'won').length} icon={CheckCircle} delay={0.2} />
        <StatsCard title="خاسرة" value={mockDeals.filter(d => d.stage === 'lost').length} icon={XCircle} delay={0.3} />
      </div>
      <DataTable columns={columns} data={mockDeals.filter(d => d.title.includes(search) || d.contact.includes(search))} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في الصفقات..." emptyMessage="لا توجد صفقات" />
    </div>
  );
}

// ========== PIPELINE TAB ==========
function PipelineTab() {
  const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'won'];
  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage, i) => {
          const deals = mockDeals.filter(d => d.stage === stage);
          const total = deals.reduce((s, d) => s + d.value, 0);
          return (
            <motion.div key={stage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="min-w-[260px] flex-1">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: stageColors[stage] }} />
                  <span className="text-sm font-bold">{stageLabels[stage]}</span>
                  <span className="text-xs bg-card/80 px-1.5 py-0.5 rounded text-muted-foreground">{deals.length}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{formatCurrency(total)}</span>
              </div>
              <div className="space-y-2">
                {deals.map(d => (
                  <div key={d.id} className="glass-card p-3 cursor-pointer hover:border-accent/30 transition-all">
                    <p className="text-sm font-medium truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{d.contact}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-sm font-bold text-accent">{formatCurrency(d.value)}</span>
                      <span className="text-[10px] text-muted-foreground">{d.assignee}</span>
                    </div>
                  </div>
                ))}
                {deals.length === 0 && <div className="glass-card p-4 text-center text-xs text-muted-foreground">لا توجد صفقات</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ========== ACTIVITIES TAB ==========
function ActivitiesTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="مكالمات" value={activityData.filter(a => a.type === 'call').length} icon={Phone} />
        <StatsCard title="رسائل" value={activityData.filter(a => a.type === 'email').length} icon={Mail} delay={0.1} />
        <StatsCard title="اجتماعات" value={activityData.filter(a => a.type === 'meeting').length} icon={Calendar} delay={0.2} />
      </div>
      <div className="space-y-3">
        {activityData.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.type === 'call' ? 'bg-success/10 border border-success/20' : a.type === 'email' ? 'bg-info/10 border border-info/20' : 'bg-accent/10 border border-accent/20'}`}>
              {a.type === 'call' ? <Phone className="w-4 h-4 text-success" /> : a.type === 'email' ? <Mail className="w-4 h-4 text-info" /> : <Calendar className="w-4 h-4 text-accent" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between"><p className="text-sm font-medium">{a.note}</p><span className="text-xs text-muted-foreground">{formatDate(a.date)}</span></div>
              <p className="text-xs text-muted-foreground mt-1">{a.contact} — بواسطة {a.user}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ========== REPORTS TAB ==========
function CrmReportsTab() {
  const conversionData = [
    { month: 'يناير', leads: 25, converted: 8 },
    { month: 'فبراير', leads: 32, converted: 12 },
    { month: 'مارس', leads: 28, converted: 10 },
    { month: 'أبريل', leads: 35, converted: 15 },
    { month: 'مايو', leads: 40, converted: 18 },
    { month: 'يونيو', leads: 38, converted: 14 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">معدل التحويل الشهري</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis tick={{ fontSize: 10, fill: '#888' }} />
              <Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
              <Bar dataKey="leads" fill="rgba(201,168,76,0.3)" name="عملاء محتملون" radius={[4, 4, 0, 0]} />
              <Bar dataKey="converted" fill="#C9A84C" name="تم التحويل" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">أداء فريق المبيعات</h3>
          <div className="space-y-3">
            {[{ name: 'سارة', deals: 5, value: 730000, rate: 62 }, { name: 'أحمد', deals: 4, value: 260000, rate: 50 }, { name: 'نور', deals: 3, value: 620000, rate: 43 }].map((m) => (
              <div key={m.name} className="glass-card p-3 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent">{m.name.charAt(0)}</div>
                <div className="flex-1"><p className="text-sm font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.deals} صفقات — {formatCurrency(m.value)}</p></div>
                <div className="text-left"><p className="text-sm font-bold text-accent">{m.rate}%</p><p className="text-[10px] text-muted-foreground">معدل التحويل</p></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ========== MAIN PAGE ==========
export default function CrmPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة علاقات العملاء (CRM)" subtitle="إدارة جهات الاتصال والصفقات وأنشطة المبيعات" actions={
          <Button onClick={() => toast.info('إضافة جهة اتصال — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><UserPlus className="w-4 h-4" /> جهة اتصال جديدة</Button>
        } />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'contacts' && <ContactsTab />}
            {activeTab === 'deals' && <DealsTab />}
            {activeTab === 'pipeline' && <PipelineTab />}
            {activeTab === 'activities' && <ActivitiesTab />}
            {activeTab === 'reports' && <CrmReportsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
