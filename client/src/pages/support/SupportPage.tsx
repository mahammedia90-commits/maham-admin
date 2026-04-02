/*
 * SupportPage — خدمة العملاء
 * تابات: نظرة عامة | التذاكر | قاعدة المعرفة | الدردشة الحية | التقييمات
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones, MessageSquare, BookOpen, Star, BarChart3, Plus,
  CheckCircle, Clock, AlertTriangle, Search, Send,
  ThumbsUp, ThumbsDown, Phone, Mail
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface Ticket {
  id: number; subject: string; client: string; category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low'; agent: string; created: string; lastReply: string; channel: 'email' | 'phone' | 'chat';
}

const mockTickets: Ticket[] = [
  { id: 1001, subject: 'مشكلة في حجز الجناح B3', client: 'شركة الفيصل', category: 'حجوزات', status: 'open', priority: 'high', agent: 'نورة الشمري', created: '2026-04-01', lastReply: '2026-04-01', channel: 'email' },
  { id: 1002, subject: 'طلب تغيير موقع الجناح', client: 'مجموعة المراعي', category: 'حجوزات', status: 'in_progress', priority: 'medium', agent: 'أحمد العتيبي', created: '2026-03-30', lastReply: '2026-03-31', channel: 'phone' },
  { id: 1003, subject: 'استفسار عن باقات الرعاية', client: 'بنك الراجحي', category: 'رعاية', status: 'resolved', priority: 'low', agent: 'سارة المالكي', created: '2026-03-28', lastReply: '2026-03-29', channel: 'chat' },
  { id: 1004, subject: 'مشكلة في الفاتورة الإلكترونية', client: 'DHL السعودية', category: 'مالية', status: 'open', priority: 'high', agent: 'نورة الشمري', created: '2026-04-01', lastReply: '2026-04-01', channel: 'email' },
  { id: 1005, subject: 'طلب خدمات كهرباء إضافية', client: 'شركة جرير', category: 'خدمات', status: 'in_progress', priority: 'medium', agent: 'أحمد العتيبي', created: '2026-03-29', lastReply: '2026-03-30', channel: 'phone' },
  { id: 1006, subject: 'استفسار عن مواعيد التركيب', client: 'STC', category: 'عمليات', status: 'closed', priority: 'low', agent: 'سارة المالكي', created: '2026-03-25', lastReply: '2026-03-26', channel: 'chat' },
  { id: 1007, subject: 'شكوى — تأخر في الرد', client: 'موبايلي', category: 'عام', status: 'open', priority: 'high', agent: 'نورة الشمري', created: '2026-04-01', lastReply: '2026-04-01', channel: 'email' },
];

const kbArticles = [
  { id: 1, title: 'كيفية حجز جناح في المعرض', category: 'حجوزات', views: 1250, helpful: 89 },
  { id: 2, title: 'شروط وأحكام الرعاية', category: 'رعاية', views: 890, helpful: 76 },
  { id: 3, title: 'دليل الخدمات اللوجستية', category: 'خدمات', views: 650, helpful: 92 },
  { id: 4, title: 'الأسئلة الشائعة — الفواتير والمدفوعات', category: 'مالية', views: 1100, helpful: 85 },
  { id: 5, title: 'سياسة الإلغاء والاسترداد', category: 'حجوزات', views: 780, helpful: 71 },
  { id: 6, title: 'متطلبات التحقق KYC', category: 'عام', views: 450, helpful: 95 },
];

const chatSessions = [
  { id: 1, client: 'أحمد — شركة الفيصل', status: 'active' as const, messages: 12, duration: '8 دقائق', agent: 'نورة' },
  { id: 2, client: 'سارة — بنك الراجحي', status: 'active' as const, messages: 5, duration: '3 دقائق', agent: 'أحمد' },
  { id: 3, client: 'خالد — DHL', status: 'waiting' as const, messages: 1, duration: '0 دقيقة', agent: 'غير محدد' },
  { id: 4, client: 'فاطمة — جرير', status: 'ended' as const, messages: 18, duration: '15 دقيقة', agent: 'سارة' },
];

const ratingsData = [
  { client: 'شركة الفيصل', rating: 5, comment: 'خدمة ممتازة وسريعة', date: '2026-03-30', agent: 'نورة' },
  { client: 'مجموعة المراعي', rating: 4, comment: 'جيد لكن يحتاج تحسين في سرعة الرد', date: '2026-03-29', agent: 'أحمد' },
  { client: 'بنك الراجحي', rating: 5, comment: 'احترافية عالية', date: '2026-03-28', agent: 'سارة' },
  { client: 'DHL', rating: 3, comment: 'تأخر في حل المشكلة', date: '2026-03-27', agent: 'نورة' },
  { client: 'STC', rating: 5, comment: 'شكراً على الدعم السريع', date: '2026-03-26', agent: 'سارة' },
];

const ticketTrend = [
  { day: 'السبت', opened: 5, resolved: 3 }, { day: 'الأحد', opened: 8, resolved: 6 },
  { day: 'الاثنين', opened: 12, resolved: 10 }, { day: 'الثلاثاء', opened: 7, resolved: 8 },
  { day: 'الأربعاء', opened: 9, resolved: 7 }, { day: 'الخميس', opened: 4, resolved: 5 },
  { day: 'الجمعة', opened: 2, resolved: 3 },
];

const categoryData = [
  { name: 'حجوزات', value: 35, color: '#C9A84C' }, { name: 'رعاية', value: 20, color: '#3B82F6' },
  { name: 'خدمات', value: 15, color: '#10B981' }, { name: 'مالية', value: 20, color: '#F59E0B' },
  { name: 'عام', value: 10, color: '#8B5CF6' },
];

type TabKey = 'overview' | 'tickets' | 'knowledge' | 'chat' | 'ratings';
const tabsList: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { key: 'tickets', label: 'التذاكر', icon: Headphones },
  { key: 'knowledge', label: 'قاعدة المعرفة', icon: BookOpen },
  { key: 'chat', label: 'الدردشة الحية', icon: MessageSquare },
  { key: 'ratings', label: 'التقييمات', icon: Star },
];

function OverviewTab() {
  const open = mockTickets.filter(t => t.status === 'open').length;
  const resolved = mockTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const avgRating = (ratingsData.reduce((s, r) => s + r.rating, 0) / ratingsData.length).toFixed(1);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="تذاكر مفتوحة" value={open} icon={Headphones} />
        <StatsCard title="تم الحل" value={resolved} icon={CheckCircle} trend={15} delay={0.1} />
        <StatsCard title="متوسط وقت الرد" value="12 دقيقة" icon={Clock} trend={-20} delay={0.2} />
        <StatsCard title="تقييم العملاء" value={`${avgRating}/5`} icon={Star} trend={5} delay={0.3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold mb-4">اتجاه التذاكر (أسبوعي)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ticketTrend}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /><Area type="monotone" dataKey="opened" fill="rgba(239,68,68,0.1)" stroke="#EF4444" name="مفتوحة" /><Area type="monotone" dataKey="resolved" fill="rgba(16,185,129,0.1)" stroke="#10B981" name="محلولة" /></AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">التذاكر حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RPieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">{categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{categoryData.map(c => <div key={c.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: c.color }} />{c.name}</span><span className="font-mono">{c.value}%</span></div>)}</div>
        </motion.div>
      </div>
    </div>
  );
}

function TicketsTab() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const filtered = mockTickets.filter(t => {
    const ms = t.subject.includes(search) || t.client.includes(search);
    const mf = filterStatus === 'all' || t.status === filterStatus;
    return ms && mf;
  });
  const columns: Column<Ticket>[] = [
    { key: 'id', label: '#', render: v => <span className="font-mono text-xs text-accent">#{v}</span> },
    { key: 'subject', label: 'الموضوع', render: (_, r) => (
      <div className="flex items-center gap-2">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', r.channel === 'email' ? 'bg-accent/10 text-accent' : r.channel === 'phone' ? 'bg-info/10 text-info' : 'bg-success/10 text-success')}>
          {r.channel === 'email' ? <Mail className="w-3.5 h-3.5" /> : r.channel === 'phone' ? <Phone className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
        </div>
        <div><p className="font-medium text-sm">{r.subject}</p><p className="text-xs text-muted-foreground">{r.client} — {r.category}</p></div>
      </div>
    )},
    { key: 'priority', label: 'الأولوية', render: v => <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'high' ? 'bg-danger/15 text-danger' : v === 'medium' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}`}>{v === 'high' ? 'عالية' : v === 'medium' ? 'متوسطة' : 'منخفضة'}</span> },
    { key: 'agent', label: 'الوكيل', render: v => <span className="text-xs">{v}</span> },
    { key: 'status', label: 'الحالة', render: (_, r) => <StatusBadge status={r.status === 'resolved' || r.status === 'closed' ? 'active' : r.status === 'in_progress' ? 'approved' : 'pending'} /> },
    { key: 'lastReply', label: 'آخر رد', render: v => <span className="text-xs">{formatDate(v)}</span> },
  ];
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={cn('px-3 py-1.5 rounded-lg text-xs transition-colors', filterStatus === s ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card')}>
            {s === 'all' ? 'الكل' : s === 'open' ? 'مفتوحة' : s === 'in_progress' ? 'قيد المعالجة' : s === 'resolved' ? 'محلولة' : 'مغلقة'}
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في التذاكر..." emptyMessage="لا توجد تذاكر" />
    </div>
  );
}

function KnowledgeTab() {
  const [search, setSearch] = useState('');
  const filtered = kbArticles.filter(a => a.title.includes(search) || a.category.includes(search));
  return (
    <div className="space-y-4">
      <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في قاعدة المعرفة..." className="w-full h-10 pr-10 pl-4 rounded-xl bg-card/50 border border-border/50 text-sm focus:outline-none focus:border-accent/50" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4 hover:border-accent/30 transition-colors cursor-pointer" onClick={() => toast.info('عرض المقال — قريباً')}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-accent" /><span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{a.category}</span></div>
              <span className="text-xs text-muted-foreground">{a.views} مشاهدة</span>
            </div>
            <h4 className="font-medium text-sm mb-2">{a.title}</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><ThumbsUp className="w-3 h-3" />{a.helpful}% وجدوه مفيداً</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChatTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="محادثات نشطة" value={chatSessions.filter(c => c.status === 'active').length} icon={MessageSquare} />
        <StatsCard title="في الانتظار" value={chatSessions.filter(c => c.status === 'waiting').length} icon={Clock} delay={0.1} />
        <StatsCard title="منتهية اليوم" value={chatSessions.filter(c => c.status === 'ended').length} icon={CheckCircle} delay={0.2} />
      </div>
      <div className="space-y-3">
        {chatSessions.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`glass-card p-4 flex items-center justify-between ${c.status === 'active' ? 'border-success/30' : c.status === 'waiting' ? 'border-warning/30' : ''}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.status === 'active' ? 'bg-success/10 border border-success/20' : c.status === 'waiting' ? 'bg-warning/10 border border-warning/20' : 'bg-card border border-border/50'}`}>
                <MessageSquare className={`w-4 h-4 ${c.status === 'active' ? 'text-success' : c.status === 'waiting' ? 'text-warning' : 'text-muted-foreground'}`} />
              </div>
              <div><p className="font-medium text-sm">{c.client}</p><p className="text-xs text-muted-foreground">{c.messages} رسالة — {c.duration} — {c.agent}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-success/15 text-success' : c.status === 'waiting' ? 'bg-warning/15 text-warning' : 'bg-muted/50 text-muted-foreground'}`}>{c.status === 'active' ? 'نشطة' : c.status === 'waiting' ? 'انتظار' : 'منتهية'}</span>
              {c.status !== 'ended' && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.info('فتح المحادثة — قريباً')}><Send className="w-3 h-3" /> رد</Button>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RatingsTab() {
  const avgRating = (ratingsData.reduce((s, r) => s + r.rating, 0) / ratingsData.length).toFixed(1);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="متوسط التقييم" value={`${avgRating}/5`} icon={Star} />
        <StatsCard title="تقييمات ممتازة (5)" value={ratingsData.filter(r => r.rating === 5).length} icon={ThumbsUp} delay={0.1} />
        <StatsCard title="تقييمات سلبية (≤3)" value={ratingsData.filter(r => r.rating <= 3).length} icon={ThumbsDown} delay={0.2} />
      </div>
      <div className="space-y-3">
        {ratingsData.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent">{r.client.charAt(0)}</div>
                <div><p className="font-medium text-sm">{r.client}</p><p className="text-xs text-muted-foreground">الوكيل: {r.agent} — {formatDate(r.date)}</p></div>
              </div>
              <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, si) => <Star key={si} className={`w-4 h-4 ${si < r.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />)}</div>
            </div>
            <p className="text-sm text-muted-foreground mr-13">{r.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="خدمة العملاء" subtitle="التذاكر والدردشة وقاعدة المعرفة والتقييمات" actions={<Button onClick={() => toast.info('تذكرة جديدة — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> تذكرة جديدة</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabsList.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'tickets' && <TicketsTab />}
            {activeTab === 'knowledge' && <KnowledgeTab />}
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'ratings' && <RatingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
