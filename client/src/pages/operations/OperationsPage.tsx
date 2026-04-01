/*
 * OperationsPage — إدارة العمليات
 * تابات: نظرة عامة | المهام | اللوجستيات | الأمن والسلامة | الجدول الزمني
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings2, ClipboardList, Truck, Shield, Calendar, Users,
  CheckCircle, Clock, AlertTriangle, MapPin, Plus, BarChart3,
  Package, Wrench, Zap, Activity, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface Task {
  id: number; title: string; assignee: string; department: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low'; dueDate: string; event: string; progress: number;
}

const mockTasks: Task[] = [
  { id: 1, title: 'تجهيز القاعة الرئيسية — الكهرباء والإنارة', assignee: 'فريق الصيانة', department: 'اللوجستيات', status: 'in_progress', priority: 'high', dueDate: '2026-04-05', event: 'معرض التقنية', progress: 65 },
  { id: 2, title: 'تركيب أنظمة الصوت والعرض', assignee: 'شركة AV Solutions', department: 'التقنية', status: 'pending', priority: 'high', dueDate: '2026-04-08', event: 'معرض التقنية', progress: 0 },
  { id: 3, title: 'تنسيق مواقف السيارات VIP', assignee: 'فريق الأمن', department: 'الأمن', status: 'completed', priority: 'medium', dueDate: '2026-04-01', event: 'معرض التقنية', progress: 100 },
  { id: 4, title: 'توزيع أجنحة العارضين', assignee: 'فريق التشغيل', department: 'العمليات', status: 'in_progress', priority: 'high', dueDate: '2026-04-06', event: 'معرض التقنية', progress: 40 },
  { id: 5, title: 'فحص أنظمة الإطفاء', assignee: 'شركة السلامة', department: 'الأمن', status: 'completed', priority: 'high', dueDate: '2026-03-30', event: 'معرض التقنية', progress: 100 },
  { id: 6, title: 'تجهيز منطقة الطعام والشراب', assignee: 'فريق F&B', department: 'الضيافة', status: 'pending', priority: 'medium', dueDate: '2026-04-10', event: 'معرض التقنية', progress: 0 },
  { id: 7, title: 'طباعة اللافتات والبانرات', assignee: 'مطبعة الإبداع', department: 'التسويق', status: 'overdue', priority: 'medium', dueDate: '2026-03-28', event: 'معرض التقنية', progress: 80 },
  { id: 8, title: 'تنسيق نقل المعدات الثقيلة', assignee: 'شركة النقل', department: 'اللوجستيات', status: 'pending', priority: 'low', dueDate: '2026-04-12', event: 'معرض الأغذية', progress: 0 },
];

interface LogisticsItem {
  id: number; item: string; supplier: string; quantity: number;
  status: 'delivered' | 'in_transit' | 'ordered' | 'pending';
  expectedDate: string; event: string; tracking: string;
}

const mockLogistics: LogisticsItem[] = [
  { id: 1, item: 'أجنحة عرض معيارية (3x3م)', supplier: 'شركة المعارض المتحدة', quantity: 120, status: 'delivered', expectedDate: '2026-03-25', event: 'معرض التقنية', tracking: 'SA-2026-4521' },
  { id: 2, item: 'شاشات LED كبيرة', supplier: 'AV Solutions', quantity: 15, status: 'in_transit', expectedDate: '2026-04-02', event: 'معرض التقنية', tracking: 'SA-2026-4522' },
  { id: 3, item: 'كراسي ومقاعد VIP', supplier: 'مفروشات الرياض', quantity: 500, status: 'ordered', expectedDate: '2026-04-05', event: 'معرض التقنية', tracking: 'SA-2026-4523' },
  { id: 4, item: 'أنظمة تكييف متنقلة', supplier: 'شركة التبريد', quantity: 20, status: 'delivered', expectedDate: '2026-03-20', event: 'معرض التقنية', tracking: 'SA-2026-4524' },
  { id: 5, item: 'معدات مطبخ صناعي', supplier: 'معدات الضيافة', quantity: 8, status: 'pending', expectedDate: '2026-04-08', event: 'معرض الأغذية', tracking: 'SA-2026-4525' },
];

const securityChecks = [
  { area: 'المدخل الرئيسي', status: 'pass' as const, inspector: 'محمد الأمن', date: '2026-03-30', notes: 'جميع البوابات تعمل' },
  { area: 'القاعة A', status: 'pass' as const, inspector: 'أحمد السلامة', date: '2026-03-29', notes: 'أنظمة الإطفاء مفعلة' },
  { area: 'القاعة B', status: 'warning' as const, inspector: 'أحمد السلامة', date: '2026-03-29', notes: 'مخرج طوارئ يحتاج صيانة' },
  { area: 'مواقف السيارات', status: 'pass' as const, inspector: 'محمد الأمن', date: '2026-03-28', notes: 'الإنارة كاملة' },
  { area: 'منطقة F&B', status: 'fail' as const, inspector: 'فهد الصحة', date: '2026-03-28', notes: 'يحتاج تصريح صحي' },
];

const tasksByDept = [
  { dept: 'اللوجستيات', total: 15, completed: 10 },
  { dept: 'الأمن', total: 12, completed: 9 },
  { dept: 'التقنية', total: 8, completed: 5 },
  { dept: 'الضيافة', total: 6, completed: 3 },
  { dept: 'التسويق', total: 10, completed: 7 },
];

const priorityData = [
  { name: 'عالية', value: 4, color: '#EF4444' },
  { name: 'متوسطة', value: 3, color: '#F59E0B' },
  { name: 'منخفضة', value: 1, color: '#10B981' },
];

type TabKey = 'overview' | 'tasks' | 'logistics' | 'security' | 'timeline';
const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: Activity },
  { key: 'tasks', label: 'المهام', icon: ClipboardList },
  { key: 'logistics', label: 'اللوجستيات', icon: Truck },
  { key: 'security', label: 'الأمن والسلامة', icon: Shield },
  { key: 'timeline', label: 'الجدول الزمني', icon: Calendar },
];

function OverviewTab() {
  const completed = mockTasks.filter(t => t.status === 'completed').length;
  const overdue = mockTasks.filter(t => t.status === 'overdue').length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="إجمالي المهام" value={mockTasks.length} icon={ClipboardList} />
        <StatsCard title="مكتملة" value={completed} icon={CheckCircle} trend={Math.round((completed / mockTasks.length) * 100)} delay={0.1} />
        <StatsCard title="متأخرة" value={overdue} icon={AlertTriangle} delay={0.2} />
        <StatsCard title="جاهزية التشغيل" value="72%" icon={Zap} delay={0.3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold mb-4">تقدم الأقسام</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tasksByDept} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis type="number" tick={{ fontSize: 10, fill: '#888' }} /><YAxis dataKey="dept" type="category" tick={{ fontSize: 10, fill: '#888' }} width={80} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /><Bar dataKey="completed" fill="#C9A84C" name="مكتمل" radius={[0, 4, 4, 0]} /><Bar dataKey="total" fill="rgba(201,168,76,0.2)" name="الإجمالي" radius={[0, 4, 4, 0]} /></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">توزيع الأولوية</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RPieChart><Pie data={priorityData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">{priorityData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{priorityData.map(p => <div key={p.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: p.color }} />{p.name}</span><span className="font-mono">{p.value}</span></div>)}</div>
        </motion.div>
      </div>
    </div>
  );
}

function TasksTab() {
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const filtered = mockTasks.filter(t => {
    const ms = t.title.includes(search) || t.assignee.includes(search);
    const mf = filterPriority === 'all' || t.priority === filterPriority;
    return ms && mf;
  });
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all', 'high', 'medium', 'low'].map(p => (
          <button key={p} onClick={() => setFilterPriority(p)} className={cn('px-3 py-1.5 rounded-lg text-xs transition-colors', filterPriority === p ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card')}>
            {p === 'all' ? 'الكل' : p === 'high' ? 'عالية' : p === 'medium' ? 'متوسطة' : 'منخفضة'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', task.status === 'completed' ? 'bg-success/10 text-success' : task.status === 'in_progress' ? 'bg-accent/10 text-accent' : task.status === 'overdue' ? 'bg-danger/10 text-danger' : 'bg-card text-muted-foreground')}>
                  {task.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : task.status === 'in_progress' ? <Wrench className="w-4 h-4" /> : task.status === 'overdue' ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{task.assignee}</span>
                    <span className="text-xs bg-card/80 px-1.5 py-0.5 rounded border border-border/50">{task.department}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', task.priority === 'high' ? 'bg-danger/15 text-danger' : task.priority === 'medium' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success')}>{task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1"><span>التقدم</span><span>{task.progress}%</span></div>
                  <div className="h-1.5 rounded-full bg-card/80 overflow-hidden"><div className={cn('h-full rounded-full transition-all', task.progress === 100 ? 'bg-success' : 'bg-accent')} style={{ width: `${task.progress}%` }} /></div>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LogisticsTab() {
  const [search, setSearch] = useState('');
  const columns: Column<LogisticsItem>[] = [
    { key: 'item', label: 'الصنف', render: (_, r) => <div><p className="font-medium text-sm">{r.item}</p><p className="text-xs text-muted-foreground">{r.event} — {r.tracking}</p></div> },
    { key: 'supplier', label: 'المورد', render: v => <span className="text-xs">{v}</span> },
    { key: 'quantity', label: 'الكمية', render: v => <span className="font-mono text-sm">{v}</span> },
    { key: 'status', label: 'الحالة', render: v => <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'delivered' ? 'bg-success/15 text-success' : v === 'in_transit' ? 'bg-info/15 text-info' : v === 'ordered' ? 'bg-warning/15 text-warning' : 'bg-muted/50 text-muted-foreground'}`}>{v === 'delivered' ? 'تم التسليم' : v === 'in_transit' ? 'في الطريق' : v === 'ordered' ? 'تم الطلب' : 'قيد الانتظار'}</span> },
    { key: 'expectedDate', label: 'التاريخ المتوقع', render: v => <span className="text-xs">{formatDate(v)}</span> },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الأصناف" value={mockLogistics.length} icon={Package} />
        <StatsCard title="تم التسليم" value={mockLogistics.filter(l => l.status === 'delivered').length} icon={CheckCircle} delay={0.1} />
        <StatsCard title="في الطريق" value={mockLogistics.filter(l => l.status === 'in_transit').length} icon={Truck} delay={0.2} />
        <StatsCard title="قيد الانتظار" value={mockLogistics.filter(l => l.status === 'pending').length} icon={Clock} delay={0.3} />
      </div>
      <DataTable columns={columns} data={mockLogistics.filter(l => l.item.includes(search) || l.supplier.includes(search))} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في اللوجستيات..." emptyMessage="لا توجد أصناف" />
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="فحوصات ناجحة" value={securityChecks.filter(s => s.status === 'pass').length} icon={CheckCircle} />
        <StatsCard title="تحذيرات" value={securityChecks.filter(s => s.status === 'warning').length} icon={AlertTriangle} delay={0.1} />
        <StatsCard title="فشل" value={securityChecks.filter(s => s.status === 'fail').length} icon={Shield} delay={0.2} />
      </div>
      <div className="space-y-3">
        {securityChecks.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.status === 'pass' ? 'bg-success/10 border border-success/20' : s.status === 'warning' ? 'bg-warning/10 border border-warning/20' : 'bg-danger/10 border border-danger/20'}`}>
              {s.status === 'pass' ? <CheckCircle className="w-4 h-4 text-success" /> : s.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-warning" /> : <Shield className="w-4 h-4 text-danger" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between"><p className="font-medium text-sm">{s.area}</p><span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'pass' ? 'bg-success/15 text-success' : s.status === 'warning' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'}`}>{s.status === 'pass' ? 'ناجح' : s.status === 'warning' ? 'تحذير' : 'فشل'}</span></div>
              <p className="text-xs text-muted-foreground mt-1">{s.notes}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.inspector} — {formatDate(s.date)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TimelineTab() {
  const timeline = [
    { date: '2026-03-15', title: 'بدء التجهيزات الأولية', status: 'completed' as const },
    { date: '2026-03-25', title: 'تسليم المعدات الأساسية', status: 'completed' as const },
    { date: '2026-04-01', title: 'تركيب الأجنحة', status: 'in_progress' as const },
    { date: '2026-04-05', title: 'فحص الأنظمة الكهربائية', status: 'pending' as const },
    { date: '2026-04-08', title: 'تركيب أنظمة الصوت والعرض', status: 'pending' as const },
    { date: '2026-04-10', title: 'تجهيز منطقة F&B', status: 'pending' as const },
    { date: '2026-04-12', title: 'الفحص النهائي والتسليم', status: 'pending' as const },
    { date: '2026-04-15', title: 'افتتاح المعرض', status: 'pending' as const },
  ];
  return (
    <div className="space-y-4">
      <div className="relative">
        {timeline.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }} className="flex gap-4 mb-4 last:mb-0">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${t.status === 'completed' ? 'bg-success border-success' : t.status === 'in_progress' ? 'bg-accent border-accent animate-pulse' : 'bg-transparent border-muted-foreground/30'}`} />
              {i < timeline.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${t.status === 'completed' ? 'bg-success/30' : 'bg-border/30'}`} />}
            </div>
            <div className={`glass-card p-3 flex-1 ${t.status === 'in_progress' ? 'border-accent/30' : ''}`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${t.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}>{t.title}</p>
                <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة العمليات" subtitle="المهام واللوجستيات والأمن والسلامة والجدول الزمني" actions={<Button onClick={() => toast.info('إضافة مهمة — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> مهمة جديدة</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'tasks' && <TasksTab />}
            {activeTab === 'logistics' && <LogisticsTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'timeline' && <TimelineTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
