/*
 * AuditLogPage — سجل التدقيق والأمان
 * تابات: سجل الأحداث | الأمان | تقارير التدقيق
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, Shield, FileText, Search, Clock, Eye, Download,
  AlertTriangle, CheckCircle, XCircle, Lock, Globe, Monitor,
  BarChart3, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatsCard from '@/components/shared/StatsCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AuditEntry {
  id: number; user: string; role: string; action: string; module: string;
  details: string; ip: string; device: string; timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

const mockAudit: AuditEntry[] = [
  { id: 1, user: 'نور كرم', role: 'مدير تنفيذي', action: 'تسجيل دخول', module: 'المصادقة', details: 'تسجيل دخول ناجح', ip: '192.168.1.100', device: 'Chrome / macOS', timestamp: '2026-04-01 09:15', severity: 'info' },
  { id: 2, user: 'أحمد العتيبي', role: 'مدير مبيعات', action: 'تعديل عقد', module: 'العقود', details: 'تعديل عقد #C-2026-045 — تغيير قيمة العقد', ip: '192.168.1.105', device: 'Firefox / Windows', timestamp: '2026-04-01 09:30', severity: 'warning' },
  { id: 3, user: 'سارة المالكي', role: 'محاسبة', action: 'إنشاء فاتورة', module: 'المالية', details: 'فاتورة #INV-2026-089 بقيمة 150,000 ر.س', ip: '192.168.1.110', device: 'Chrome / Windows', timestamp: '2026-04-01 10:00', severity: 'info' },
  { id: 4, user: 'نظام AI', role: 'نظام', action: 'تنبيه تلقائي', module: 'الامتثال', details: 'اقتراب انتهاء شهادة ZATCA — 15 يوم متبقي', ip: 'system', device: 'System', timestamp: '2026-04-01 10:15', severity: 'warning' },
  { id: 5, user: 'خالد الحربي', role: 'مدير عمليات', action: 'حذف مستند', module: 'المستندات', details: 'حذف مستند قديم — عقد منتهي #C-2025-012', ip: '192.168.1.120', device: 'Safari / macOS', timestamp: '2026-04-01 10:30', severity: 'critical' },
  { id: 6, user: 'فاطمة أحمد', role: 'مدير HR', action: 'تحديث موظف', module: 'الموارد البشرية', details: 'تحديث بيانات الموظف #EMP-045', ip: '192.168.1.115', device: 'Chrome / Windows', timestamp: '2026-04-01 11:00', severity: 'info' },
  { id: 7, user: 'مجهول', role: '—', action: 'محاولة دخول فاشلة', module: 'المصادقة', details: '3 محاولات فاشلة — IP محظور مؤقتاً', ip: '45.33.32.156', device: 'Unknown', timestamp: '2026-04-01 11:15', severity: 'critical' },
  { id: 8, user: 'نور كرم', role: 'مدير تنفيذي', action: 'تغيير صلاحيات', module: 'الصلاحيات', details: 'منح صلاحية "إدارة العقود" لـ أحمد العتيبي', ip: '192.168.1.100', device: 'Chrome / macOS', timestamp: '2026-04-01 11:30', severity: 'warning' },
  { id: 9, user: 'سارة المالكي', role: 'محاسبة', action: 'تصدير تقرير', module: 'التقارير', details: 'تصدير تقرير الإيرادات الشهري — PDF', ip: '192.168.1.110', device: 'Chrome / Windows', timestamp: '2026-04-01 12:00', severity: 'info' },
  { id: 10, user: 'نظام AI', role: 'نظام', action: 'فحص أمني', module: 'الأمان', details: 'فحص أمني دوري — لا توجد تهديدات', ip: 'system', device: 'System', timestamp: '2026-04-01 12:30', severity: 'info' },
];

const securityEvents = [
  { type: 'محاولة دخول فاشلة', count: 12, ip: '45.33.32.156', lastAttempt: '2026-04-01 11:15', status: 'blocked' as const },
  { type: 'تغيير كلمة مرور', count: 3, ip: '192.168.1.100', lastAttempt: '2026-03-30 14:20', status: 'normal' as const },
  { type: 'دخول من جهاز جديد', count: 5, ip: '10.0.0.50', lastAttempt: '2026-03-31 09:00', status: 'warning' as const },
  { type: 'تصدير بيانات حساسة', count: 2, ip: '192.168.1.110', lastAttempt: '2026-04-01 12:00', status: 'normal' as const },
  { type: 'تغيير صلاحيات', count: 4, ip: '192.168.1.100', lastAttempt: '2026-04-01 11:30', status: 'warning' as const },
];

const activityByModule = [
  { module: 'المصادقة', count: 45 }, { module: 'العقود', count: 32 },
  { module: 'المالية', count: 28 }, { module: 'المستندات', count: 22 },
  { module: 'HR', count: 18 }, { module: 'الأمان', count: 15 },
];

const severityData = [
  { name: 'معلومات', value: 65, color: '#3B82F6' },
  { name: 'تحذير', value: 25, color: '#F59E0B' },
  { name: 'حرج', value: 10, color: '#EF4444' },
];

type TabKey = 'log' | 'security' | 'reports';
const tabsList: { key: TabKey; label: string; icon: any }[] = [
  { key: 'log', label: 'سجل الأحداث', icon: History },
  { key: 'security', label: 'الأمان', icon: Shield },
  { key: 'reports', label: 'تقارير التدقيق', icon: FileText },
];

function LogTab() {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const filtered = mockAudit.filter(a => {
    const ms = a.user.includes(search) || a.action.includes(search) || a.module.includes(search) || a.details.includes(search);
    const mf = filterSeverity === 'all' || a.severity === filterSeverity;
    return ms && mf;
  });
  const columns: Column<AuditEntry>[] = [
    { key: 'timestamp', label: 'الوقت', render: v => <span className="text-xs font-mono text-muted-foreground">{v}</span> },
    { key: 'user', label: 'المستخدم', render: (_, r) => (
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${r.role === 'نظام' || r.role === '—' ? 'bg-info/10 text-info border border-info/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>{r.user.charAt(0)}</div>
        <div><p className="text-xs font-medium">{r.user}</p><p className="text-[10px] text-muted-foreground">{r.role}</p></div>
      </div>
    )},
    { key: 'action', label: 'الإجراء', render: v => {
      const colors: Record<string, string> = { 'إنشاء فاتورة': 'bg-success/15 text-success', 'تعديل عقد': 'bg-info/15 text-info', 'حذف مستند': 'bg-danger/15 text-danger', 'تسجيل دخول': 'bg-accent/15 text-accent', 'تصدير تقرير': 'bg-muted/30 text-muted-foreground', 'محاولة دخول فاشلة': 'bg-danger/15 text-danger' };
      return <span className={cn('text-[10px] px-2 py-0.5 rounded-full', colors[v] || 'bg-card/80 text-foreground')}>{v}</span>;
    }},
    { key: 'module', label: 'القسم', render: v => <span className="text-xs bg-card/80 px-2 py-0.5 rounded border border-border/50">{v}</span> },
    { key: 'details', label: 'التفاصيل', render: v => <span className="text-xs text-muted-foreground max-w-[200px] truncate block">{v}</span> },
    { key: 'severity', label: 'الخطورة', render: v => (
      <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${v === 'critical' ? 'bg-danger/15 text-danger' : v === 'warning' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'}`}>
        {v === 'critical' ? <XCircle className="w-2.5 h-2.5" /> : v === 'warning' ? <AlertTriangle className="w-2.5 h-2.5" /> : <CheckCircle className="w-2.5 h-2.5" />}
        {v === 'critical' ? 'حرج' : v === 'warning' ? 'تحذير' : 'معلومات'}
      </span>
    )},
    { key: 'ip', label: 'IP', render: v => <span className="text-[10px] font-mono text-muted-foreground">{v}</span> },
  ];
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all', 'info', 'warning', 'critical'].map(s => (
          <button key={s} onClick={() => setFilterSeverity(s)} className={cn('px-3 py-1.5 rounded-lg text-xs transition-colors', filterSeverity === s ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card')}>
            {s === 'all' ? 'الكل' : s === 'info' ? 'معلومات' : s === 'warning' ? 'تحذير' : 'حرج'}
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} searchValue={search} onSearch={setSearch} searchPlaceholder="بحث في السجل..." emptyMessage="لا توجد أحداث" />
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="محاولات دخول فاشلة" value={12} icon={Lock} />
        <StatsCard title="IPs محظورة" value={3} icon={Globe} delay={0.1} />
        <StatsCard title="أجهزة جديدة" value={5} icon={Monitor} delay={0.2} />
        <StatsCard title="مستوى الأمان" value="92%" icon={Shield} trend={5} delay={0.3} />
      </div>
      <div className="space-y-3">
        {securityEvents.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className={`glass-card p-4 flex items-center justify-between ${e.status === 'blocked' ? 'border-danger/30' : e.status === 'warning' ? 'border-warning/30' : ''}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${e.status === 'blocked' ? 'bg-danger/10 border border-danger/20' : e.status === 'warning' ? 'bg-warning/10 border border-warning/20' : 'bg-success/10 border border-success/20'}`}>
                {e.status === 'blocked' ? <XCircle className="w-4 h-4 text-danger" /> : e.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-warning" /> : <CheckCircle className="w-4 h-4 text-success" />}
              </div>
              <div><p className="font-medium text-sm">{e.type}</p><p className="text-xs text-muted-foreground">IP: {e.ip} — آخر: {e.lastAttempt}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold">{e.count}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${e.status === 'blocked' ? 'bg-danger/15 text-danger' : e.status === 'warning' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}`}>{e.status === 'blocked' ? 'محظور' : e.status === 'warning' ? 'تحذير' : 'طبيعي'}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">النشاط حسب القسم</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityByModule} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis type="number" tick={{ fontSize: 10, fill: '#888' }} /><YAxis type="category" dataKey="module" tick={{ fontSize: 10, fill: '#888' }} width={70} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /><Bar dataKey="count" fill="#C9A84C" name="عدد الأحداث" radius={[0, 4, 4, 0]} /></BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4">توزيع الخطورة</h3>
          <ResponsiveContainer width="100%" height={160}>
            <RPieChart><Pie data={severityData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">{severityData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></RPieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">{severityData.map(s => <div key={s.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name}</span><span className="font-mono">{s.value}%</span></div>)}</div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ title: 'تقرير التدقيق الشهري', date: 'مارس 2026', status: 'ready' }, { title: 'تقرير الامتثال الأمني', date: 'Q1 2026', status: 'ready' }, { title: 'تقرير تحليل التهديدات', date: 'أبريل 2026', status: 'generating' }].map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + 0.05 * i }} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-accent" /><span className="text-sm font-medium">{r.title}</span></div>
            <p className="text-xs text-muted-foreground mb-3">{r.date}</p>
            {r.status === 'ready' ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs flex-1 gap-1" onClick={() => toast.info('عرض — قريباً')}><Eye className="w-3 h-3" /> عرض</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs flex-1 gap-1" onClick={() => toast.info('تحميل — قريباً')}><Download className="w-3 h-3" /> تحميل</Button>
              </div>
            ) : (
              <span className="text-xs text-warning flex items-center gap-1"><Activity className="w-3 h-3 animate-pulse" /> جاري الإنشاء...</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AuditLogPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('log');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="سجل التدقيق والأمان" subtitle="تتبع جميع الأحداث والإجراءات في النظام" actions={<Button onClick={() => toast.info('تصدير السجل — قريباً')} variant="outline" className="gap-2"><Download className="w-4 h-4" /> تصدير</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabsList.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'log' && <LogTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
