/*
 * ReportsPage — مركز التقارير
 * تابات: التقارير المالية | التشغيلية | التسويقية | المخصصة
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, DollarSign, Settings, Megaphone, Plus, Download,
  BarChart3, TrendingUp, Calendar, Clock, Eye, Filter, Printer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const financialReports = [
  { id: 1, name: 'تقرير الإيرادات الشهري — مارس 2026', type: 'إيرادات', format: 'PDF', date: '2026-03-31', status: 'ready', size: '2.4 MB' },
  { id: 2, name: 'تقرير المصروفات — Q1 2026', type: 'مصروفات', format: 'Excel', date: '2026-03-31', status: 'ready', size: '1.8 MB' },
  { id: 3, name: 'تقرير الأرباح والخسائر', type: 'P&L', format: 'PDF', date: '2026-03-31', status: 'ready', size: '3.1 MB' },
  { id: 4, name: 'تقرير التدفقات النقدية', type: 'نقدية', format: 'PDF', date: '2026-03-31', status: 'generating', size: '—' },
  { id: 5, name: 'تقرير الفواتير المستحقة', type: 'فواتير', format: 'Excel', date: '2026-04-01', status: 'ready', size: '1.2 MB' },
  { id: 6, name: 'تقرير ZATCA الضريبي', type: 'ضريبي', format: 'PDF', date: '2026-03-31', status: 'ready', size: '4.5 MB' },
];

const operationalReports = [
  { id: 1, name: 'تقرير جاهزية المعرض', type: 'عمليات', format: 'PDF', date: '2026-04-01', status: 'ready', size: '1.5 MB' },
  { id: 2, name: 'تقرير أداء الفرق', type: 'HR', format: 'Excel', date: '2026-03-31', status: 'ready', size: '0.8 MB' },
  { id: 3, name: 'تقرير الأمن والسلامة', type: 'أمن', format: 'PDF', date: '2026-03-30', status: 'ready', size: '2.1 MB' },
  { id: 4, name: 'تقرير اللوجستيات والشحن', type: 'لوجستيات', format: 'Excel', date: '2026-03-31', status: 'generating', size: '—' },
  { id: 5, name: 'تقرير KYC والامتثال', type: 'امتثال', format: 'PDF', date: '2026-03-31', status: 'ready', size: '3.2 MB' },
  { id: 6, name: 'تقرير الحضور والانصراف', type: 'HR', format: 'Excel', date: '2026-03-31', status: 'ready', size: '0.9 MB' },
];

const marketingReports = [
  { id: 1, name: 'تقرير أداء الحملات الإعلانية', type: 'حملات', format: 'PDF', date: '2026-03-31', status: 'ready', size: '1.9 MB' },
  { id: 2, name: 'تقرير وسائل التواصل الاجتماعي', type: 'سوشال', format: 'PDF', date: '2026-03-31', status: 'ready', size: '1.1 MB' },
  { id: 3, name: 'تقرير معدل التحويل', type: 'تحويل', format: 'Excel', date: '2026-03-31', status: 'ready', size: '0.7 MB' },
  { id: 4, name: 'تقرير ROI التسويقي', type: 'ROI', format: 'PDF', date: '2026-03-31', status: 'ready', size: '1.4 MB' },
];

const revenueData = [
  { month: 'يناير', revenue: 850000, expenses: 620000 },
  { month: 'فبراير', revenue: 1200000, expenses: 780000 },
  { month: 'مارس', revenue: 1800000, expenses: 950000 },
  { month: 'أبريل', revenue: 1500000, expenses: 880000 },
  { month: 'مايو', revenue: 2200000, expenses: 1100000 },
  { month: 'يونيو', revenue: 2800000, expenses: 1300000 },
];

const kpiData = [
  { month: 'يناير', occupancy: 45, satisfaction: 82, conversion: 12 },
  { month: 'فبراير', occupancy: 58, satisfaction: 85, conversion: 15 },
  { month: 'مارس', occupancy: 72, satisfaction: 88, conversion: 18 },
  { month: 'أبريل', occupancy: 65, satisfaction: 86, conversion: 16 },
  { month: 'مايو', occupancy: 80, satisfaction: 90, conversion: 22 },
  { month: 'يونيو', occupancy: 92, satisfaction: 91, conversion: 25 },
];

type TabKey = 'financial' | 'operational' | 'marketing' | 'custom';
const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'financial', label: 'التقارير المالية', icon: DollarSign },
  { key: 'operational', label: 'التشغيلية', icon: Settings },
  { key: 'marketing', label: 'التسويقية', icon: Megaphone },
  { key: 'custom', label: 'تقارير مخصصة', icon: BarChart3 },
];

function ReportList({ reports }: { reports: typeof financialReports }) {
  return (
    <div className="space-y-3">
      {reports.map((r, i) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center"><FileText className="w-4 h-4 text-accent" /></div>
            <div>
              <p className="font-medium text-sm">{r.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs bg-card/80 px-2 py-0.5 rounded border border-border/50">{r.type}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/30 text-muted-foreground">{r.format}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
                {r.size !== '—' && <span className="text-xs text-muted-foreground">{r.size}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {r.status === 'ready' ? (
              <>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.info('عرض التقرير — قريباً')}><Eye className="w-3 h-3" /> عرض</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.info('تحميل التقرير — قريباً')}><Download className="w-3 h-3" /> تحميل</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.info('طباعة التقرير — قريباً')}><Printer className="w-3 h-3" /></Button>
              </>
            ) : (
              <span className="text-xs text-warning flex items-center gap-1"><Clock className="w-3 h-3 animate-spin" /> جاري الإنشاء...</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FinancialTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="إجمالي الإيرادات" value={formatCurrency(10350000)} icon={TrendingUp} trend={28} />
        <StatsCard title="صافي الربح" value={formatCurrency(4720000)} icon={DollarSign} trend={15} delay={0.1} />
        <StatsCard title="تقارير جاهزة" value={financialReports.filter(r => r.status === 'ready').length} icon={FileText} delay={0.2} />
        <StatsCard title="آخر تحديث" value="اليوم" icon={Calendar} delay={0.3} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">الإيرادات مقابل المصروفات (6 أشهر)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} tickFormatter={v => `${v / 1000000}M`} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: number) => [formatCurrency(v), '']} /><Bar dataKey="revenue" fill="#C9A84C" name="الإيرادات" radius={[4, 4, 0, 0]} /><Bar dataKey="expenses" fill="rgba(239,68,68,0.5)" name="المصروفات" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </motion.div>
      <ReportList reports={financialReports} />
    </div>
  );
}

function OperationalTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="جاهزية التشغيل" value="72%" icon={Settings} />
        <StatsCard title="المهام المكتملة" value="85%" icon={BarChart3} trend={12} delay={0.1} />
        <StatsCard title="تقارير جاهزة" value={operationalReports.filter(r => r.status === 'ready').length} icon={FileText} delay={0.2} />
        <StatsCard title="تنبيهات" value="3" icon={Clock} delay={0.3} />
      </div>
      <ReportList reports={operationalReports} />
    </div>
  );
}

function MarketingTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="معدل التحويل" value="18%" icon={TrendingUp} trend={25} />
        <StatsCard title="ROI التسويقي" value="340%" icon={DollarSign} trend={18} delay={0.1} />
        <StatsCard title="الحملات النشطة" value="5" icon={Megaphone} delay={0.2} />
        <StatsCard title="تقارير جاهزة" value={marketingReports.filter(r => r.status === 'ready').length} icon={FileText} delay={0.3} />
      </div>
      <ReportList reports={marketingReports} />
    </div>
  );
}

function CustomTab() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">مؤشرات الأداء الرئيسية (KPIs)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={kpiData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 10, fill: '#888' }} /><Tooltip contentStyle={{ background: '#1a1917', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} /><Line type="monotone" dataKey="occupancy" stroke="#C9A84C" name="نسبة الإشغال %" strokeWidth={2} dot={{ r: 3 }} /><Line type="monotone" dataKey="satisfaction" stroke="#10B981" name="رضا العملاء %" strokeWidth={2} dot={{ r: 3 }} /><Line type="monotone" dataKey="conversion" stroke="#3B82F6" name="معدل التحويل %" strokeWidth={2} dot={{ r: 3 }} /></LineChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4"><Filter className="w-6 h-6 text-accent" /></div>
        <h3 className="font-bold text-lg mb-2">إنشاء تقرير مخصص</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">اختر المؤشرات والفترة الزمنية والأقسام لإنشاء تقرير مخصص حسب احتياجاتك</p>
        <Button onClick={() => toast.info('منشئ التقارير — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> إنشاء تقرير مخصص</Button>
      </motion.div>
    </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('financial');
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader title="مركز التقارير" subtitle="التقارير المالية والتشغيلية والتسويقية والمخصصة" actions={<Button onClick={() => toast.info('إنشاء تقرير — قريباً')} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"><Plus className="w-4 h-4" /> تقرير جديد</Button>} />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all', activeTab === t.key ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-card/50 text-muted-foreground border border-border/50 hover:bg-card hover:text-foreground')}><t.icon className="w-4 h-4" />{t.label}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'financial' && <FinancialTab />}
            {activeTab === 'operational' && <OperationalTab />}
            {activeTab === 'marketing' && <MarketingTab />}
            {activeTab === 'custom' && <CustomTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
