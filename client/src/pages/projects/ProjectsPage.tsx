/*
 * ProjectsPage — إدارة المشاريع
 * تابات: نظرة عامة | المشاريع | المعالم | الموارد
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, Calendar, Users, DollarSign, Plus, CheckCircle,
  Clock, AlertTriangle, BarChart3, Target, Zap, ArrowUpRight, Flag
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface Project {
  id: number; name: string; client: string; status: 'active' | 'completed' | 'on_hold' | 'planning';
  progress: number; budget: number; spent: number; startDate: string; endDate: string;
  manager: string; team: number; milestones: number; completedMilestones: number;
}

const mockProjects: Project[] = [
  { id: 1, name: 'معرض التقنية 2026', client: 'Maham Expo', status: 'active', progress: 65, budget: 2500000, spent: 1625000, startDate: '2026-01-15', endDate: '2026-04-15', manager: 'نور كرم', team: 12, milestones: 8, completedMilestones: 5 },
  { id: 2, name: 'معرض الأغذية والمشروبات', client: 'Maham Expo', status: 'planning', progress: 15, budget: 1800000, spent: 270000, startDate: '2026-05-01', endDate: '2026-07-30', manager: 'أحمد العلي', team: 8, milestones: 6, completedMilestones: 1 },
  { id: 3, name: 'موسم الرياض — الجناح الرئيسي', client: 'هيئة الترفيه', status: 'active', progress: 40, budget: 5000000, spent: 2000000, startDate: '2026-02-01', endDate: '2026-06-30', manager: 'سارة المالكي', team: 20, milestones: 12, completedMilestones: 5 },
  { id: 4, name: 'Boulevard World — المرحلة 2', client: 'Maham Group', status: 'on_hold', progress: 30, budget: 3500000, spent: 1050000, startDate: '2026-03-01', endDate: '2026-09-30', manager: 'خالد الحربي', team: 15, milestones: 10, completedMilestones: 3 },
  { id: 5, name: 'منصة Maham AI — MVP', client: 'Maham AI', status: 'active', progress: 55, budget: 800000, spent: 440000, startDate: '2026-01-01', endDate: '2026-06-30', manager: 'نور كرم', team: 6, milestones: 10, completedMilestones: 5 },
];

const milestones = [
  { project: 'معرض التقنية', title: 'توقيع عقود العارضين', date: '2026-02-15', status: 'completed' as const },
  { project: 'معرض التقنية', title: 'تصميم خريطة المعرض', date: '2026-03-01', status: 'completed' as const },
  { project: 'معرض التقنية', title: 'بدء التجهيزات الميدانية', date: '2026-03-15', status: 'completed' as const },
  { project: 'معرض التقنية', title: 'اختبار الأنظمة', date: '2026-04-05', status: 'in_progress' as const },
  { project: 'معرض التقنية', title: 'الافتتاح الرسمي', date: '2026-04-15', status: 'pending' as const },
  { project: 'موسم الرياض', title: 'تسليم التصاميم', date: '2026-03-01', status: 'completed' as const },
  { project: 'موسم الرياض', title: 'بدء البناء', date: '2026-03-15', status: 'in_progress' as const },
  { project: 'Maham AI', title: 'إطلاق النسخة التجريبية', date: '2026-04-01', status: 'in_progress' as const },
];

const resources = [
  { name: 'نور كرم', role: 'مدير تنفيذي', projects: 2, utilization: 95 },
  { name: 'أحمد العلي', role: 'مدير مشاريع', projects: 1, utilization: 70 },
  { name: 'سارة المالكي', role: 'مدير مشاريع', projects: 1, utilization: 85 },
  { name: 'خالد الحربي', role: 'مدير عمليات', projects: 1, utilization: 45 },
  { name: 'فاطمة أحمد', role: 'مصممة', projects: 3, utilization: 90 },
  { name: 'محمد السعيد', role: 'مهندس تقني', projects: 2, utilization: 80 },
];

const statusData = [
  { name: 'نشط', value: 3, color: '#10B981' }, { name: 'تخطيط', value: 1, color: '#3B82F6' },
  { name: 'معلق', value: 1, color: '#F59E0B' },
];

const budgetData = mockProjects.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), budget: p.budget, spent: p.spent }));

type TabKey = 'overview' | 'projects' | 'milestones' | 'resources';
const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
  { key: 'projects', label: 'المشاريع', icon: FolderKanban },
  { key: 'milestones', label: 'المعالم', icon: Flag },
  { key: 'resources', label: 'الموارد', icon: Users },
];

function OverviewTab() {
  const totalBudget = mockProjects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = mockProjects.reduce((s, p) => s + p.spent, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="إجمالي المشاريع" value={mockProjects.length} icon={FolderKanban} />
        <StatsCard title="نشطة" value={mockProjects.filter(p => p.status === 'active').length} icon={Zap} delay={0.1} />
        <StatsCard title="إجمالي الميزانية" value={formatCurrency(totalBudget)} icon={DollarSign} delay={0.2} />
        <StatsCard title="المصروف" value={formatCurrency(totalSpent)} icon={Target} trend={Math.round((totalSpent / totalBudget) * 100)} delay={0.3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold mb-4">الميزانية مقابل المصروف</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={budgetData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="name" tick={{ fontSize: 9, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000000}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} /><Bar dataKey="budget" fill="rgba(201,168,76,0.3)" name="الميزانية" radius={[4, 4, 0, 0]} /><Bar dataKey="spent" fill="#C9A84C" name="المصروف" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">حالة المشاريع</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RPieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">{statusData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{statusData.map(s => <div key={s.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name}</span><span className="font-mono">{s.value}</span></div>)}</div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  return (
    <div className="space-y-4">
      {mockProjects.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${p.status === 'active' ? 'bg-success/10 text-success border border-success/20' : p.status === 'planning' ? 'bg-info/10 text-info border border-info/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>{p.name.charAt(0)}</div>
              <div><p className="font-bold text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.client} — {p.manager}</p></div>
            </div>
            <StatusBadge status={p.status === 'active' ? 'active' : p.status === 'completed' ? 'approved' : p.status === 'on_hold' ? 'pending' : 'draft'} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            <div><p className="text-[10px] text-muted-foreground">الميزانية</p><p className="text-sm font-mono font-bold">{formatCurrency(p.budget)}</p></div>
            <div><p className="text-[10px] text-muted-foreground">المصروف</p><p className="text-sm font-mono">{formatCurrency(p.spent)}</p></div>
            <div><p className="text-[10px] text-muted-foreground">الفريق</p><p className="text-sm">{p.team} عضو</p></div>
            <div><p className="text-[10px] text-muted-foreground">البداية</p><p className="text-sm">{formatDate(p.startDate)}</p></div>
            <div><p className="text-[10px] text-muted-foreground">النهاية</p><p className="text-sm">{formatDate(p.endDate)}</p></div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">التقدم — {p.completedMilestones}/{p.milestones} معالم</span><span className="font-mono font-bold text-accent">{p.progress}%</span></div>
            <div className="h-2 rounded-full bg-card/80 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }} className={cn('h-full rounded-full', p.progress >= 80 ? 'bg-success' : p.progress >= 50 ? 'bg-accent' : 'bg-warning')} /></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MilestonesTab() {
  return (
    <div className="space-y-4">
      {milestones.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i }} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${m.status === 'completed' ? 'bg-success border-success' : m.status === 'in_progress' ? 'bg-accent border-accent animate-pulse' : 'bg-transparent border-muted-foreground/30'}`} />
            {i < milestones.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${m.status === 'completed' ? 'bg-success/30' : 'bg-border/30'}`} />}
          </div>
          <div className={`glass-card p-3 flex-1 mb-2 ${m.status === 'in_progress' ? 'border-accent/30' : ''}`}>
            <div className="flex items-center justify-between">
              <div><p className={`text-sm font-medium ${m.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}>{m.title}</p><p className="text-xs text-muted-foreground">{m.project}</p></div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatDate(m.date)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${m.status === 'completed' ? 'bg-success/15 text-success' : m.status === 'in_progress' ? 'bg-accent/15 text-accent' : 'bg-muted/50 text-muted-foreground'}`}>{m.status === 'completed' ? 'مكتمل' : m.status === 'in_progress' ? 'جاري' : 'قادم'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ResourcesTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-lg font-bold text-accent">{r.name.charAt(0)}</div>
              <div><p className="font-bold text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.role} — {r.projects} مشاريع</p></div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1"><span className="text-muted-foreground">نسبة الاستخدام</span><span className={cn('font-mono font-bold', r.utilization > 85 ? 'text-danger' : r.utilization > 60 ? 'text-accent' : 'text-success')}>{r.utilization}%</span></div>
              <div className="h-2 rounded-full bg-card/80 overflow-hidden"><div className={cn('h-full rounded-full', r.utilization > 85 ? 'bg-danger' : r.utilization > 60 ? 'bg-accent' : 'bg-success')} style={{ width: `${r.utilization}%` }} /></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="إدارة المشاريع" subtitle="المشاريع والمعالم والموارد والميزانيات" actions={<Button onClick={() => toast.info('مشروع جديد — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> مشروع جديد</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'milestones' && <MilestonesTab />}
            {activeTab === 'resources' && <ResourcesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
